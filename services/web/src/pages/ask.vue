<script setup lang="ts">
import { api } from '~/api'
import type { KnowledgeAnswer } from '~/api/types'

const question = ref('')
const urls = ref('')
const answer = ref<KnowledgeAnswer | null>(null)
const error = ref('')
const pending = ref(false)

async function ask(research = false) {
  error.value = ''
  answer.value = null
  if (question.value.trim().length < 3) { error.value = 'Ask a question with at least three characters.'; return }
  pending.value = true
  try {
    answer.value = research
      ? await api.researchKnowledge(question.value, urls.value.split('\n').map(url => url.trim()).filter(Boolean))
      : await api.askKnowledge(question.value)
  } catch (caught) { error.value = caught instanceof Error ? caught.message : 'The assistant could not answer.' }
  finally { pending.value = false }
}
</script>

<template>
  <main class="public-ask-page">
    <section class="public-ask-intro">
      <p class="public-ask-kicker">Public music knowledge desk</p>
      <h1>Ask OKSBI.</h1>
      <p>Start with the indexed music knowledge base. When you need a wider view, ask the research agent to check public sources.</p>
    </section>
    <section class="public-ask-panel">
      <textarea v-model="question" rows="5" placeholder="What would you like to know about music rights, publishing, or releases?" />
      <div class="public-ask-actions"><button type="button" :disabled="pending" @click="ask()">{{ pending ? 'Searching...' : 'Search knowledge base' }}</button><button type="button" :disabled="pending" @click="ask(true)">Research public sources</button></div>
      <label>Optional trusted sources<textarea v-model="urls" rows="2" placeholder="One URL per line" /></label>
      <p v-if="error" class="public-ask-error">{{ error }}</p>
      <article v-if="answer" class="public-ask-answer"><div class="public-ask-answer-head"><strong>{{ answer.researched ? 'Research result' : 'Knowledge base result' }}</strong><span>{{ answer.confidence }} confidence</span></div><p>{{ answer.answer }}</p><div v-for="source in answer.sources" :key="source.id + source.source" class="public-ask-source"><strong>{{ source.title }}</strong><span>{{ source.source }} · {{ source.score }}% match</span><p>{{ source.excerpt }}</p></div></article>
    </section>
  </main>
</template>

<style scoped>
.public-ask-page { min-height: calc(100vh - 76px); padding: 110px 10vw; background: #f6f0e8; color: #18232b; font-family: Manrope, sans-serif; }.public-ask-intro { max-width: 760px; margin-bottom: 42px; }.public-ask-kicker { margin: 0 0 18px; color: #d95d39; font-size: .72rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }.public-ask-intro h1 { margin: 0; font-family: Fraunces, Georgia, serif; font-size: clamp(4rem, 8vw, 8rem); font-weight: 600; line-height: .86; }.public-ask-intro p:last-child { max-width: 550px; margin: 28px 0 0; color: #6b7775; line-height: 1.7; }.public-ask-panel { max-width: 900px; padding: 28px; border: 1px solid rgba(24,35,43,.14); border-radius: 24px; background: #fffaf2; box-shadow: 0 24px 80px rgba(24,35,43,.1); }.public-ask-panel > textarea, .public-ask-panel label textarea { display: block; width: 100%; border: 1px solid rgba(24,35,43,.15); border-radius: 14px; background: #f6f0e8; padding: 15px; color: #18232b; font: inherit; line-height: 1.6; resize: vertical; }.public-ask-actions { display: flex; flex-wrap: wrap; gap: 10px; margin: 14px 0 22px; }.public-ask-actions button { border: 0; border-radius: 999px; padding: 13px 18px; background: #d95d39; color: #fffaf2; font: inherit; font-size: .8rem; font-weight: 800; cursor: pointer; }.public-ask-actions button + button { background: #18232b; }.public-ask-actions button:disabled { cursor: wait; opacity: .55; }.public-ask-panel label { display: block; color: #6b7775; font-size: .78rem; font-weight: 700; }.public-ask-panel label textarea { margin-top: 8px; }.public-ask-error { color: #c0443d; font-size: .82rem; font-weight: 700; }.public-ask-answer { display: flex; flex-direction: column; gap: 14px; margin-top: 24px; padding-top: 22px; border-top: 1px solid rgba(24,35,43,.14); }.public-ask-answer-head { display: flex; justify-content: space-between; gap: 16px; }.public-ask-answer-head span, .public-ask-source span, .public-ask-source p { color: #6b7775; font-size: .78rem; }.public-ask-answer > p { margin: 0; line-height: 1.7; }.public-ask-source { padding: 12px 14px; border-left: 3px solid #55b79a; background: rgba(85,183,154,.1); }.public-ask-source p { margin: 6px 0 0; line-height: 1.5; }
@media (max-width: 720px) { .public-ask-page { padding: 82px 8vw; }.public-ask-panel { padding: 20px; } }
</style>