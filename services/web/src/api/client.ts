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

import type { ApiClient, KnowledgeAnswer, KnowledgeDocument, MusicianAdminRecord, MusicianDetail, MusicSearchResult, SocietyRecord } from './types'

type ListResponse<T> = { items: T[]; total: number }
type ApiUser = {
  id: string
  email: string
  displayName: string
  roles: string[]
  organizationId?: string
}
type ApiRelease = { id: string; title: string; artworkBlobPath?: string; releaseDate: string; status: string }
type ApiComposition = { id: string; title: string; publisherName?: string; status: string }
type ApiRightsSplit = { id: string; compositionId: string; versionName: string; status: string; interests: Array<{ partyName: string; role: string }> }
type ApiRoyalty = { id: string; statementMonth: string; currencyCode: string; grossAmount: string; netAmount: string; status: string }
type ApiPayout = { id: string; amount: string; currencyCode: string; destinationLabel: string; status: string; createdAt: string }
type ApiSupport = { id: string; subject: string; category: string; status: string; updatedAt: string }

type ApiError = { error?: { message?: string } }

function toWorkspaceUser(user: ApiUser): WorkspaceUser {
  return {
    id: user.id,
    fullName: user.displayName,
    role: user.roles.includes('admin') ? 'admin' : user.roles[0] ?? 'Creator',
    organization: user.organizationId ?? 'Independent workspace',
    email: user.email,
    avatarUrl: ''
  }
}

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = import.meta.client ? window.localStorage.getItem('oksbi_access_token') : null
  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`/api${path}`, {
    ...options,
    headers,
    credentials: 'include'
  })
  const body = response.status === 204 ? null : await response.json() as unknown
  if (!response.ok) {
    const message = (body as ApiError | null)?.error?.message ?? `Request failed with status ${response.status}.`
    throw new Error(message)
  }

  return body as T
}

function rememberToken(response: { accessToken: string }): void {
  if (import.meta.client) {
    window.localStorage.setItem('oksbi_access_token', response.accessToken)
  }
}

function releaseRecord(release: ApiRelease): ReleaseRecord {
  return {
    id: release.id,
    title: release.title,
    artist: 'Workspace catalog',
    artworkUrl: release.artworkBlobPath ?? '',
    upc: 'Not assigned',
    stage: release.status,
    deliveryWindow: release.releaseDate,
    territories: 0,
    revenueAtRisk: '$0'
  }
}

export const liveClient: ApiClient = {
  async getCurrentUser() {
    try {
      const response = await request<{ user: ApiUser }>('/auth/me')
      return toWorkspaceUser(response.user)
    } catch {
      return null
    }
  },

  async login(input: LoginInput): Promise<AuthResponse> {
    const response = await request<{ user: ApiUser; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input)
    })
    rememberToken(response)
    return { user: toWorkspaceUser(response.user), token: response.accessToken }
  },

  async logout() {
    await request<void>('/auth/logout', { method: 'POST' })
    if (import.meta.client) {
      window.localStorage.removeItem('oksbi_access_token')
    }
  },

  async createAccount(input: CreateAccountInput): Promise<AuthResponse> {
    const response = await request<{ user: ApiUser; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ displayName: input.fullName, email: input.email, password: input.password })
    })
    rememberToken(response)
    return { user: toWorkspaceUser(response.user), token: response.accessToken }
  },

  async getDashboardSnapshot(): Promise<DashboardSnapshot> {
    const [catalog, royalties] = await Promise.all([this.listCatalog(), this.listRoyalties()])
    return {
      metrics: [
        { id: 'releases', label: 'Releases', value: String(catalog.length), trend: 'Live catalog', tone: 'ok' },
        { id: 'royalties', label: 'Net royalties', value: royalties[0]?.net ?? '$0', trend: 'Latest statement', tone: 'ok' }
      ],
      notices: catalog.length === 0 ? [{ id: 'catalog-empty', title: 'Catalog is empty', detail: 'Create a release to begin distribution.', tone: 'muted' }] : [],
      activity: [],
      spotlightReleases: catalog.slice(0, 3),
      royaltyHealth: royalties.length === 0 ? [{ id: 'royalties-empty', title: 'No statements yet', detail: 'Statements will appear after ingestion.', tone: 'muted' }] : []
    }
  },

  async listCatalog() {
    const response = await request<ListResponse<ApiRelease>>('/releases')
    return response.items.map(releaseRecord)
  },

  async listRights() {
    const [splits, compositions] = await Promise.all([
      request<ListResponse<ApiRightsSplit>>('/rights/splits'),
      request<ListResponse<ApiComposition>>('/compositions')
    ])
    const compositionById = new Map(compositions.items.map((composition) => [composition.id, composition]))
    return splits.items.map((split): RightRecord => {
      const composition = compositionById.get(split.compositionId)
      return {
        id: split.id,
        work: composition?.title ?? split.versionName,
        writer: split.interests[0]?.partyName ?? 'Unassigned',
        society: 'See music registrations',
        splitStatus: split.status,
        issue: split.interests.length === 0 ? 'Add ownership interests' : 'No open issue',
        effectiveDate: 'Not set'
      }
    })
  },

  async listRoyalties() {
    const response = await request<ListResponse<ApiRoyalty>>('/royalties/statements')
    return response.items.map((statement): RoyaltyRecord => ({
      id: statement.id,
      statementMonth: statement.statementMonth,
      source: 'Royalty statement',
      gross: `${statement.currencyCode} ${statement.grossAmount}`,
      reserves: 'Not reported',
      net: `${statement.currencyCode} ${statement.netAmount}`,
      status: statement.status
    }))
  },

  async listPayouts() {
    const response = await request<ListResponse<ApiPayout>>('/payouts')
    return response.items.map((payout): PayoutRecord => ({
      id: payout.id,
      creator: 'Current workspace',
      amount: `${payout.currencyCode} ${payout.amount}`,
      method: payout.destinationLabel,
      taxStatus: 'Not reported',
      scheduledFor: payout.createdAt,
      status: payout.status
    }))
  },

  async listSupportCases() {
    const response = await request<ListResponse<ApiSupport>>('/support/cases')
    return response.items.map((supportCase): SupportRecord => ({
      id: supportCase.id,
      subject: supportCase.subject,
      queue: supportCase.category,
      priority: 'Normal',
      owner: 'Support team',
      updatedAt: supportCase.updatedAt,
      status: supportCase.status
    }))
  },

  async listKnowledgeDocuments(): Promise<KnowledgeDocument[]> {
    const response = await request<{ items: KnowledgeDocument[] }>('/knowledge/documents')
    return response.items
  },

  async addKnowledgeDocument(input) {
    const response = await request<{ document: KnowledgeDocument }>('/knowledge/documents', { method: 'POST', body: JSON.stringify(input) })
    return response.document
  },

  async askKnowledge(question: string): Promise<KnowledgeAnswer> {
    return request<KnowledgeAnswer>('/assistant/answer', { method: 'POST', body: JSON.stringify({ question }) })
  },

  async researchKnowledge(question: string, urls: string[]): Promise<KnowledgeAnswer> {
    return request<KnowledgeAnswer>('/assistant/research', { method: 'POST', body: JSON.stringify({ question, urls }) })
  },

  async listMusicians(): Promise<MusicianAdminRecord[]> {
    const response = await request<{ items: MusicianAdminRecord[] }>('/admin/musicians')
    return response.items
  },

  async updateMusicianStatus(musicianId: string, status: MusicianAdminRecord['onboardingStatus']): Promise<void> {
    await request(`/admin/musicians/${musicianId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
  },

  async getMusician(musicianId: string): Promise<MusicianDetail> {
    return request<MusicianDetail>(`/admin/musicians/${musicianId}`)
  },

  async searchMusic(input): Promise<MusicSearchResult> {
    return request<MusicSearchResult>('/admin/music/search', { method: 'POST', body: JSON.stringify({ ...input, contributors: [] }) })
  },

  async listSocieties(): Promise<SocietyRecord[]> {
    const response = await request<{ items: SocietyRecord[] }>('/music/organizations')
    return response.items
  },

  async createSociety(input: Omit<SocietyRecord, 'id'>): Promise<SocietyRecord> {
    const response = await request<{ society: SocietyRecord }>('/music/organizations', { method: 'POST', body: JSON.stringify(input) })
    return response.society
  }
}
