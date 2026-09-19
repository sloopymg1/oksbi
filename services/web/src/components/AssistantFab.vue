<script setup lang="ts">
import { api } from '~/api'
import type { KnowledgeAnswer } from '~/api/types'

const isOpen = ref(false)
const question = ref('')
const answer = ref<KnowledgeAnswer | null>(null)
const error = ref('')
const pending = ref(false)

async function ask(research = false) {
  error.value = ''
  answer.value = null
  if (question.value.trim().length < 3) {
    error.value = 'Ask a question with at least three characters.'
    return
  }

  pending.value = true
  try {
    answer.value = research
      ? await api.researchKnowledge(question.value, [])
      : await api.askKnowledge(question.value)
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'The assistant could not answer.'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="assistant-widget">
    <Transition name="assistant-panel">
      <section v-if="isOpen" class="assistant-panel" aria-label="OKSBI assistant">
        <div class="assistant-panel__header">
          <div>
            <span class="assistant-panel__eyebrow">OKSBI assistant</span>
            <strong>How can I help?</strong>
          </div>
          <button class="assistant-panel__close" type="button" aria-label="Close assistant" @click="isOpen = false">×</button>
        </div>
        <p class="assistant-panel__hint">I search the public music knowledge base first, then can research public sources.</p>
        <textarea v-model="question" rows="3" placeholder="Ask about rights, publishing, or releases..." @keydown.meta.enter="ask()" @keydown.ctrl.enter="ask()" />
        <div class="assistant-panel__actions">
          <button type="button" :disabled="pending" @click="ask()">{{ pending ? 'Searching...' : 'Ask knowledge base' }}</button>
          <button type="button" :disabled="pending" @click="ask(true)">Research web</button>
        </div>
        <p v-if="error" class="assistant-panel__error">{{ error }}</p>
        <article v-if="answer" class="assistant-panel__answer">
          <div class="assistant-panel__answer-meta"><strong>{{ answer.researched ? 'Research result' : 'Knowledge result' }}</strong><span>{{ answer.confidence }}</span></div>
          <p>{{ answer.answer }}</p>
          <small v-if="answer.sources.length">{{ answer.sources.length }} source{{ answer.sources.length === 1 ? '' : 's' }} found</small>
        </article>
      </section>
    </Transition>

    <button class="assistant-fab" type="button" :aria-expanded="isOpen" aria-label="Open OKSBI assistant" @click="isOpen = !isOpen">
      <span v-if="!isOpen" class="assistant-fab__spark" aria-hidden="true">✦</span>
      <span v-else aria-hidden="true">×</span>
    </button>
  </div>
</template>

<style scoped>
.assistant-widget { position: fixed; right: 24px; bottom: 24px; z-index: 100; display: flex; flex-direction: column; align-items: end; gap: 14px; font-family: Manrope, sans-serif; }
.assistant-fab { display: grid; width: 62px; height: 62px; place-items: center; border: 0; border-radius: 50%; background: #d95d39; color: #fffaf2; box-shadow: 0 12px 30px rgba(24,35,43,.28), 0 0 0 6px rgba(217,93,57,.14); font: inherit; font-size: 1.8rem; cursor: pointer; transition: transform 180ms ease, box-shadow 180ms ease; }
.assistant-fab:hover { transform: translateY(-3px) rotate(4deg); box-shadow: 0 16px 34px rgba(24,35,43,.32), 0 0 0 8px rgba(217,93,57,.16); }.assistant-fab__spark { transform: translateY(-1px); }.assistant-panel { width: min(360px, calc(100vw - 32px)); padding: 18px; border: 1px solid rgba(24,35,43,.14); border-radius: 22px; background: #fffaf2; color: #18232b; box-shadow: 0 20px 60px rgba(24,35,43,.22); }.assistant-panel__header, .assistant-panel__answer-meta { display: flex; align-items: start; justify-content: space-between; gap: 12px; }.assistant-panel__header strong { display: block; margin-top: 3px; font-family: Fraunces, Georgia, serif; font-size: 1.45rem; font-weight: 600; }.assistant-panel__eyebrow { color: #d95d39; font-size: .65rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }.assistant-panel__close { border: 0; background: transparent; color: #6b7775; font-size: 1.5rem; line-height: 1; cursor: pointer; }.assistant-panel__hint { margin: 14px 0; color: #6b7775; font-size: .76rem; line-height: 1.5; }.assistant-panel textarea { display: block; width: 100%; border: 1px solid rgba(24,35,43,.15); border-radius: 12px; background: #f6f0e8; padding: 11px; color: #18232b; font: inherit; font-size: .82rem; resize: vertical; }.assistant-panel__actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }.assistant-panel__actions button { border: 0; border-radius: 999px; padding: 10px 12px; background: #d95d39; color: #fffaf2; font: inherit; font-size: .7rem; font-weight: 800; cursor: pointer; }.assistant-panel__actions button + button { background: #18232b; }.assistant-panel__actions button:disabled { opacity: .55; cursor: wait; }.assistant-panel__error { color: #c0443d; font-size: .76rem; font-weight: 700; }.assistant-panel__answer { margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(24,35,43,.14); }.assistant-panel__answer-meta { font-size: .75rem; }.assistant-panel__answer-meta span { color: #55b79a; font-size: .7rem; font-weight: 800; text-transform: uppercase; }.assistant-panel__answer p { margin: 9px 0; color: #43504f; font-size: .8rem; line-height: 1.55; }.assistant-panel__answer small { color: #6b7775; font-size: .68rem; }.assistant-panel-enter-active, .assistant-panel-leave-active { transition: opacity 160ms ease, transform 160ms ease; }.assistant-panel-enter-from, .assistant-panel-leave-to { opacity: 0; transform: translateY(10px) scale(.98); }
@media (max-width: 560px) { .assistant-widget { right: 16px; bottom: 16px; }.assistant-fab { width: 56px; height: 56px; } }
</style>
