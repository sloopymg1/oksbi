import type {
  AuthResponse,
  CreateAccountInput,
  DashboardSnapshot,
  LoginInput,
  PayoutRecord,
  ReleaseRecord,
  RightRecord,
  RoyaltyRecord,
  SupportRecord,
  WorkspaceUser
} from '~/types'

export interface ApiClient {
  getCurrentUser(): Promise<WorkspaceUser | null>
  login(input: LoginInput): Promise<AuthResponse>
  logout(): Promise<void>
  createAccount(input: CreateAccountInput): Promise<AuthResponse>
  getDashboardSnapshot(): Promise<DashboardSnapshot>
  listCatalog(): Promise<ReleaseRecord[]>
  listRights(): Promise<RightRecord[]>
  listRoyalties(): Promise<RoyaltyRecord[]>
  listPayouts(): Promise<PayoutRecord[]>
  listSupportCases(): Promise<SupportRecord[]>
}