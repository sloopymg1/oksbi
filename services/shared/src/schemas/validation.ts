import { z } from 'zod';

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
  status: z.enum(['draft', 'submitted', 'approved']).default('draft'),
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
export type ReleaseUpsertRequest = z.infer<typeof releaseUpsertSchema>;
export type RecordingUpsertRequest = z.infer<typeof recordingUpsertSchema>;
export type CompositionUpsertRequest = z.infer<typeof compositionUpsertSchema>;
export type RightsSplitUpdateRequest = z.infer<typeof rightsSplitUpdateSchema>;
export type RoyaltyStatementQuery = z.infer<typeof royaltyStatementQuerySchema>;
export type PayoutRequestBody = z.infer<typeof payoutRequestSchema>;
export type SmartLinkRequestBody = z.infer<typeof smartLinkRequestSchema>;
export type SupportCaseRequestBody = z.infer<typeof supportCaseRequestSchema>;
export type TakedownRequestBody = z.infer<typeof takedownRequestSchema>;
export type AdminOperationRequest = z.infer<typeof adminOperationSchema>;