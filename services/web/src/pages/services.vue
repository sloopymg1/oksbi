<script setup lang="ts">
const services = [
  { number: '01', title: 'Release distribution', detail: 'Deliver your music with clean metadata, reliable status tracking, and a clear view of where every release stands.', tone: 'coral' },
  { number: '02', title: 'Publishing and rights', detail: 'Organize contributors, splits, societies, and registration requests before details become costly problems.', tone: 'mint' },
  { number: '03', title: 'Royalty intelligence', detail: 'Follow statements, reconciliation, reserves, and available balances without waiting for a spreadsheet to tell the story.', tone: 'ink' },
  { number: '04', title: 'Artist support', detail: 'Get a human-readable operational trail for questions, takedowns, and the moments that need a considered response.', tone: 'sand' }
]
</script>

<template>
  <main class="services-page">
    <section class="services-intro"><p class="marketing-kicker">Our services</p><h1>The work behind your work.</h1><p>One considered place for the details that let your music travel further.</p></section>
    <section class="service-list"><article v-for="service in services" :key="service.number" class="service-row" :class="`service-row--${service.tone}`"><span class="service-number">{{ service.number }}</span><h2>{{ service.title }}</h2><p>{{ service.detail }}</p><span class="service-arrow" aria-hidden="true">↗</span></article></section>
    <section class="services-bottom"><div><p class="marketing-kicker">Start where you are</p><h2>Your next release does not need to wait.</h2></div><NuxtLink class="marketing-button" to="/create-account">Create your artist account <span aria-hidden="true">↗</span></NuxtLink></section>
  </main>
</template>

<style scoped>
.services-page { min-height: calc(100vh - 76px); background: #f6f0e8; color: #18232b; font-family: Manrope, sans-serif; }
.services-intro { padding: 125px 10vw 100px; background: #fffaf2; }
.marketing-kicker { margin: 0 0 20px; color: #d95d39; font-size: .72rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
.services-intro h1 { max-width: 760px; margin: 0; font-family: Fraunces, Georgia, serif; font-size: clamp(3.5rem, 7vw, 7rem); font-weight: 600; line-height: .9; }
.services-intro > p:last-child { max-width: 430px; margin: 30px 0 0; color: #6b7775; line-height: 1.7; }
.service-list { padding: 0 10vw; }
.service-row { display: grid; grid-template-columns: 90px 1fr 1fr 30px; gap: 30px; align-items: center; padding: 36px 0; border-bottom: 1px solid rgba(24,35,43,.22); }
.service-row--coral { border-top: 8px solid #d95d39; }.service-row--mint { border-top: 8px solid #55b79a; }.service-row--ink { border-top: 8px solid #18232b; }.service-row--sand { border-top: 8px solid #c5a67d; }
.service-number { color: #6b7775; font-size: .76rem; font-weight: 800; }.service-row h2 { margin: 0; font-family: Fraunces, Georgia, serif; font-size: clamp(1.7rem, 3vw, 3rem); font-weight: 600; }.service-row p { max-width: 340px; margin: 0; color: #6b7775; line-height: 1.7; }.service-arrow { color: #d95d39; font-size: 1.5rem; }
.services-bottom { display: flex; align-items: end; justify-content: space-between; gap: 30px; padding: 110px 10vw; background: #18232b; color: #fffaf2; }.services-bottom h2 { max-width: 600px; margin: 0; font-family: Fraunces, Georgia, serif; font-size: clamp(2.5rem, 5vw, 5rem); font-weight: 600; line-height: .96; }.services-bottom .marketing-kicker { color: #f2b09d; }.marketing-button { display: inline-flex; flex-shrink: 0; gap: 12px; padding: 14px 20px; border-radius: 999px; background: #d95d39; color: #fffaf2; font-size: .8rem; font-weight: 800; }
@media (max-width: 760px) { .services-intro, .service-list, .services-bottom { padding-right: 8vw; padding-left: 8vw; }.service-row { grid-template-columns: 42px 1fr 25px; gap: 14px; }.service-row p { grid-column: 2 / 3; }.services-bottom { align-items: start; flex-direction: column; } }
</style>
