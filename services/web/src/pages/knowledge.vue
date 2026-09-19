<script setup lang="ts">
import { api } from '~/api'
import type { KnowledgeAnswer, KnowledgeDocument } from '~/api/types'

const documents = ref<KnowledgeDocument[]>([])
const question = ref('')
const urls = ref('')
const answer = ref<KnowledgeAnswer | null>(null)
const error = ref('')
const pending = ref(false)
const saving = ref(false)
const form = reactive({ title: '', source: '', tags: '', content: '' })

async function loadDocuments() { try { documents.value = await api.listKnowledgeDocuments() } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Unable to load knowledge.' } }
async function addDocument() {
  error.value = ''
  if (!form.title || !form.source || form.content.length < 20) { error.value = 'Add a title, source, and at least 20 characters of content.'; return }
  saving.value = true
  try { await api.addKnowledgeDocument({ title: form.title, source: form.source, content: form.content, tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean) }); Object.assign(form, { title: '', source: '', tags: '', content: '' }); await loadDocuments() } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Unable to save document.' } finally { saving.value = false }
}
async function ask(research = false) {
  error.value = ''; answer.value = null
  if (question.value.trim().length < 3) { error.value = 'Ask a question with at least three characters.'; return }
  pending.value = true
  try { answer.value = research ? await api.researchKnowledge(question.value, urls.value.split('\n').map(url => url.trim()).filter(Boolean)) : await api.askKnowledge(question.value) } catch (caught) { error.value = caught instanceof Error ? caught.message : 'The assistant could not answer.' } finally { pending.value = false }
}
onMounted(() => { void loadDocuments() })
</script>

<template>
  <section class="workspace-copy knowledge-page">
    <div class="knowledge-hero">
      <div><span class="eyebrow">RAG + research agent</span><h1 class="page-title">Ask your knowledge base first.</h1><p class="helper-text">Add your artist policies, rights notes, release guides, and contracts. The assistant searches these sources before it looks elsewhere.</p></div>
      <div class="knowledge-hero-mark">◎</div>
    </div>
    <div class="knowledge-grid">
      <section class="surface workspace-copy">
        <div class="topline"><div><span class="eyebrow">Retrieval-first assistant</span><h2 class="section-title">What do you need to know?</h2></div><span v-if="answer" class="pill">{{ answer.confidence }} confidence</span></div>
        <textarea v-model="question" class="textarea-field knowledge-question" placeholder="e.g. What documents do I need before submitting a composition?" rows="4" />
        <div class="knowledge-actions"><button class="primary-button" type="button" :disabled="pending" @click="ask()">{{ pending ? 'Searching...' : 'Ask indexed knowledge' }}</button><button class="secondary-button" type="button" :disabled="pending" @click="ask(true)">Research the web</button></div>
        <label class="form-label">Optional research URLs <textarea v-model="urls" class="textarea-field" rows="2" placeholder="One trusted URL per line" /></label>
        <p v-if="error" class="validation-note">{{ error }}</p>
        <article v-if="answer" class="knowledge-answer"><div class="topline"><strong>{{ answer.researched ? 'Research agent answer' : 'RAG answer' }}</strong><span class="pill">{{ answer.sources.length }} sources</span></div><p>{{ answer.answer }}</p><div v-for="source in answer.sources" :key="source.id + source.source" class="knowledge-source"><strong>{{ source.title }}</strong><span>{{ source.source }} · {{ source.score }}% match</span><p>{{ source.excerpt }}</p></div></article>
      </section>
      <section class="surface workspace-copy">
        <div class="topline"><div><span class="eyebrow">Knowledge base</span><h2 class="section-title">Add a source</h2></div><span class="pill">{{ documents.length }} indexed</span></div>
        <label class="form-label">Title<input v-model="form.title" class="form-field" placeholder="Artist release guide" /></label>
        <label class="form-label">Source<input v-model="form.source" class="form-field" placeholder="Internal policy · 2026" /></label>
        <label class="form-label">Tags<input v-model="form.tags" class="form-field" placeholder="rights, release, onboarding" /></label>
        <label class="form-label">Content<textarea v-model="form.content" class="textarea-field" rows="7" placeholder="Paste the policy, notes, or reference material here..." /></label>
        <button class="primary-button" type="button" :disabled="saving" @click="addDocument">{{ saving ? 'Indexing...' : 'Add to knowledge base' }}</button>
        <div class="knowledge-document-list"><article v-for="document in documents" :key="document.id" class="knowledge-document"><strong>{{ document.title }}</strong><span>{{ document.source }}</span><small>{{ document.tags.join(' · ') || 'General source' }}</small></article><p v-if="!documents.length" class="helper-text">No sources yet. Add your first internal reference above.</p></div>
      </section>
    </div>
  </section>
</template>

<style scoped>
.knowledge-page { gap: 18px; }.knowledge-hero { display: flex; justify-content: space-between; gap: 30px; align-items: center; padding: 30px; border-radius: 28px; background: linear-gradient(135deg, #18232b, #34504a); color: #fffaf2; }.knowledge-hero .page-title { max-width: 600px; margin: 8px 0; color: #fffaf2; }.knowledge-hero .helper-text { max-width: 650px; color: rgba(255,250,242,.72); }.knowledge-hero-mark { display: grid; width: 100px; height: 100px; place-items: center; border: 1px solid rgba(255,250,242,.45); border-radius: 50%; color: #f2b09d; font-size: 4rem; }.knowledge-grid { display: grid; grid-template-columns: 1.2fr .8fr; gap: 18px; }.knowledge-question { font-size: 1rem; line-height: 1.6; }.knowledge-actions { display: flex; flex-wrap: wrap; gap: 10px; }.knowledge-answer { display: flex; flex-direction: column; gap: 14px; margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--line); }.knowledge-answer > p { margin: 0; line-height: 1.7; }.knowledge-source, .knowledge-document { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border-left: 3px solid var(--coral); background: rgba(139,189,167,.12); }.knowledge-source span, .knowledge-source p, .knowledge-document span, .knowledge-document small { color: #6b7775; font-size: .78rem; }.knowledge-source p { margin: 5px 0 0; line-height: 1.5; }.knowledge-document-list { display: flex; flex-direction: column; gap: 8px; margin-top: 20px; }.knowledge-document { border-left-color: var(--mint); }
@media (max-width: 900px) { .knowledge-grid { grid-template-columns: 1fr; } }.knowledge-hero-mark { flex-shrink: 0; } @media (max-width: 560px) { .knowledge-hero { padding: 22px; }.knowledge-hero-mark { display: none; } }
</style>