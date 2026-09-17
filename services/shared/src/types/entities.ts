export type UserRole = 'creator' | 'admin' | 'support';

export interface AuditFields {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface User extends AuditFields {
  id: string;
  email: string;
  displayName: string;
  roles: UserRole[];
  organizationId?: string;
  onboardingCompleted: boolean;
}

export interface Session extends AuditFields {
  id: string;
  userId: string;
  expiresAt: string;
  revokedAt?: string;
}

export interface OnboardingProfile extends AuditFields {
  id: string;
  userId: string;
  organizationName: string;
  artistName: string;
  countryCode: string;
  taxResidenceCountry: string;
  status: 'draft' | 'submitted' | 'approved';
}

export interface Release extends AuditFields {
  id: string;
  ownerUserId: string;
  title: string;
  upc?: string;
  artworkBlobPath?: string;
  releaseDate: string;
  status: 'draft' | 'review' | 'scheduled' | 'released';
}

export interface Recording extends AuditFields {
  id: string;
  releaseId: string;
  title: string;
  isrc?: string;
  durationSeconds: number;
  explicit: boolean;
}

export interface Composition extends AuditFields {
  id: string;
  ownerUserId: string;
  title: string;
  iswc?: string;
  publisherName?: string;
  status: 'draft' | 'registered' | 'disputed';
}

export interface RightsSplit extends AuditFields {
  id: string;
  compositionId: string;
  versionName: string;
  status: 'pending_review' | 'approved' | 'rejected';
  interests: Array<{
    partyName: string;
    role: string;
    percentage: number;
  }>;
}

export interface RoyaltyStatement extends AuditFields {
  id: string;
  organizationId: string;
  statementMonth: string;
  currencyCode: string;
  grossAmount: string;
  netAmount: string;
  status: 'processing' | 'available' | 'reconciled';
}

export interface PayoutRequest extends AuditFields {
  id: string;
  userId: string;
  amount: string;
  currencyCode: string;
  destinationLabel: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
}

export interface SmartLink extends AuditFields {
  id: string;
  releaseId: string;
  slug: string;
  title: string;
  destinations: Array<{
    platform: string;
    url: string;
  }>;
}

export interface SupportCase extends AuditFields {
  id: string;
  userId: string;
  category: 'general' | 'royalties' | 'rights' | 'distribution';
  subject: string;
  description: string;
  status: 'open' | 'in_review' | 'resolved';
}

export interface TakedownRequest extends AuditFields {
  id: string;
  userId: string;
  targetType: 'recording' | 'release' | 'smart_link';
  targetId: string;
  reason: string;
  status: 'submitted' | 'under_review' | 'completed';
}

export interface AdminOperation extends AuditFields {
  id: string;
  actorUserId: string;
  operationType: 'grant_role' | 'ledger_adjustment' | 'provider_retry' | 'account_lock';
  targetId: string;
  notes?: string;
}

export interface ServiceHealth {
  ok: boolean;
  checks: Record<string, boolean>;
}