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

export interface KnowledgeDocument { id: string; title: string; source: string; content: string; tags: string[]; createdAt: string }
export interface KnowledgeSource { id: string; title: string; source: string; excerpt: string; score: number }
export interface KnowledgeAnswer { answer: string; confidence: string; sources: KnowledgeSource[]; researched: boolean }
export interface MusicianAdminRecord { id: string; email: string; displayName: string; createdAt: string; onboardingStatus: 'approved' | 'in_process' | 'suspended' | 'contact_admin'; artistName?: string; countryCode?: string }
export interface MusicianSongRecord { id: string; artistName: string; status: 'draft' | 'submitted'; audioBlobPath?: string; createdAt: string; updatedAt: string; metadata: { title: string; language: string; isrc: string; iswc: string; publisherName: string; contributors: Array<{ name: string; role: string; share: number; ipi: string; society: string }>; destinations: Array<{ name: string; kind: 'PRO' | 'CMO' | 'publisher'; territory: string }> }; registrations: Array<{ name: string; kind: string; territory: string; status: string; reference: string; notes: string }> }
export interface MusicianDetail { musician: MusicianAdminRecord; songs: MusicianSongRecord[] }
export interface MusicSearchMatch { id: string; title: string; author: string; source: 'pending_intake' | 'approved_catalog' | 'public_web'; titleMatch: 'exact' | 'similar'; authorConfidence: 'high' | 'medium' | 'low' | 'unknown'; status?: string; sourceUrl?: string; excerpt?: string }
export interface MusicSearchResult { query: { title: string; artistName: string }; matches: MusicSearchMatch[]; duplicateWarnings: string[]; externalSearched: boolean }
export interface SocietyRecord { id: string; name: string; kind: 'PRO' | 'CMO' | 'publisher'; region: string; website: string; description: string }

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
  listKnowledgeDocuments(): Promise<KnowledgeDocument[]>
  addKnowledgeDocument(input: { title: string; source: string; content: string; tags: string[] }): Promise<KnowledgeDocument>
  askKnowledge(question: string): Promise<KnowledgeAnswer>
  researchKnowledge(question: string, urls: string[]): Promise<KnowledgeAnswer>
  listMusicians(): Promise<MusicianAdminRecord[]>
  updateMusicianStatus(musicianId: string, status: MusicianAdminRecord['onboardingStatus']): Promise<void>
  getMusician(musicianId: string): Promise<MusicianDetail>
  searchMusic(input: { title: string; artistName: string; urls: string[] }): Promise<MusicSearchResult>
  listSocieties(): Promise<SocietyRecord[]>
  createSociety(input: Omit<SocietyRecord, 'id'>): Promise<SocietyRecord>
}