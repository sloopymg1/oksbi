<script setup lang="ts">
const artists = [
  { name: 'Nia Sol', genre: 'Alt R&B', story: 'Songs for the late hours and the long way home.', image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1000&q=85' },
  { name: 'Kofi Bloom', genre: 'Afro-fusion', story: 'Rhythm, memory, and a little bit of future.', image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85' },
  { name: 'Mara June', genre: 'Electronic soul', story: 'A soft pulse for a louder kind of feeling.', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85' }
]
</script>

<template>
  <main class="artists-page">
    <section class="artists-intro"><p class="marketing-kicker">Our artists</p><h1>Many voices.<br /><em>One wide world.</em></h1><p>Meet the independent artists shaping the sound of what comes next.</p></section>
    <section class="artist-grid"><article v-for="artist in artists" :key="artist.name" class="artist-card"><img :src="artist.image" :alt="`${artist.name} performing`" /><div class="artist-card-copy"><p>{{ artist.genre }}</p><h2>{{ artist.name }}</h2><span>{{ artist.story }}</span></div></article></section>
    <section class="artists-join"><div><p class="marketing-kicker">Your voice belongs here</p><h2>Ready to add your track?</h2></div><NuxtLink class="artists-button" to="/create-account">Become an OKSBI artist <span aria-hidden="true">↗</span></NuxtLink></section>
  </main>
</template>

<style scoped>
.artists-page { min-height: calc(100vh - 76px); background: #d9e8df; color: #18232b; font-family: Manrope, sans-serif; }.artists-intro { padding: 125px 10vw 85px; }.marketing-kicker { margin: 0 0 20px; color: #d95d39; font-size: .72rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }.artists-intro h1 { margin: 0; font-family: Fraunces, Georgia, serif; font-size: clamp(3.5rem, 7vw, 7rem); font-weight: 600; line-height: .88; }.artists-intro h1 em { color: #d95d39; font-style: italic; }.artists-intro > p:last-child { max-width: 400px; margin: 30px 0 0; color: #517064; line-height: 1.7; }
.artist-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; padding: 0 10vw 120px; }.artist-card:nth-child(2) { transform: translateY(42px); }.artist-card img { display: block; width: 100%; aspect-ratio: .76; object-fit: cover; filter: saturate(.8); }.artist-card-copy { padding-top: 16px; }.artist-card-copy p { margin: 0 0 8px; color: #517064; font-size: .7rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }.artist-card-copy h2 { margin: 0 0 8px; font-family: Fraunces, Georgia, serif; font-size: 2rem; font-weight: 600; }.artist-card-copy span { color: #517064; font-size: .85rem; }.artists-join { display: flex; align-items: end; justify-content: space-between; gap: 30px; padding: 100px 10vw; background: #fffaf2; }.artists-join h2 { margin: 0; font-family: Fraunces, Georgia, serif; font-size: clamp(2.5rem, 5vw, 5rem); font-weight: 600; line-height: .95; }.artists-button { display: inline-flex; flex-shrink: 0; gap: 12px; padding: 14px 20px; border-radius: 999px; background: #d95d39; color: #fffaf2; font-size: .8rem; font-weight: 800; }
@media (max-width: 760px) { .artists-intro, .artist-grid, .artists-join { padding-right: 8vw; padding-left: 8vw; }.artist-grid { grid-template-columns: 1fr; }.artist-card:nth-child(2) { transform: none; }.artists-join { align-items: start; flex-direction: column; } }
</style>
