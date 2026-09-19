<script setup lang="ts">
import { api } from '~/api'
import type { SocietyRecord } from '~/api/types'

const auth = useAuth()
const societies = ref<SocietyRecord[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const showForm = ref(false)
const form = reactive<Omit<SocietyRecord, 'id'>>({ name: '', kind: 'PRO', region: '', website: '', description: '' })

async function loadSocieties() {
  loading.value = true
  error.value = ''
  try { societies.value = await api.listSocieties() } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Unable to load societies.' } finally { loading.value = false }
}

async function createSociety() {
  error.value = ''
  if (!form.name || !form.region || !form.website || form.description.length < 10) { error.value = 'Complete every field. Description must be at least 10 characters.'; return }
  saving.value = true
  try { const society = await api.createSociety({ ...form }); societies.value.unshift(society); Object.assign(form, { name: '', kind: 'PRO', region: '', website: '', description: '' }); showForm.value = false } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Unable to add society.' } finally { saving.value = false }
}

onMounted(() => { void loadSocieties() })
</script>

<template>
  <section class="workspace-copy societies-page">
    <div class="societies-hero"><div><span class="eyebrow">Directory</span><h1 class="page-title">Publish &amp; Copyright Societies</h1><p class="helper-text">Browse publishers, performing rights organizations, and collective management organizations used in music registration workflows.</p></div><button v-if="auth.user.value?.role === 'admin'" class="primary-button" type="button" @click="showForm = !showForm">{{ showForm ? 'Close form' : 'Create new added society' }}</button></div>
    <section v-if="showForm && auth.user.value?.role === 'admin'" class="surface society-form workspace-copy"><div class="topline"><div><span class="eyebrow">Administrator action</span><h2 class="section-title">Add a society</h2></div></div><div class="society-form-grid"><label class="form-label">Name<input v-model="form.name" class="form-field" placeholder="Society name" /></label><label class="form-label">Type<select v-model="form.kind" class="form-field"><option value="PRO">PRO</option><option value="CMO">CMO</option><option value="publisher">Publisher</option></select></label><label class="form-label">Region<input v-model="form.region" class="form-field" placeholder="Ghana or International" /></label><label class="form-label">Website<input v-model="form.website" class="form-field" type="url" placeholder="https://example.org" /></label></div><label class="form-label">Description<textarea v-model="form.description" class="textarea-field" rows="3" placeholder="What does this society administer?" /></label><p v-if="error" class="validation-note">{{ error }}</p><button class="primary-button" type="button" :disabled="saving" @click="createSociety">{{ saving ? 'Adding society...' : 'Add society' }}</button></section>
    <p v-if="error && !showForm" class="validation-note">{{ error }}</p>
    <div v-if="loading" class="surface society-empty">Loading societies...</div>
    <div v-else-if="!societies.length" class="surface society-empty">No societies have been added yet.</div>
    <section v-else class="society-grid"><article v-for="society in societies" :key="society.id" class="surface society-card"><div class="society-card-top"><span class="pill">{{ society.kind }}</span><span class="society-region">{{ society.region }}</span></div><h2>{{ society.name }}</h2><p>{{ society.description }}</p><a :href="society.website" target="_blank" rel="noreferrer">Visit website <span aria-hidden="true">↗</span></a></article></section>
  </section>
</template>

<style scoped>
.societies-page { gap: 18px; }.societies-hero { display: flex; align-items: end; justify-content: space-between; gap: 28px; padding: 30px; border-radius: 28px; background: linear-gradient(135deg, #18232b, #34504a); color: #fffaf2; }.societies-hero .page-title { max-width: 700px; margin: 8px 0; color: #fffaf2; }.societies-hero .helper-text { max-width: 670px; color: rgba(255,250,242,.72); }.society-form { display: flex; gap: 16px; }.society-form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }.society-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }.society-card { display: flex; flex-direction: column; gap: 14px; min-height: 230px; }.society-card-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }.society-region, .society-card p { color: #6b7775; font-size: .78rem; }.society-card h2 { margin: 0; font-family: Fraunces, Georgia, serif; font-size: 1.7rem; font-weight: 600; }.society-card p { flex: 1; line-height: 1.6; }.society-card a { color: var(--coral); font-size: .78rem; font-weight: 800; }.society-empty { padding: 60px 20px; color: #6b7775; text-align: center; }
@media (max-width: 900px) { .society-grid { grid-template-columns: repeat(2, 1fr); } }.society-form-grid { min-width: 0; } @media (max-width: 680px) { .societies-hero { align-items: start; flex-direction: column; }.society-grid, .society-form-grid { grid-template-columns: 1fr; } }
</style>
