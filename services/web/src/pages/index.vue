<script setup lang="ts">
const auth = useAuth()

const services = [
  { number: '01', title: 'Global distribution', text: 'Put every release in front of the listeners and platforms that matter.' },
  { number: '02', title: 'Rights, handled', text: 'Keep splits, ownership, and publishing details clear from first upload to final payment.' },
  { number: '03', title: 'Royalties you can read', text: 'See where your money comes from, what is cleared, and what is ready to move.' }
]

const artists = [
  { name: 'Nia Sol', genre: 'Alt R&B', image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=900&q=85' },
  { name: 'Kofi Bloom', genre: 'Afro-fusion', image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85' },
  { name: 'Mara June', genre: 'Electronic soul', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85' }
]

const societies = [
  { name: 'GHAMRO', kind: 'CMO', region: 'Ghana', description: 'Collective management of music rights and royalty collection.', website: 'https://ghamroonline.org/' },
  { name: 'CAPASSO', kind: 'CMO', region: 'South Africa', description: 'Mechanical and digital rights administration.', website: 'https://www.capasso.co.za/' },
  { name: 'SAMRO', kind: 'PRO', region: 'South Africa', description: 'Performing rights administration for composers, authors and publishers.', website: 'https://www.samro.org.za/' },
  { name: 'BMI', kind: 'PRO', region: 'United States', description: 'Performing rights organization for songwriters, composers and publishers.', website: 'https://www.bmi.com/' },
  { name: 'Sony Music Publishing', kind: 'Publisher', region: 'International', description: 'Music publishing and administration.', website: 'https://www.sonymusicpub.com/' },
  { name: 'GHMusic Publishing', kind: 'Publisher', region: 'Ghana', description: 'Music publishing and management.', website: 'https://ghmusicpublishing.com/about/' }
]
</script>

<template>
  <main class="landing-page">
    <section id="home" class="landing-hero">
      <div class="landing-hero-copy">
        <p class="landing-kicker">The artist-first music home</p>
        <h1>Make your music <em>move.</em></h1>
        <p class="landing-lede">OKSBI helps independent musicians release their work, protect their rights, and build a career that belongs to them.</p>
        <div class="landing-hero-actions"><NuxtLink class="landing-primary-button" to="/create-account">Start your artist journey <span aria-hidden="true">↗</span></NuxtLink><NuxtLink class="landing-text-link" to="/about">Discover OKSBI <span aria-hidden="true">↓</span></NuxtLink></div>
        <p v-if="auth.user.value" class="landing-session-note">Welcome back, {{ auth.user.value.fullName }}. <NuxtLink to="/catalog">Open your workspace</NuxtLink></p>
      </div>
      <div class="landing-hero-art" aria-label="A musician performing under warm stage lights" role="img"><div class="landing-hero-stamp">For the<br /><strong>ones<br />who make</strong></div><div class="landing-hero-caption"><span>01</span><span>Turn the volume up on your next chapter</span></div></div>
      <div class="landing-scroll-cue"><span>Scroll to explore</span><span class="landing-scroll-line" /></div>
    </section>

    <section id="about" class="landing-intro landing-section"><p class="landing-kicker">More than a platform</p><div class="landing-intro-grid"><h2>Your sound deserves a team that listens.</h2><p>From the first demo to the next sold-out room, we give independent artists the structure, reach, and clarity to keep creating.</p></div></section>

    <section id="services" class="landing-services landing-section"><div class="landing-section-heading"><p class="landing-kicker">What we do</p><h2>Everything behind<br /><em>the music.</em></h2></div><div class="landing-service-list"><article v-for="service in services" :key="service.number" class="landing-service-item"><span class="landing-service-number">{{ service.number }}</span><h3>{{ service.title }}</h3><p>{{ service.text }}</p><span class="landing-service-arrow" aria-hidden="true">↗</span></article></div></section>

    <section id="artists" class="landing-artists landing-section"><div class="landing-section-heading landing-artists-heading"><p class="landing-kicker">In good company</p><h2>Made by artists.<br /><em>Moved by many.</em></h2><p>There is a place here for the sound you have not made yet.</p></div><div class="landing-artist-grid"><article v-for="artist in artists" :key="artist.name" class="landing-artist-card"><img :src="artist.image" :alt="`${artist.name} performing`" /><div><strong>{{ artist.name }}</strong><span>{{ artist.genre }}</span></div></article></div></section>

    <section class="landing-societies landing-section"><div class="landing-societies-heading"><div><p class="landing-kicker">Publish &amp; Copyright Societies</p><h2>Rights travel<br /><em>with your music.</em></h2></div><NuxtLink class="landing-text-link landing-text-link-dark" to="/societies">View full directory <span aria-hidden="true">↗</span></NuxtLink></div><div class="landing-society-grid"><a v-for="society in societies" :key="society.name" class="landing-society-card" :href="society.website" target="_blank" rel="noreferrer"><div class="landing-society-meta"><span>{{ society.kind }}</span><span>{{ society.region }}</span></div><h3>{{ society.name }}</h3><p>{{ society.description }}</p><span class="landing-society-arrow" aria-hidden="true">↗</span></a></div></section>

    <section class="landing-cta"><p class="landing-kicker">Your next release starts here</p><h2>Let the world<br /><em>hear you.</em></h2><NuxtLink class="landing-primary-button landing-primary-button-light" to="/create-account">Join OKSBI <span aria-hidden="true">↗</span></NuxtLink></section>
    <footer class="landing-footer"><span class="landing-brand"><span class="landing-brand-mark">O</span> OKSBI</span><span>Music made independent.</span><span>© 2026 OKSBI</span></footer>
  </main>
</template>

<style scoped>
.landing-page { --landing-ink: #18232b; --landing-paper: #f6f0e8; --landing-coral: #d95d39; --landing-mint: #55b79a; background: var(--landing-paper); color: var(--landing-ink); font-family: Manrope, sans-serif; overflow: hidden; }
.landing-hero { position: relative; display: grid; min-height: min(850px, 100vh); align-items: center; padding: 150px 10vw 90px; background: #26352f; color: #fffaf2; isolation: isolate; }
.landing-hero::before { position: absolute; inset: 0; z-index: -2; content: ''; background: linear-gradient(90deg, rgba(20, 28, 27, .92) 0%, rgba(20, 28, 27, .62) 45%, rgba(20, 28, 27, .22) 100%), url('https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=2200&q=90') center/cover; }
.landing-hero::after { position: absolute; inset: 0; z-index: -1; content: ''; opacity: .25; background: radial-gradient(circle at 75% 25%, var(--landing-coral), transparent 28%), radial-gradient(circle at 82% 90%, var(--landing-mint), transparent 26%); mix-blend-mode: screen; }
.landing-hero-copy { max-width: 650px; }
.landing-kicker { margin: 0 0 20px; color: var(--landing-coral); font-size: .72rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
.landing-hero .landing-kicker { color: #f2b09d; }
.landing-hero h1 { max-width: 8ch; margin: 0; font-family: Fraunces, Georgia, serif; font-size: clamp(4rem, 8vw, 8.5rem); font-weight: 600; letter-spacing: 0; line-height: .88; }
.landing-hero h1 em, .landing-section h2 em, .landing-cta h2 em { color: #f08b70; font-style: italic; }
.landing-lede { max-width: 480px; margin: 30px 0 0; color: rgba(255, 250, 242, .78); font-size: 1rem; line-height: 1.7; }
.landing-hero-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 22px; margin-top: 34px; }
.landing-primary-button { display: inline-flex; align-items: center; gap: 14px; padding: 15px 21px; border-radius: 999px; background: var(--landing-coral); color: #fffaf2; font-size: .8rem; font-weight: 800; box-shadow: 0 12px 26px rgba(0, 0, 0, .16); }
.landing-text-link { color: #fffaf2; font-size: .8rem; font-weight: 800; }
.landing-text-link span { margin-left: 7px; color: #f2b09d; }
.landing-session-note { margin-top: 28px; color: rgba(255, 250, 242, .68); font-size: .75rem; }
.landing-session-note a { color: #fffaf2; text-decoration: underline; text-underline-offset: 4px; }
.landing-hero-art { position: absolute; right: 9vw; bottom: 12%; width: min(29vw, 360px); aspect-ratio: 3 / 4; border: 1px solid rgba(255, 250, 242, .4); background: url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=85') center/cover; box-shadow: 20px 25px 0 rgba(217, 93, 57, .55); transform: rotate(4deg); }
.landing-hero-stamp { position: absolute; top: 16px; left: -64px; padding: 15px; color: #fffaf2; font-size: .62rem; line-height: 1.25; text-transform: uppercase; letter-spacing: .1em; }
.landing-hero-stamp strong { font-size: 1rem; letter-spacing: 0; }
.landing-hero-caption { position: absolute; right: 0; bottom: -36px; left: 0; display: flex; justify-content: space-between; gap: 10px; color: rgba(255, 250, 242, .72); font-size: .62rem; letter-spacing: .05em; text-transform: uppercase; transform: rotate(-4deg); }
.landing-scroll-cue { position: absolute; right: 5vw; bottom: 34px; display: flex; align-items: center; gap: 12px; color: rgba(255, 250, 242, .66); font-size: .64rem; letter-spacing: .1em; text-transform: uppercase; transform: rotate(90deg); transform-origin: right center; }
.landing-scroll-line { display: block; width: 58px; height: 1px; background: currentColor; }
.landing-section { padding: 120px 10vw; }
.landing-intro { background: #fffaf2; }
.landing-intro-grid { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(240px, .7fr); gap: 12vw; align-items: end; }
.landing-section h2 { margin: 0; font-family: Fraunces, Georgia, serif; font-size: clamp(2.7rem, 5vw, 5.5rem); font-weight: 600; letter-spacing: 0; line-height: .95; }
.landing-intro-grid p { max-width: 350px; margin: 0; color: #6b7775; font-size: 1rem; line-height: 1.8; }
.landing-services { background: var(--landing-paper); }
.landing-section-heading { margin-bottom: 60px; }
.landing-section-heading h2 { max-width: 7ch; }
.landing-service-list { border-top: 1px solid rgba(24, 35, 43, .22); }
.landing-service-item { position: relative; display: grid; grid-template-columns: 100px 1fr 1fr 30px; gap: 28px; align-items: center; padding: 27px 0; border-bottom: 1px solid rgba(24, 35, 43, .22); }
.landing-service-number, .landing-service-item p { color: #6b7775; font-size: .78rem; }
.landing-service-item h3 { margin: 0; font-size: 1.35rem; }
.landing-service-item p { max-width: 300px; margin: 0; line-height: 1.6; }
.landing-service-arrow { color: var(--landing-coral); font-size: 1.4rem; }
.landing-artists { display: grid; grid-template-columns: .8fr 1.2fr; gap: 8vw; background: #d9e8df; }
.landing-artists-heading { margin: 0; }
.landing-artists-heading > p:last-child { max-width: 270px; margin-top: 28px; color: #517064; line-height: 1.6; }
.landing-artist-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; align-items: end; }
.landing-artist-card:nth-child(2) { transform: translateY(-34px); }
.landing-artist-card img { display: block; width: 100%; aspect-ratio: .72; object-fit: cover; filter: saturate(.78); }
.landing-artist-card div { display: flex; flex-direction: column; gap: 4px; padding-top: 12px; }
.landing-artist-card strong { font-size: .85rem; }
.landing-artist-card span { color: #517064; font-size: .7rem; }
.landing-societies { background: #fffaf2; }
.landing-societies-heading { display: flex; align-items: end; justify-content: space-between; gap: 30px; margin-bottom: 55px; }
.landing-societies-heading h2 { max-width: 8ch; }
.landing-text-link-dark { color: var(--landing-ink); }
.landing-text-link-dark span { color: var(--landing-coral); }
.landing-society-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.landing-society-card { position: relative; display: flex; min-height: 190px; flex-direction: column; gap: 12px; padding: 20px; border: 1px solid rgba(24, 35, 43, .18); color: var(--landing-ink); transition: transform 180ms ease, border-color 180ms ease; }
.landing-society-card:hover { border-color: var(--landing-coral); transform: translateY(-4px); }
.landing-society-meta { display: flex; justify-content: space-between; gap: 10px; color: var(--landing-coral); font-size: .65rem; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; }
.landing-society-card h3 { margin: 0; font-family: Fraunces, Georgia, serif; font-size: 1.5rem; font-weight: 600; }
.landing-society-card p { flex: 1; margin: 0; color: #6b7775; font-size: .78rem; line-height: 1.55; }
.landing-society-arrow { align-self: end; color: var(--landing-coral); font-size: 1.2rem; }
.landing-cta { padding: 130px 10vw; background: var(--landing-ink); color: #fffaf2; }
.landing-cta h2 { max-width: 7ch; margin-bottom: 35px; font-family: Fraunces, Georgia, serif; font-size: clamp(3rem, 6vw, 6rem); font-weight: 600; line-height: .9; }
.landing-primary-button-light { background: #fffaf2; color: var(--landing-ink); }
.landing-footer { display: flex; justify-content: space-between; gap: 20px; padding: 25px 5vw; background: var(--landing-ink); color: rgba(255, 250, 242, .56); border-top: 1px solid rgba(255, 250, 242, .16); font-size: .7rem; }
.landing-footer .landing-brand { color: #fffaf2; font-size: .82rem; }
@media (max-width: 800px) { .landing-hero { min-height: 760px; padding: 130px 8vw 90px; } .landing-hero-art { right: 8vw; bottom: 9%; width: 190px; } .landing-hero-stamp { left: -24px; } .landing-scroll-cue { display: none; } .landing-section { padding: 84px 8vw; } .landing-intro-grid, .landing-artists { grid-template-columns: 1fr; gap: 40px; } .landing-service-item { grid-template-columns: 42px 1fr 30px; gap: 14px; } .landing-service-item p { grid-column: 2 / 3; } .landing-artist-grid, .landing-society-grid { gap: 8px; } .landing-society-grid { grid-template-columns: repeat(2, 1fr); } .landing-footer { flex-wrap: wrap; } }
@media (max-width: 480px) { .landing-hero h1 { font-size: 4rem; } .landing-hero-art { width: 150px; opacity: .8; } .landing-service-item { grid-template-columns: 32px 1fr 20px; } .landing-service-item h3 { font-size: 1rem; } .landing-artist-card:nth-child(2) { transform: translateY(-18px); } }
</style>
