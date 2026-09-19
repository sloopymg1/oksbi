<script setup lang="ts">
const route = useRoute()
const auth = useAuth()

const isLanding = computed(() => route.path === '/')
</script>

<template>
  <nav class="app-top-nav" :class="{ 'app-top-nav--landing': isLanding }" aria-label="Main navigation">
    <NuxtLink class="app-top-nav__brand" to="/" aria-label="OKSBI home">
      <span class="app-top-nav__mark">O</span>
      <span>OKSBI</span>
    </NuxtLink>

    <div class="app-top-nav__links">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/about">About Us</NuxtLink>
      <NuxtLink to="/services">Our Services</NuxtLink>
      <NuxtLink to="/artists">Our Artists</NuxtLink>
      <NuxtLink to="/knowledge-base">Knowledge Base</NuxtLink>
    </div>

    <div class="app-top-nav__actions">
      <NuxtLink class="app-top-nav__ask" to="/ask">Ask OKSBI</NuxtLink>
      <NuxtLink v-if="!auth.user.value" class="app-top-nav__sign-in" to="/login">Sign in</NuxtLink>
      <NuxtLink v-if="!auth.user.value" class="app-top-nav__sign-up" to="/create-account">Sign up <span aria-hidden="true">↗</span></NuxtLink>
      <NuxtLink v-else class="app-top-nav__sign-up" to="/catalog">Open workspace <span aria-hidden="true">↗</span></NuxtLink>
    </div>
  </nav>
</template>

<style>
.app-top-nav { position: relative; z-index: 30; display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 76px; padding: 18px 5vw; background: var(--ink, #18232b); color: #fffaf2; }
.app-top-nav--landing { position: absolute; inset: 0 0 auto; background: transparent; }
.app-top-nav__brand { display: inline-flex; align-items: center; gap: 10px; color: inherit; font-size: 1.05rem; font-weight: 800; letter-spacing: .12em; }
.app-top-nav__mark { display: grid; width: 30px; height: 30px; place-items: center; border: 1px solid currentColor; border-radius: 50%; font-size: .75rem; letter-spacing: 0; }
.app-top-nav__links { position: absolute; left: 50%; display: flex; gap: clamp(16px, 3vw, 42px); transform: translateX(-50%); font-size: .78rem; font-weight: 700; }
.app-top-nav__links a { color: inherit; opacity: .8; transition: opacity 160ms ease; }
.app-top-nav__links a:hover, .app-top-nav__links a.router-link-active { opacity: 1; }
.app-top-nav__actions { display: flex; align-items: center; gap: 18px; margin-left: auto; font-size: .78rem; font-weight: 800; }
.app-top-nav__sign-in { color: #fffaf2; opacity: .9; }
.app-top-nav__ask { color: #f2b09d; }
.app-top-nav__sign-up { display: inline-flex; align-items: center; gap: 10px; padding: 11px 16px; border-radius: 999px; background: #fffaf2; color: var(--ink, #18232b); }
@media (max-width: 800px) { .app-top-nav { padding: 16px 20px; } .app-top-nav__links { display: none; } }
@media (max-width: 480px) { .app-top-nav__sign-in { display: none; } }
</style>
