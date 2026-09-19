import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { newMusicSubmissionSchema, musicSubmissionSchema, musicOrganizations } from '../src/shared.js';
import { musicRoutes } from '../src/routes/music.js';

const metadata = { title: 'First song', language: 'English', contributors: [{ name: 'Test Writer', role: 'composer', share: 100 }], destinations: [{ organizationId: 'bmi', name: 'BMI', kind: 'PRO', territory: 'Ghana' }], authorized: true };
function fixture() {
  const records = new Map<string, any>();
  const database: any = {
    findFirst: async () => ({ artistName: 'Test Artist', status: 'submitted' }),
    findById: async (_: string, id: string) => records.get(id),
    findMany: async (_: string, options: any) => [...records.values()].filter(item => !options.filter.ownerUserId || item.ownerUserId === options.filter.ownerUserId),
    create: async (_: string, item: any) => { item.registrations = JSON.parse(item.registrations); records.set(item.id, item); return item; },
    update: async (_: string, id: string, changes: any) => { if (changes.registrations) changes.registrations = JSON.parse(changes.registrations); return Object.assign(records.get(id), changes); },
    query: async () => [],
    transaction: async (fn: any) => fn(database),
  };
  let uploads = 0;
  const services = { database, storage: { uploadBuffer: async () => { uploads++; return 'private/audio'; }, deleteObject: async () => {} } };
  async function call(method: string, path: string, body?: unknown, id?: string, role = 'creator', userId = 'owner') {
    const route = musicRoutes.find(route => route.method === method && route.path === path)!;
    return route.handler({ services, currentUser: { id: userId, roles: [role] }, params: { id }, req: Readable.from(body instanceof Buffer ? [body] : body ? [JSON.stringify(body)] : []), query: new URLSearchParams() } as any);
  }
  return { call, records, uploads: () => uploads };
}
test('writer totals, authorization and duplicate societies are validated', () => {
  assert.equal(musicSubmissionSchema.safeParse(metadata).success, true);
  assert.equal(musicSubmissionSchema.safeParse({ ...metadata, authorized: false }).success, false);
  assert.equal(musicSubmissionSchema.safeParse({ ...metadata, contributors: [{ ...metadata.contributors[0], share: 80 }] }).success, false);
  assert.equal(musicSubmissionSchema.safeParse({ ...metadata, destinations: [...metadata.destinations, ...metadata.destinations] }).success, false);
});
test('upload, submit, delivery and confirmed registration lifecycle', async () => {
  const { call, records, uploads } = fixture();
  const created = await call('POST', '/music', metadata);
  const id = (created.body as any).item.id;
  await assert.rejects(call('POST', '/music/:id/submit', undefined, id), /Upload your audio/);
  await assert.rejects(call('PUT', '/music/:id/audio', Buffer.from('not real audio'), id), /valid WAV/);
  assert.equal(uploads(), 0);
  await call('PUT', '/music/:id/audio', Buffer.from('RIFF0000WAVEdata'), id);
  await call('POST', '/music/:id/submit', undefined, id);
  await call('POST', '/music/:id/submit', undefined, id);
  assert.equal(records.get(id).registrations.length, 1);
  await assert.rejects(call('PUT', '/music/:id/audio', Buffer.from('RIFF0000WAVEdata'), id), /cannot be replaced/);
  const review = { destination: 'BMI', status: 'registered', reference: 'CONF-123' };
  await assert.rejects(call('PATCH', '/music/:id/registration', review, id), /administrators/);
  await assert.rejects(call('PATCH', '/music/:id/registration', review, id, 'admin'), /Record delivery/);
  await call('PATCH', '/music/:id/registration', { ...review, status: 'sent' }, id, 'admin');
  await assert.rejects(call('PATCH', '/music/:id/registration', { ...review, reference: '' }, id, 'admin'));
  await call('PATCH', '/music/:id/registration', review, id, 'admin');
  assert.equal(records.get(id).registrations[0].status, 'registered');
});
test('another musician cannot list, upload or submit owned music', async () => {
  const { call } = fixture();
  const id = ((await call('POST', '/music', metadata)).body as any).item.id;
  assert.deepEqual(((await call('GET', '/music', undefined, undefined, 'creator', 'other')).body as any).items, []);
  await assert.rejects(call('PUT', '/music/:id/audio', Buffer.from('RIFF0000WAVEdata'), id, 'creator', 'other'), /Insufficient permissions/);
  await assert.rejects(call('POST', '/music/:id/submit', undefined, id, 'creator', 'other'), /Insufficient permissions/);
});

test('directory selections support publishers and reject unknown or mismatched entries', () => {
  for (const organization of musicOrganizations) {
    assert.equal(newMusicSubmissionSchema.safeParse({ ...metadata, destinations: [{ organizationId: organization.id, name: organization.name, kind: organization.kind, territory: 'Ghana' }] }).success, true);
  }
  for (const change of [{ organizationId: 'unknown' }, { name: 'Fake BMI' }, { kind: 'publisher' }, { organizationId: undefined }]) {
    assert.equal(newMusicSubmissionSchema.safeParse({ ...metadata, destinations: [{ ...metadata.destinations[0], ...change }] }).success, false);
  }
  assert.equal(musicSubmissionSchema.safeParse({ ...metadata, destinations: [{ name: 'Legacy Society', kind: 'PRO', territory: 'Ghana' }] }).success, true);
});
test('directory endpoint exposes the same organizations used by validation', async () => {
  const { call } = fixture();
  assert.deepEqual(((await call('GET', '/music/organizations')).body as any).items, musicOrganizations);
});
