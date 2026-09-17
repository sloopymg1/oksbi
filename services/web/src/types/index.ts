export type HealthTone = 'ok' | 'warning' | 'muted'

export interface WorkspaceUser {
  id: string
  fullName: string
  role: string
  organization: string
  email: string
  avatarUrl: string
}

export interface ReleaseRecord {
  id: string
  title: string
  artist: string
  artworkUrl: string
  upc: string
  stage: string
  deliveryWindow: string
  territories: number
  revenueAtRisk: string
}

export interface RightRecord {
  id: string
  work: string
  writer: string
  society: string
  splitStatus: string
  issue: string
  effectiveDate: string
}

export interface RoyaltyRecord {
  id: string
  statementMonth: string
  source: string
  gross: string
  reserves: string
  net: string
  status: string
}

export interface PayoutRecord {
  id: string
  creator: string
  amount: string
  method: string
  taxStatus: string
  scheduledFor: string
  status: string
}

export interface SupportRecord {
  id: string
  subject: string
  queue: string
  priority: string
  owner: string
  updatedAt: string
  status: string
}

export interface MetricCard {
  id: string
  label: string
  value: string
  trend: string
  tone: HealthTone
}

export interface NoticeItem {
  id: string
  title: string
  detail: string
  tone: HealthTone
}

export interface ActivityItem {
  id: string
  title: string
  detail: string
  timestamp: string
}

export interface DashboardSnapshot {
  metrics: MetricCard[]
  notices: NoticeItem[]
  activity: ActivityItem[]
  spotlightReleases: ReleaseRecord[]
  royaltyHealth: NoticeItem[]
}

export interface AuthResponse {
  user: WorkspaceUser
  token: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface CreateAccountInput {
  fullName: string
  organization: string
  email: string
  password: string
}