<template>
  <main class="marketing-page about-page">
    <section class="marketing-hero about-hero">
      <p class="marketing-kicker">About OKSBI</p>
      <h1>Built around the people behind the music.</h1>
      <p class="marketing-lede">Independent artists deserve more than a place to upload. They deserve clarity, care, and a partner that understands the work.</p>
    </section>
    <section class="about-story marketing-section">
      <div><p class="marketing-kicker">Our point of view</p><h2>The business of music should make more room for the music.</h2></div>
      <div class="about-copy"><p>OKSBI brings distribution, rights, publishing administration, and royalty visibility into one artist-first home.</p><p>We are building the infrastructure independent musicians need to move with confidence, without giving up ownership of their voice or their future.</p><NuxtLink class="marketing-button" to="/create-account">Join the community <span aria-hidden="true">↗</span></NuxtLink></div>
    </section>
    <section class="about-values marketing-section"><article><strong>Listen first</strong><span>Every artist has a different path. Our tools meet you where you are.</span></article><article><strong>Make it clear</strong><span>Rights, releases, and royalties should never feel like a black box.</span></article><article><strong>Keep it yours</strong><span>Your work stays at the center of every decision.</span></article></section>
  </main>
</template>

<style scoped>
.marketing-page { min-height: calc(100vh - 76px); background: #f6f0e8; color: #18232b; font-family: Manrope, sans-serif; }
.marketing-hero { min-height: 570px; padding: 150px 10vw 100px; display: flex; flex-direction: column; justify-content: end; background: linear-gradient(120deg, rgba(24,35,43,.94), rgba(24,35,43,.48)), url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1800&q=85') center/cover; color: #fffaf2; }
.marketing-kicker { margin: 0 0 20px; color: #d95d39; font-size: .72rem; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
.marketing-hero .marketing-kicker { color: #f2b09d; }
.marketing-hero h1 { max-width: 780px; margin: 0; font-family: Fraunces, Georgia, serif; font-size: clamp(3.5rem, 7vw, 7rem); font-weight: 600; line-height: .92; }
.marketing-lede { max-width: 520px; margin: 30px 0 0; color: rgba(255,250,242,.78); line-height: 1.7; }
.marketing-section { padding: 110px 10vw; }
.about-story { display: grid; grid-template-columns: 1.1fr .7fr; gap: 12vw; align-items: end; background: #fffaf2; }
.about-story h2 { margin: 0; font-family: Fraunces, Georgia, serif; font-size: clamp(2.7rem, 5vw, 5rem); font-weight: 600; line-height: .96; }
.about-copy { color: #6b7775; line-height: 1.8; }
.about-copy p { margin: 0 0 20px; }
.marketing-button { display: inline-flex; gap: 12px; margin-top: 18px; padding: 14px 20px; border-radius: 999px; background: #d95d39; color: #fffaf2; font-size: .8rem; font-weight: 800; }
.about-values { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; background: #d9e8df; }
.about-values article { display: flex; flex-direction: column; gap: 14px; border-top: 1px solid rgba(24,35,43,.3); padding-top: 20px; }
.about-values strong { font-family: Fraunces, Georgia, serif; font-size: 2rem; font-weight: 600; }
.about-values span { color: #517064; line-height: 1.6; }
@media (max-width: 760px) { .marketing-hero, .marketing-section { padding-right: 8vw; padding-left: 8vw; } .about-story, .about-values { grid-template-columns: 1fr; gap: 42px; } }
</style>
