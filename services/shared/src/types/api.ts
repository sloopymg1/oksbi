import type {
  AdminOperation,
  Composition,
  OnboardingProfile,
  PayoutRequest,
  Recording,
  Release,
  RightsSplit,
  RoyaltyStatement,
  ServiceHealth,
  SmartLink,
  SupportCase,
  TakedownRequest,
  User,
} from './entities.js';

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'RATE_LIMITED'
  | 'SERVICE_UNAVAILABLE'
  | 'INTERNAL_ERROR';

export interface ErrorResponse {
  error: {
    code: ErrorCode;
    message: string;
    details?: Record<string, unknown> | null;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ListResponse<T> {
  items: T[];
  total: number;
}

export interface HealthResponse {
  status: ServiceHealth;
}

export interface OnboardingResponse {
  profile: OnboardingProfile;
}

export interface ReleasesResponse extends ListResponse<Release> {}

export interface RecordingsResponse extends ListResponse<Recording> {}

export interface CompositionsResponse extends ListResponse<Composition> {}

export interface RightsSplitsResponse {
  split: RightsSplit;
}

export interface RoyaltyStatementsResponse extends ListResponse<RoyaltyStatement> {}

export interface PayoutResponse {
  payout: PayoutRequest;
}

export interface SmartLinkResponse {
  smartLink: SmartLink;
}

export interface SupportCaseResponse {
  supportCase: SupportCase;
}

export interface TakedownResponse {
  takedown: TakedownRequest;
}

export interface AdminOperationResponse {
  operation: AdminOperation;
}