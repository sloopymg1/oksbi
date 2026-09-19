<script setup lang="ts">
import { api } from '~/api'
import type { MusicianAdminRecord } from '~/api/types'

const musicians = ref<MusicianAdminRecord[]>([])
const loading = ref(true)
const error = ref('')
const savingId = ref<string | null>(null)
const labels: Record<MusicianAdminRecord['onboardingStatus'], string> = { approved: 'Approved', in_process: 'In process', suspended: 'Suspended', contact_admin: 'Contact admin' }

async function loadMusicians() {
  loading.value = true; error.value = ''
  try { musicians.value = await api.listMusicians() } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Unable to load musicians.' } finally { loading.value = false }
}

async function updateStatus(musician: MusicianAdminRecord, event: Event) {
  const status = (event.target as HTMLSelectElement).value as MusicianAdminRecord['onboardingStatus']
  savingId.value = musician.id
  try { await api.updateMusicianStatus(musician.id, status); musician.onboardingStatus = status } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Unable to update status.' } finally { savingId.value = null }
}

onMounted(() => { void loadMusicians() })
</script>

<template>
  <section class="workspace-copy musicians-page">
    <div class="musicians-hero"><div><span class="eyebrow">Administrator directory</span><h1 class="page-title">List Musicians</h1><p class="helper-text">Review registered musicians and keep each application state current.</p></div><div class="musicians-count"><strong>{{ musicians.length }}</strong><span>registered</span></div></div>
    <section class="table-shell">
      <div class="table-toolbar"><div><h2 class="section-title">Registered musicians</h2><p class="helper-text">Application status changes are saved immediately.</p></div><button class="secondary-button" type="button" :disabled="loading" @click="loadMusicians">Refresh list</button></div>
      <p v-if="error" class="validation-note musicians-message">{{ error }}</p>
      <div v-if="loading" class="musicians-empty">Loading registered musicians...</div>
      <div v-else-if="!musicians.length" class="musicians-empty">No musician accounts are registered yet.</div>
      <div v-else class="musicians-table-wrap"><table class="data-table"><thead><tr><th>Musician</th><th>Email</th><th>Artist profile</th><th>Application state</th></tr></thead><tbody><tr v-for="musician in musicians" :key="musician.id"><td><NuxtLink :to="`/musicians/${musician.id}`" class="musician-link"><strong>{{ musician.displayName }}</strong><span class="musician-id">View songs and activity · {{ musician.id.slice(0, 8) }}</span></NuxtLink></td><td>{{ musician.email }}</td><td>{{ musician.artistName || 'Profile not completed' }}<span v-if="musician.countryCode" class="musician-id">{{ musician.countryCode }}</span></td><td><select class="status-select" :value="musician.onboardingStatus" :disabled="savingId === musician.id" :aria-label="`Application state for ${musician.displayName}`" @change="updateStatus(musician, $event)"><option v-for="(label, value) in labels" :key="value" :value="value">{{ label }}</option></select></td></tr></tbody></table></div>
    </section>
  </section>
</template>

<style scoped>
.musicians-page { gap: 18px; }.musicians-hero { display: flex; align-items: center; justify-content: space-between; gap: 24px; padding: 30px; border-radius: 28px; background: linear-gradient(135deg, #18232b, #34504a); color: #fffaf2; }.musicians-hero .page-title { margin: 8px 0; color: #fffaf2; }.musicians-hero .helper-text { color: rgba(255,250,242,.72); }.musicians-count { display: flex; flex-direction: column; align-items: end; }.musicians-count strong { color: #f2b09d; font-family: Fraunces, Georgia, serif; font-size: 4rem; font-weight: 600; line-height: .9; }.musicians-count span { color: rgba(255,250,242,.7); font-size: .75rem; }.musicians-message, .musicians-empty { margin: 20px 22px; }.musicians-empty { padding: 50px 20px; color: #6b7775; text-align: center; }.musicians-table-wrap { overflow-x: auto; }.data-table { min-width: 760px; }.data-table td strong, .data-table td span { display: block; }.musician-id { margin-top: 5px; color: #6b7775; font-size: .72rem; }.status-select { min-width: 150px; border: 1px solid rgba(24,35,43,.15); border-radius: 999px; background: #fffaf2; padding: 9px 12px; color: #18232b; font: inherit; font-size: .78rem; font-weight: 700; }.status-select:disabled { opacity: .6; }
.musician-link { display: block; color: inherit; text-decoration: none; }.musician-link strong { color: var(--coral); }.musician-link:hover strong { text-decoration: underline; text-underline-offset: 3px; }
@media (max-width: 680px) { .musicians-hero { align-items: start; flex-direction: column; }.musicians-count { align-items: start; } }
</style>