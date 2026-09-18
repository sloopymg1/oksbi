import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { parseJsonBody, type RouteDefinition } from '../http.js';
import { musicSubmissionSchema, type MusicSubmission, type OnboardingProfile, type User } from '../shared.js';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors/errorTypes.js';
import { createAuditFields, touchAuditFields } from '../utils/records.js';
import type { DatabaseService } from '../services/interfaces.js';

async function owned(db: DatabaseService, id: string, actor: User) {
  const item = await db.findById<MusicSubmission>('musicSubmission', id);
  if (!item) throw new NotFoundError('Music submission', id);
  if (item.ownerUserId !== actor.id && !actor.roles.includes('admin')) throw new ForbiddenError();
  return item;
}
const reviewSchema = z.object({
  destination: z.string().min(1),
  status: z.enum(['needs_changes', 'sent', 'registered']),
  reference: z.string().trim().max(180).default(''),
  notes: z.string().trim().max(2000).default(''),
}).refine(value => value.status !== 'registered' || value.reference.length > 0, 'Society confirmation reference is required')
  .refine(value => value.status !== 'needs_changes' || value.notes.length > 0, 'Explain the changes needed');

export const musicRoutes: RouteDefinition[] = [
  { method: 'GET', path: '/onboarding', summary: 'Get musician profile', requiresAuth: true,
    handler: async ({ services, currentUser }) => ({ status: 200, body: { profile: await services.database.findFirst('onboardingProfile', { userId: currentUser!.id }) } }) },
  { method: 'GET', path: '/music', summary: 'List music and society registrations', requiresAuth: true,
    handler: async ({ services, currentUser }) => {
      const items = await services.database.findMany<MusicSubmission>('musicSubmission', { filter: currentUser!.roles.includes('admin') ? {} : { ownerUserId: currentUser!.id }, orderBy: 'createdAt', orderDirection: 'desc' });
      return { status: 200, body: { items } };
    } },
  { method: 'POST', path: '/music', summary: 'Create music submission', requiresAuth: true,
    handler: async ({ req, services, currentUser }) => {
      const metadata = await parseJsonBody(req, musicSubmissionSchema);
      const profile = await services.database.findFirst<OnboardingProfile>('onboardingProfile', { userId: currentUser!.id });
      if (!profile || profile.status === 'draft') throw new BadRequestError('Complete your musician profile before uploading music.');
      const item = await services.database.create('musicSubmission', { ...createAuditFields(currentUser!), ownerUserId: currentUser!.id, artistName: profile.artistName, metadata, status: 'draft', registrations: JSON.stringify([]) });
      return { status: 201, body: { item } };
    } },
  { method: 'PUT', path: '/music/:id/audio', summary: 'Upload a WAV, MP3 or FLAC master (maximum 50 MB)', requiresAuth: true,
    handler: async ({ req, params, services, currentUser }) => {
      const item = await owned(services.database, params.id!, currentUser!);
      if (item.status !== 'draft') throw new BadRequestError('Submitted music cannot be replaced.');
      const chunks: Buffer[] = []; let size = 0;
      for await (const chunk of req) {
        const data = Buffer.from(chunk); size += data.length;
        if (size > 50 * 1024 * 1024) throw new BadRequestError('Audio must be 50 MB or smaller.');
        chunks.push(data);
      }
      const data = Buffer.concat(chunks);
      const wav = data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WAVE';
      const flac = data.toString('ascii', 0, 4) === 'fLaC';
      const mp3 = data.toString('ascii', 0, 3) === 'ID3' || (data[0] === 255 && ((data[1] ?? 0) & 224) === 224);
      if (data.length < 12 || !(wav || flac || mp3)) throw new BadRequestError('Choose a valid WAV, MP3 or FLAC audio file.');
      const blob = `${item.ownerUserId}/${item.id}/${randomUUID()}`;
      const path = await services.storage.uploadBuffer('music-masters', blob, data, wav ? 'audio/wav' : flac ? 'audio/flac' : 'audio/mpeg');
      try {
        await services.database.transaction(async db => {
          await db.query('SELECT id FROM music_submissions WHERE id = $1 FOR UPDATE', [item.id]);
          const latest = await owned(db, item.id, currentUser!);
          if (latest.status !== 'draft') throw new BadRequestError('Music has already been submitted.');
          await db.update('musicSubmission', item.id, { audioBlobPath: path, ...touchAuditFields(currentUser!) });
        });
      } catch (error) {
        await services.storage.deleteObject('music-masters', blob);
        throw error;
      }
      return { status: 200, body: { uploaded: true } };
    } },
  { method: 'POST', path: '/music/:id/submit', summary: 'Send music to OKSBI for society review', requiresAuth: true,
    handler: async ({ services, params, currentUser }) => {
      const item = await services.database.transaction(async db => {
        await db.query('SELECT id FROM music_submissions WHERE id = $1 FOR UPDATE', [params.id]);
        const existing = await owned(db, params.id!, currentUser!);
        if (existing.status === 'submitted') return existing;
        if (!existing.audioBlobPath) throw new BadRequestError('Upload your audio before submitting.');
        musicSubmissionSchema.parse(existing.metadata);
        return db.update('musicSubmission', existing.id, { status: 'submitted', registrations: JSON.stringify(existing.metadata.destinations.map(destination => ({ ...destination, status: 'pending_review', reference: '', notes: '' }))), ...touchAuditFields(currentUser!) });
      });
      return { status: 200, body: { item } };
    } },
  { method: 'PATCH', path: '/music/:id/registration', summary: 'Record society delivery or confirmation', requiresAuth: true,
    handler: async ({ req, params, services, currentUser }) => {
      if (!currentUser!.roles.includes('admin')) throw new ForbiddenError('Only OKSBI administrators can record society updates.');
      const input = await parseJsonBody(req, reviewSchema);
      const item = await services.database.transaction(async db => {
        await db.query('SELECT id FROM music_submissions WHERE id = $1 FOR UPDATE', [params.id]);
        const existing = await owned(db, params.id!, currentUser!);
        const registration = existing.registrations.find(row => row.name === input.destination);
        if (!registration || existing.status !== 'submitted') throw new BadRequestError('Unknown submitted destination.');
        if (registration.status === 'registered' || (input.status === 'registered' && registration.status !== 'sent')) throw new BadRequestError('Record delivery before registration; confirmed registrations cannot be overwritten.');
        Object.assign(registration, { status: input.status, reference: input.reference, notes: input.notes });
        return db.update('musicSubmission', existing.id, { registrations: JSON.stringify(existing.registrations), ...touchAuditFields(currentUser!) });
      });
      return { status: 200, body: { item } };
    } },
];
