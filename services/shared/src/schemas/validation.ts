import { z } from 'zod';
import { musicOrganizations } from '../organizations.js';

export const paginationSchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(25),
  offset: z.coerce.number().int().min(0).default(0),
});

export const registerRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(12),
  displayName: z.string().min(2).max(120),
});

export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const onboardingRequestSchema = z.object({
  organizationName: z.string().min(2).max(160),
  artistName: z.string().min(2).max(160),
  countryCode: z.string().length(2).toUpperCase(),
  taxResidenceCountry: z.string().length(2).toUpperCase(),
  status: z.enum(['in_process', 'approved', 'suspended', 'contact_admin']).default('in_process'),
  registrationData: z.object({
    title: z.string().max(20).default(''), legalLastName: z.string().max(120).default(''), legalFirstName: z.string().max(120).default(''), otherNames: z.string().max(180).default(''),
    idType: z.string().max(60).default(''), idNumber: z.string().max(100).default(''), nationality: z.string().max(80).default(''), dateOfBirth: z.string().max(30).default(''),
    roles: z.array(z.string().max(80)).max(10).default([]), gender: z.string().max(40).default(''), email: z.email().or(z.literal('')).default(''), phone: z.string().max(40).default(''),
    region: z.string().max(100).default(''), district: z.string().max(100).default(''), residentialAddress: z.string().max(500).default(''), digitalAddress: z.string().max(120).default(''), hometown: z.string().max(120).default(''),
    socialLinks: z.object({ instagram: z.string().max(200).default(''), facebook: z.string().max(200).default(''), x: z.string().max(200).default(''), youtube: z.string().max(200).default(''), website: z.string().max(200).default('') }).default({ instagram: '', facebook: '', x: '', youtube: '', website: '' }),
    recordLabel: z.string().max(180).default(''), performingRightsMember: z.enum(['yes', 'no']).default('no'), mechanicalRightsMember: z.enum(['yes', 'no']).default('no'), excludeTerritories: z.enum(['yes', 'no']).default('no'), excludedCountries: z.string().max(500).default(''),
    paymentDetails: z.enum(['bank', 'mobile_money', 'both']).default('bank'), nextOfKin: z.object({ name: z.string().max(160).default(''), relationship: z.string().max(80).default(''), phone: z.string().max(40).default('') }).default({ name: '', relationship: '', phone: '' }), termsAccepted: z.boolean().refine(value => value, 'Terms must be accepted'),
  }).default({ title: '', legalLastName: '', legalFirstName: '', otherNames: '', idType: '', idNumber: '', nationality: '', dateOfBirth: '', roles: [], gender: '', email: '', phone: '', region: '', district: '', residentialAddress: '', digitalAddress: '', hometown: '', socialLinks: { instagram: '', facebook: '', x: '', youtube: '', website: '' }, recordLabel: '', performingRightsMember: 'no', mechanicalRightsMember: 'no', excludeTerritories: 'no', excludedCountries: '', paymentDetails: 'bank', nextOfKin: { name: '', relationship: '', phone: '' }, termsAccepted: false }),
});

export const musicianStatusSchema = z.object({
  status: z.enum(['approved', 'in_process', 'suspended', 'contact_admin']),
});

export const societyCreateSchema = z.object({
  name: z.string().trim().min(2).max(180),
  kind: z.enum(['PRO', 'CMO', 'publisher']),
  region: z.string().trim().min(2).max(120),
  website: z.url(),
  description: z.string().trim().min(10).max(1000),
});

export const musicSearchSchema = z.object({
  title: z.string().trim().min(2).max(180),
  artistName: z.string().trim().max(180).default(''),
  contributors: z.array(z.object({ name: z.string().trim().min(2).max(160), role: z.string().max(80).default(''), ipi: z.string().max(40).default(''), society: z.string().max(160).default('') })).max(50).default([]),
  isrc: z.string().trim().max(32).default(''),
  iswc: z.string().trim().max(32).default(''),
  urls: z.array(z.url()).max(5).default([]),
});

export const releaseUpsertSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1).max(180),
  upc: z.string().min(8).max(32).optional(),
  artworkBlobPath: z.string().min(1).optional(),
  releaseDate: z.iso.datetime(),
  status: z.enum(['draft', 'review', 'scheduled', 'released']).default('draft'),
});

export const recordingUpsertSchema = z.object({
  id: z.string().min(1).optional(),
  releaseId: z.string().min(1),
  title: z.string().min(1).max(180),
  isrc: z.string().min(12).max(32).optional(),
  durationSeconds: z.number().int().positive(),
  explicit: z.boolean().default(false),
});

export const compositionUpsertSchema = z.object({
  id: z.string().min(1).optional(),
  title: z.string().min(1).max(180),
  iswc: z.string().min(10).max(32).optional(),
  publisherName: z.string().min(1).max(180).optional(),
  status: z.enum(['draft', 'registered', 'disputed']).default('draft'),
});

export const rightsSplitUpdateSchema = z.object({
  id: z.string().min(1).optional(),
  compositionId: z.string().min(1),
  versionName: z.string().min(1).max(120),
  status: z.enum(['pending_review', 'approved', 'rejected']).default('pending_review'),
  interests: z.array(
    z.object({
      partyName: z.string().min(1).max(120),
      role: z.string().min(1).max(80),
      percentage: z.number().min(0).max(100),
    }),
  ).min(1),
});

export const royaltyStatementQuerySchema = z.object({
  organizationId: z.string().min(1).optional(),
  status: z.enum(['processing', 'available', 'reconciled']).optional(),
  limit: z.coerce.number().int().positive().max(100).default(25),
  offset: z.coerce.number().int().min(0).default(0),
});

export const payoutRequestSchema = z.object({
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currencyCode: z.string().length(3).toUpperCase(),
  destinationLabel: z.string().min(1).max(160),
});

export const smartLinkRequestSchema = z.object({
  id: z.string().min(1).optional(),
  releaseId: z.string().min(1),
  slug: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(180),
  destinations: z.array(
    z.object({
      platform: z.string().min(1).max(80),
      url: z.url(),
    }),
  ).min(1),
});

export const supportCaseRequestSchema = z.object({
  category: z.enum(['general', 'royalties', 'rights', 'distribution']),
  subject: z.string().min(1).max(180),
  description: z.string().min(10).max(4000),
});

export const knowledgeDocumentSchema = z.object({
  title: z.string().trim().min(2).max(180),
  source: z.string().trim().min(1).max(300),
  content: z.string().trim().min(20).max(100000),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
});

export const knowledgeQuestionSchema = z.object({
  question: z.string().trim().min(3).max(1000),
});

export const researchQuestionSchema = knowledgeQuestionSchema.extend({
  urls: z.array(z.url()).max(5).default([]),
});

export const takedownRequestSchema = z.object({
  targetType: z.enum(['recording', 'release', 'smart_link']),
  targetId: z.string().min(1),
  reason: z.string().min(10).max(4000),
});

export const adminOperationSchema = z.object({
  operationType: z.enum(['grant_role', 'ledger_adjustment', 'provider_retry', 'account_lock']),
  targetId: z.string().min(1),
  notes: z.string().min(1).max(4000).optional(),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type OnboardingRequest = z.infer<typeof onboardingRequestSchema>;
export type MusicianStatusRequest = z.infer<typeof musicianStatusSchema>;
export type SocietyCreateRequest = z.infer<typeof societyCreateSchema>;
export type MusicSearchQuery = z.infer<typeof musicSearchSchema>;
export type ReleaseUpsertRequest = z.infer<typeof releaseUpsertSchema>;
export type RecordingUpsertRequest = z.infer<typeof recordingUpsertSchema>;
export type CompositionUpsertRequest = z.infer<typeof compositionUpsertSchema>;
export type RightsSplitUpdateRequest = z.infer<typeof rightsSplitUpdateSchema>;
export type RoyaltyStatementQuery = z.infer<typeof royaltyStatementQuerySchema>;
export type PayoutRequestBody = z.infer<typeof payoutRequestSchema>;
export type SmartLinkRequestBody = z.infer<typeof smartLinkRequestSchema>;
export type SupportCaseRequestBody = z.infer<typeof supportCaseRequestSchema>;
export type KnowledgeDocumentRequest = z.infer<typeof knowledgeDocumentSchema>;
export type KnowledgeQuestion = z.infer<typeof knowledgeQuestionSchema>;
export type ResearchQuestion = z.infer<typeof researchQuestionSchema>;
export type TakedownRequestBody = z.infer<typeof takedownRequestSchema>;
export type AdminOperationRequest = z.infer<typeof adminOperationSchema>;

export const musicSubmissionSchema = z.object({
  title: z.string().trim().min(1).max(180),
  language: z.string().trim().min(2).max(80),
  isrc: z.string().trim().max(32).default(''),
  iswc: z.string().trim().max(32).default(''),
  publisherName: z.string().trim().max(180).default(''),
  contributors: z.array(z.object({
    name: z.string().trim().min(2).max(160),
    role: z.enum(['composer', 'lyricist', 'composer_lyricist']),
    share: z.number().positive().max(100),
    ipi: z.string().trim().max(32).default(''),
    society: z.string().trim().max(160).default(''),
  })).min(1).max(50).refine(rows => Math.abs(rows.reduce((sum, row) => sum + row.share, 0) - 100) < 0.001, 'Writer shares must total 100%'),
  destinations: z.array(z.object({
    organizationId: z.string().optional(),
    name: z.string().trim().min(2).max(160),
    kind: z.enum(['PRO', 'CMO', 'publisher']),
    territory: z.string().trim().min(2).max(120),
  }).refine(row => !row.organizationId || musicOrganizations.some(org => org.id === row.organizationId && org.name === row.name && org.kind === row.kind), 'Select a valid organization from the directory')).min(1).max(20).refine(rows => new Set(rows.map(row => row.name.toLowerCase())).size === rows.length, 'Choose each organization once'),
  authorized: z.literal(true),
});
export type MusicSubmissionInput = z.infer<typeof musicSubmissionSchema>;

// Require directory selections for new intake; retain legacy drafts for resubmission.
export const newMusicSubmissionSchema = musicSubmissionSchema.refine(input => input.destinations.every(row => !!row.organizationId), 'Choose destinations from the provided directory');
