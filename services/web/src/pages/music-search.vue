<script setup lang="ts">
import { api } from '~/api'
import type { MusicSearchResult } from '~/api/types'

const title = ref('')
const artistName = ref('')
const urls = ref('')
const result = ref<MusicSearchResult | null>(null)
const loading = ref(false)
const error = ref('')

async function search() {
  error.value = ''; result.value = null
  if (title.value.trim().length < 2) { error.value = 'Enter a song title to search.'; return }
  loading.value = true
  try { result.value = await api.searchMusic({ title: title.value, artistName: artistName.value, urls: urls.value.split('\n').map(url => url.trim()).filter(Boolean) }) } catch (caught) { error.value = caught instanceof Error ? caught.message : 'Unable to search songs.' } finally { loading.value = false }
}
</script>

<template>
  <section class="workspace-copy music-search-page">
    <div class="music-search-hero"><div><span class="eyebrow">Administrator AI agent</span><h1 class="page-title">Research a song.</h1><p class="helper-text">Compare pending intake and approved catalog records by title and author before a work moves forward.</p></div><span class="music-search-mark">⌕</span></div>
    <section class="surface search-form"><div class="search-fields"><label class="form-label">Song title<input v-model="title" class="form-field" placeholder="Midnight" @keyup.enter="search" /></label><label class="form-label">Artist or author (optional)<input v-model="artistName" class="form-field" placeholder="Author name" @keyup.enter="search" /></label><label class="form-label search-wide">Public source URLs (optional)<textarea v-model="urls" class="textarea-field" rows="2" placeholder="One URL per line" /></label></div><button class="primary-button" type="button" :disabled="loading" @click="search">{{ loading ? 'Searching...' : 'Search title and authors' }}</button><p v-if="error" class="validation-note">{{ error }}</p></section>
    <template v-if="result">
      <section v-if="result.duplicateWarnings.length" class="search-warnings"><strong>Review warnings</strong><p v-for="warning in result.duplicateWarnings" :key="warning">{{ warning }}</p></section>
      <section class="surface search-results"><div class="topline"><div><span class="eyebrow">Evidence</span><h2 class="section-title">{{ result.matches.length }} matching record{{ result.matches.length === 1 ? '' : 's' }}</h2></div><span class="pill">{{ result.externalSearched ? 'Web researched' : 'Local records' }}</span></div><div v-if="!result.matches.length" class="search-empty">No title matches were found in the local catalog.</div><div v-else class="match-list"><article v-for="match in result.matches" :key="`${match.source}-${match.id}`" class="match-card"><div><div class="match-meta"><span>{{ match.source.replace('_', ' ') }}</span><span>{{ match.titleMatch }} title</span></div><h3>{{ match.title }}</h3><p>{{ match.author }}</p></div><div class="match-status"><span class="pill" :class="`confidence-${match.authorConfidence}`">{{ match.authorConfidence }} author match</span><span v-if="match.status" class="match-state">{{ match.status }}</span><a v-if="match.sourceUrl" :href="match.sourceUrl" target="_blank" rel="noreferrer">Open source ↗</a></div><p v-if="match.excerpt" class="match-excerpt">{{ match.excerpt }}</p></article></div></section>
    </template>
  </section>
</template>

<style scoped>
.music-search-page { gap: 18px; }.music-search-hero { display: flex; align-items: center; justify-content: space-between; gap: 28px; padding: 30px; border-radius: 28px; background: linear-gradient(135deg, #18232b, #34504a); color: #fffaf2; }.music-search-hero .page-title { margin: 8px 0; color: #fffaf2; }.music-search-hero .helper-text { max-width: 670px; color: rgba(255,250,242,.72); }.music-search-mark { display: grid; width: 96px; height: 96px; place-items: center; border: 1px solid rgba(255,250,242,.4); border-radius: 50%; color: #f2b09d; font-size: 4rem; }.search-form { display: flex; flex-direction: column; gap: 18px; }.search-fields { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }.search-wide { grid-column: 1 / -1; }.search-warnings { padding: 18px 22px; border-left: 4px solid #d95d39; background: rgba(217,93,57,.1); }.search-warnings p { margin: 8px 0 0; color: #8c3b2a; font-size: .82rem; }.search-results { display: flex; flex-direction: column; gap: 18px; }.match-list { display: flex; flex-direction: column; gap: 10px; }.match-card { display: grid; grid-template-columns: 1fr auto; gap: 18px; padding: 18px; border: 1px solid rgba(24,35,43,.12); border-radius: 16px; background: rgba(246,240,232,.55); }.match-meta { display: flex; gap: 12px; color: #d95d39; font-size: .68rem; font-weight: 800; text-transform: uppercase; }.match-card h3 { margin: 9px 0 4px; font-family: Fraunces, Georgia, serif; font-size: 1.45rem; font-weight: 600; }.match-card p { margin: 0; color: #6b7775; font-size: .82rem; }.match-status { display: flex; flex-direction: column; align-items: end; gap: 6px; }.match-state, .match-status a { color: #6b7775; font-size: .72rem; }.match-status a { color: #d95d39; font-weight: 800; }.confidence-high { background: rgba(192,68,61,.15); color: #a23a35; }.confidence-medium { background: rgba(183,121,31,.15); color: #96621a; }.confidence-low, .confidence-unknown { background: rgba(107,119,117,.14); color: #596664; }.match-excerpt { grid-column: 1 / -1; padding-top: 12px; border-top: 1px solid rgba(24,35,43,.1); line-height: 1.5; }.search-empty { padding: 46px 20px; color: #6b7775; text-align: center; }
@media (max-width: 700px) { .music-search-hero { align-items: start; }.music-search-mark { display: none; }.search-fields { grid-template-columns: 1fr; }.search-wide { grid-column: auto; }.match-card { grid-template-columns: 1fr; }.match-status { align-items: start; } }
</style>