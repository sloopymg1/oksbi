<script setup lang="ts">
import { request } from '~/api/client'
type Destination = { name: string; kind: 'PRO' | 'CMO'; territory: string }
type Registration = Destination & { status: string; reference: string; notes: string }
type Submission = { id: string; artistName: string; metadata: { title: string; language: string; isrc: string; iswc: string; publisherName: string; contributors: Array<{ name: string; role: string; share: number; ipi: string; society: string }> }; status: string; audioBlobPath?: string; registrations: Registration[] }
const auth = useAuth()
const items = ref<Submission[]>([])
const error = ref('')
const message = ref('')
const pending = ref(false)
const loading = ref(true)
const draftId = ref('')
const file = ref<File | null>(null)
const form = reactive({ title: '', language: '', isrc: '', iswc: '', publisherName: '', authorized: false,
  contributors: [{ name: '', role: 'composer_lyricist', share: 100, ipi: '', society: '' }],
  destinations: [{ name: '', kind: 'PRO', territory: '' }] as Destination[] })
const total = computed(() => form.contributors.reduce((sum, writer) => sum + Number(writer.share), 0))
async function reload() {
  try { items.value = (await request<{ items: Submission[] }>('/music')).items }
  catch (e) { error.value = e instanceof Error ? e.message : 'Unable to load music.' }
  finally { loading.value = false }
}
onMounted(reload)
function selectFile(event: Event) { file.value = (event.target as HTMLInputElement).files?.[0] ?? null }
async function submit() {
  error.value = ''; message.value = ''
  if (!file.value || file.value.size > 50 * 1024 * 1024) { error.value = 'Choose a WAV, MP3 or FLAC file up to 50 MB.'; return }
  if (Math.abs(total.value - 100) > 0.001) { error.value = 'Writer shares must total 100%.'; return }
  pending.value = true
  try {
    if (!draftId.value) draftId.value = (await request<{ item: Submission }>('/music', { method: 'POST', body: JSON.stringify(form) })).item.id
    await request(`/music/${draftId.value}/audio`, { method: 'PUT', headers: { 'Content-Type': file.value.type || 'application/octet-stream' }, body: file.value })
    await request(`/music/${draftId.value}/submit`, { method: 'POST' })
    draftId.value = ''; form.title = ''; form.authorized = false
    message.value = 'Music submitted to OKSBI for review. Track each requested society below.'
    await reload()
  } catch (e) { error.value = e instanceof Error ? e.message : 'Submission failed. Retry to continue your saved draft.' }
  finally { pending.value = false }
}
async function resume(item: Submission, event: Event) {
  const audio = (event.target as HTMLInputElement).files?.[0]
  if (!audio) return
  pending.value = true; error.value = ''
  try {
    if (audio.size > 50 * 1024 * 1024) throw new Error('Audio must be 50 MB or smaller.')
    await request(`/music/${item.id}/audio`, { method: 'PUT', headers: { 'Content-Type': audio.type || 'application/octet-stream' }, body: audio })
    await request(`/music/${item.id}/submit`, { method: 'POST' }); await reload()
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to submit draft.' }
  finally { pending.value = false }
}
function exportMetadata(item: Submission) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a'); link.href = url; link.download = `oksbi-${item.id}.json`; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
async function review(item: Submission, row: Registration) {
  pending.value = true; error.value = ''
  try {
    await request(`/music/${item.id}/registration`, { method: 'PATCH', body: JSON.stringify({ destination: row.name, status: row.status, reference: row.reference, notes: row.notes }) })
    message.value = 'Society update saved.'; await reload()
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to save review.'; await reload() }
  finally { pending.value = false }
}
</script>
<template>
  <section class="workspace-copy">
    <article class="surface workspace-copy">
      <span class="eyebrow">Your music · Your rights</span>
      <h1 class="section-title">Upload music for PRO / CMO registration</h1>
      <p class="helper-text">Complete your profile, upload a recording, and tell OKSBI where you want the work registered. OKSBI reviews your information before society delivery. A request does not mean a society has accepted your work.</p>
      <NuxtLink to="/membership" class="secondary-button">Complete or edit musician profile</NuxtLink>
      <p class="helper-text">PROs and CMOs manage music rights. These requests are separate from releasing music on streaming platforms. Destinations you enter are requests, subject to OKSBI review and society requirements.</p>
      <form class="form-stack" @submit.prevent="submit">
        <fieldset :disabled="pending || !!draftId" class="form-stack" style="border: 0; padding: 0">
          <legend>Track and composition details</legend>
          <label class="form-label">Track title<input v-model="form.title" required maxlength="180" class="form-field" /></label>
          <label class="form-label">Language<input v-model="form.language" required minlength="2" maxlength="80" class="form-field" /></label>
          <label class="form-label">ISRC (optional)<input v-model="form.isrc" maxlength="32" class="form-field" /></label>
          <label class="form-label">ISWC (optional)<input v-model="form.iswc" maxlength="32" class="form-field" /></label>
          <label class="form-label">Publisher (optional)<input v-model="form.publisherName" maxlength="180" class="form-field" /></label>
          <h2 class="section-title">Writers and ownership</h2>
          <div v-for="(writer, index) in form.contributors" :key="index" class="note-card form-stack">
            <label class="form-label">Writer legal name<input v-model="writer.name" required minlength="2" class="form-field" /></label>
            <label class="form-label">Role<select v-model="writer.role" class="form-field"><option value="composer_lyricist">Composer and lyricist</option><option value="composer">Composer</option><option value="lyricist">Lyricist</option></select></label>
            <label class="form-label">Ownership %<input v-model.number="writer.share" type="number" min="0.01" max="100" step="0.01" required class="form-field" /></label>
            <label class="form-label">IPI / CAE number (optional)<input v-model="writer.ipi" maxlength="32" class="form-field" /></label>
            <label class="form-label">Existing society affiliation (optional)<input v-model="writer.society" class="form-field" /></label>
            <button v-if="form.contributors.length > 1" type="button" class="ghost-button" @click="form.contributors.splice(index, 1)">Remove writer</button>
          </div>
          <p class="helper-text">Total: {{ total }}% · must equal 100%</p>
          <button type="button" class="secondary-button" @click="form.contributors.push({ name: '', role: 'composer', share: 0, ipi: '', society: '' })">Add writer</button>
          <h2 class="section-title">Requested societies</h2>
          <div v-for="(destination, index) in form.destinations" :key="index" class="note-card form-stack">
            <label class="form-label">Society name<input v-model="destination.name" required minlength="2" class="form-field" /></label>
            <label class="form-label">Organization type<select v-model="destination.kind" class="form-field"><option>PRO</option><option>CMO</option></select></label>
            <label class="form-label">Requested territory<input v-model="destination.territory" required minlength="2" placeholder="Country or territory" class="form-field" /></label>
            <button v-if="form.destinations.length > 1" type="button" class="ghost-button" @click="form.destinations.splice(index, 1)">Remove society</button>
          </div>
          <button type="button" class="secondary-button" @click="form.destinations.push({ name: '', kind: 'CMO', territory: '' })">Add society</button>
          <label><input v-model="form.authorized" type="checkbox" required /> I am authorized to submit this music and the listed ownership details to OKSBI for society registration review.</label>
        </fieldset>
        <label class="form-label">Audio master · WAV, MP3 or FLAC · up to 50 MB<input type="file" accept=".wav,.mp3,.flac" required :disabled="pending" @change="selectFile" /></label>
        <p v-if="draftId" class="helper-text">Your details are saved. Retry with an audio file to finish this submission.</p>
        <button class="primary-button" :disabled="pending">{{ pending ? 'Saving and uploading…' : draftId ? 'Retry upload and submit' : 'Upload and submit to OKSBI' }}</button>
      </form>
    </article>
    <p v-if="error" role="alert" class="validation-note">{{ error }}</p>
    <p v-if="message" role="status" class="helper-text">{{ message }}</p>
    <article class="surface workspace-copy">
      <h2 class="section-title">Music and registration progress</h2>
      <p v-if="loading">Loading your music…</p>
      <p v-else-if="!items.length">No music submitted yet. Start with your first track above.</p>
      <button type="button" class="secondary-button" :disabled="pending" @click="reload">Refresh status</button>
      <article v-for="item in items" :key="item.id" class="note-card workspace-copy">
        <strong>{{ item.metadata.title }} · {{ item.artistName }}</strong>
        <details>
          <summary>View submitted rights details</summary>
          <p>Language: {{ item.metadata.language }} · ISRC: {{ item.metadata.isrc || 'Not provided' }} · ISWC: {{ item.metadata.iswc || 'Not provided' }}</p>
          <p>Publisher: {{ item.metadata.publisherName || 'Not provided' }}</p>
          <p v-for="(writer, index) in item.metadata.contributors" :key="index">{{ writer.name }} · {{ writer.role.replaceAll('_', ' ') }} · {{ writer.share }}% · IPI: {{ writer.ipi || 'Not provided' }} · Affiliation: {{ writer.society || 'Not provided' }}</p>
          <button type="button" class="secondary-button" @click="exportMetadata(item)">Download submission metadata</button>
        </details>
        <span class="pill">{{ item.status === 'draft' ? 'Draft · upload needed' : 'Submitted to OKSBI' }}</span>
        <label v-if="item.status === 'draft'" class="form-label">Upload audio and finish this saved draft<input type="file" accept=".wav,.mp3,.flac" :disabled="pending" @change="resume(item, $event)" /></label>
        <div v-for="row in item.registrations" :key="row.name" class="workspace-copy">
          <strong>{{ row.name }} · {{ row.kind }} · {{ row.territory }}</strong>
          <span>{{ row.status.replaceAll('_', ' ') }}</span>
          <p v-if="row.reference">Society reference: {{ row.reference }}</p>
          <p v-if="row.notes">{{ row.notes }}</p>
          <form v-if="auth.user.value?.role === 'admin'" class="form-stack" @submit.prevent="review(item, row)">
            <label class="form-label">Society status<select v-model="row.status" class="form-field"><option disabled value="pending_review">Pending review</option><option value="needs_changes">Needs changes</option><option value="sent">Sent to society</option><option value="registered">Registered (confirmed)</option></select></label>
            <label class="form-label">Delivery / confirmation reference<input v-model="row.reference" class="form-field" /></label>
            <label class="form-label">Review notes<input v-model="row.notes" class="form-field" /></label>
            <button class="secondary-button" :disabled="pending">Save society update</button>
          </form>
        </div>
        <NuxtLink v-if="item.registrations.some(row => row.status === 'needs_changes')" to="/support" class="secondary-button">Contact OKSBI about corrections</NuxtLink>
      </article>
    </article>
  </section>
</template>
