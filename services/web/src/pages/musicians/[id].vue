<script setup lang="ts">
import { api } from '~/api'
import type { MusicianDetail } from '~/api/types'

const route = useRoute()
const detail = ref<MusicianDetail | null>(null)
const loading = ref(true)
const error = ref('')
const statusLabels: Record<string, string> = { approved: 'Approved', in_process: 'In process', suspended: 'Suspended', contact_admin: 'Contact admin', draft: 'Draft', submitted: 'Submitted', pending_review: 'Pending review', needs_changes: 'Needs changes', sent: 'Sent to society', registered: 'Registered' }
const dateLabel = (value: string) => new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))

async function loadDetail() {
  loading.value = true
  error.value = ''
  try { detail.value = await api.getMusician(String(route.params.id)) } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Unable to load musician.' } finally { loading.value = false }
}

onMounted(() => { void loadDetail() })
</script>

<template>
  <section class="workspace-copy musician-detail-page">
    <NuxtLink class="secondary-button detail-back" to="/musicians">← Back to musicians</NuxtLink>
    <div v-if="loading" class="surface detail-empty">Loading musician activity...</div>
    <div v-else-if="error" class="surface detail-empty validation-note">{{ error }}</div>
    <template v-else-if="detail">
      <header class="detail-hero">
        <div><span class="eyebrow">Musician activity</span><h1 class="page-title">{{ detail.musician.artistName || detail.musician.displayName }}</h1><p>{{ detail.musician.email }} · Joined {{ dateLabel(detail.musician.createdAt) }}</p></div>
        <div class="detail-status"><span>Application</span><strong>{{ statusLabels[detail.musician.onboardingStatus] || detail.musician.onboardingStatus }}</strong><small>{{ detail.musician.countryCode || 'Country not set' }}</small></div>
      </header>
      <div class="detail-summary"><article class="surface"><span class="eyebrow">Uploaded songs</span><strong>{{ detail.songs.length }}</strong><small>total submissions</small></article><article class="surface"><span class="eyebrow">Submitted</span><strong>{{ detail.songs.filter(song => song.status === 'submitted').length }}</strong><small>sent for review</small></article><article class="surface"><span class="eyebrow">Registrations</span><strong>{{ detail.songs.reduce((total, song) => total + song.registrations.length, 0) }}</strong><small>society activities</small></article></div>
      <section class="surface song-section"><div class="topline"><div><span class="eyebrow">Music activity</span><h2 class="section-title">Uploaded songs</h2></div><NuxtLink class="secondary-button" to="/musicians">Directory</NuxtLink></div><div v-if="!detail.songs.length" class="detail-empty">This musician has not uploaded any songs yet.</div><div v-else class="song-list"><article v-for="song in detail.songs" :key="song.id" class="song-card"><div class="song-card-head"><div><h3>{{ song.metadata.title }}</h3><p>{{ song.metadata.language }} · {{ song.metadata.publisherName || 'No publisher listed' }}</p></div><span class="pill">{{ statusLabels[song.status] || song.status }}</span></div><div class="song-facts"><span>Created {{ dateLabel(song.createdAt) }}</span><span>Updated {{ dateLabel(song.updatedAt) }}</span><span>{{ song.audioBlobPath ? 'Audio master uploaded' : 'Audio master pending' }}</span></div><details><summary>View song details and activity</summary><div class="song-details"><p><strong>Identifiers:</strong> ISRC {{ song.metadata.isrc || 'not provided' }} · ISWC {{ song.metadata.iswc || 'not provided' }}</p><p><strong>Contributors:</strong> {{ song.metadata.contributors.map(writer => `${writer.name} (${writer.share}%)`).join(', ') || 'None listed' }}</p><h4>Society activity</h4><div v-if="!song.registrations.length" class="helper-text">No society activity recorded.</div><div v-for="registration in song.registrations" :key="registration.name" class="registration-row"><div><strong>{{ registration.name }}</strong><span>{{ registration.kind }} · {{ registration.territory }}</span></div><span class="pill">{{ statusLabels[registration.status] || registration.status }}</span><small v-if="registration.reference">Reference: {{ registration.reference }}</small><small v-if="registration.notes">Notes: {{ registration.notes }}</small></div></div></details></article></div></section>
    </template>
  </section>
</template>

<style scoped>
.musician-detail-page { gap: 18px; }.detail-back { align-self: start; }.detail-hero { display: flex; align-items: end; justify-content: space-between; gap: 28px; padding: 30px; border-radius: 28px; background: linear-gradient(135deg, #18232b, #34504a); color: #fffaf2; }.detail-hero .page-title { margin: 8px 0; color: #fffaf2; }.detail-hero p { margin: 0; color: rgba(255,250,242,.72); }.detail-status { display: flex; min-width: 160px; flex-direction: column; gap: 6px; align-items: end; }.detail-status span, .detail-status small { color: rgba(255,250,242,.62); font-size: .72rem; }.detail-status strong { color: #f2b09d; font-family: Fraunces, Georgia, serif; font-size: 1.8rem; font-weight: 600; }.detail-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }.detail-summary article { display: flex; flex-direction: column; gap: 8px; }.detail-summary strong { font-family: Fraunces, Georgia, serif; font-size: 2.7rem; font-weight: 600; }.detail-summary small { color: #6b7775; }.song-section { display: flex; flex-direction: column; gap: 18px; }.song-list { display: flex; flex-direction: column; gap: 14px; }.song-card { padding: 20px; border: 1px solid rgba(24,35,43,.12); border-radius: 18px; background: rgba(246,240,232,.55); }.song-card-head, .song-facts, .registration-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }.song-card h3 { margin: 0; font-family: Fraunces, Georgia, serif; font-size: 1.7rem; font-weight: 600; }.song-card p, .song-facts, .registration-row span, .registration-row small { color: #6b7775; font-size: .78rem; }.song-card-head p { margin: 6px 0 0; }.song-facts { justify-content: start; flex-wrap: wrap; margin: 18px 0; padding: 12px 0; border-top: 1px solid rgba(24,35,43,.1); border-bottom: 1px solid rgba(24,35,43,.1); }.song-card summary { color: var(--coral); cursor: pointer; font-size: .8rem; font-weight: 800; }.song-details { display: flex; flex-direction: column; gap: 10px; padding-top: 16px; }.song-details p { margin: 0; line-height: 1.6; }.song-details h4 { margin: 10px 0 0; }.registration-row { flex-wrap: wrap; justify-content: start; padding: 11px 0; border-top: 1px solid rgba(24,35,43,.1); }.registration-row div { display: flex; min-width: 180px; flex-direction: column; gap: 4px; }.registration-row small { flex-basis: 100%; }.detail-empty { padding: 60px 20px; color: #6b7775; text-align: center; }
@media (max-width: 700px) { .detail-hero { align-items: start; flex-direction: column; }.detail-status { align-items: start; }.detail-summary { grid-template-columns: 1fr; }.song-card-head { align-items: start; flex-direction: column; } }
</style>
