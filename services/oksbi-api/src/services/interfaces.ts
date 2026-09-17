import type { IncomingMessage } from 'node:http';
import type { BlobServiceClient } from '@azure/storage-blob';
import type { Pool } from 'pg';
import type {
  AdminOperation,
  AdminOperationRequest,
  AuthResponse,
  Composition,
  CompositionUpsertRequest,
  LoginRequest,
  OnboardingProfile,
  OnboardingRequest,
  PayoutRequest,
  PayoutRequestBody,
  Recording,
  RecordingUpsertRequest,
  RegisterRequest,
  Release,
  ReleaseUpsertRequest,
  RightsSplit,
  RightsSplitUpdateRequest,
  RoyaltyStatement,
  RoyaltyStatementQuery,
  SmartLink,
  SmartLinkRequestBody,
  SupportCase,
  SupportCaseRequestBody,
  TakedownRequest,
  TakedownRequestBody,
  User,
} from '../shared.js';
import type { AppConfig } from '../config.js';

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  filter?: Record<string, unknown>;
}

export interface DatabaseService {
  findMany<T>(collection: string, options?: QueryOptions): Promise<T[]>;
  findById<T>(collection: string, id: string): Promise<T | null>;
  findFirst<T>(collection: string, filter: Record<string, unknown>): Promise<T | null>;
  create<T>(collection: string, data: T): Promise<T>;
  update<T>(collection: string, id: string, data: Partial<T>): Promise<T | null>;
  delete(collection: string, id: string): Promise<boolean>;
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  healthCheck(): Promise<boolean>;
  transaction<T>(fn: (transactionalDatabase: DatabaseService) => Promise<T>): Promise<T>;
}

export interface StorageService {
  uploadBuffer(container: string, blobName: string, data: Buffer, contentType?: string): Promise<string>;
  deleteObject(container: string, blobName: string): Promise<void>;
  healthCheck(): Promise<boolean>;
}

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  healthCheck(): Promise<boolean>;
}

export interface RedisClientLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options?: { EX?: number }): Promise<unknown>;
  del(key: string): Promise<unknown>;
  ping(): Promise<unknown>;
}

export interface DatabaseConnectionProvider {
  createPool(): Promise<Pool>;
  describe(): string;
}

export interface BlobClientProvider {
  getClient(): BlobServiceClient;
  describe(): string;
}

export interface RedisConnectionProvider {
  createClient(): Promise<RedisClientLike>;
  describe(): string;
}

export interface AuthService {
  register(input: RegisterRequest): Promise<AuthResponse & { cookieHeader: string }>;
  login(input: LoginRequest): Promise<AuthResponse & { cookieHeader: string }>;
  authenticateRequest(request: IncomingMessage): Promise<User>;
  logout(request: IncomingMessage): Promise<void>;
}

export interface OnboardingService {
  upsert(actor: User, input: OnboardingRequest): Promise<OnboardingProfile>;
}

export interface ReleaseService {
  list(actor: User): Promise<Release[]>;
  upsert(actor: User, input: ReleaseUpsertRequest): Promise<Release>;
}

export interface RecordingService {
  list(actor: User, releaseId?: string): Promise<Recording[]>;
  upsert(actor: User, input: RecordingUpsertRequest): Promise<Recording>;
}

export interface CompositionService {
  list(actor: User): Promise<Composition[]>;
  upsert(actor: User, input: CompositionUpsertRequest): Promise<Composition>;
}

export interface RightsService {
  list(actor: User): Promise<RightsSplit[]>;
  saveSplit(actor: User, input: RightsSplitUpdateRequest): Promise<RightsSplit>;
}

export interface RoyaltyService {
  listStatements(actor: User, query: RoyaltyStatementQuery): Promise<RoyaltyStatement[]>;
}

export interface PayoutService {
  list(actor: User): Promise<PayoutRequest[]>;
  createRequest(actor: User, input: PayoutRequestBody): Promise<PayoutRequest>;
}

export interface SmartLinkService {
  upsert(actor: User, input: SmartLinkRequestBody): Promise<SmartLink>;
}

export interface SupportService {
  list(actor: User): Promise<SupportCase[]>;
  createCase(actor: User, input: SupportCaseRequestBody): Promise<SupportCase>;
}

export interface TakedownService {
  createRequest(actor: User, input: TakedownRequestBody): Promise<TakedownRequest>;
}

export interface AdminService {
  recordOperation(actor: User, input: AdminOperationRequest): Promise<AdminOperation>;
}

export interface ServiceRegistry {
  config: AppConfig;
  database: DatabaseService;
  storage: StorageService;
  cache: CacheService;
  auth: AuthService;
  onboarding: OnboardingService;
  releases: ReleaseService;
  recordings: RecordingService;
  compositions: CompositionService;
  rights: RightsService;
  royalties: RoyaltyService;
  payouts: PayoutService;
  smartLinks: SmartLinkService;
  support: SupportService;
  takedowns: TakedownService;
  admin: AdminService;
}