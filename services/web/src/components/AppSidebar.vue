<script setup lang="ts">
const route = useRoute()

const navItems = [
  { to: '/', label: 'Dashboard', icon: 'dashboard', badge: 'live' },
  { to: '/membership', label: 'Musician profile', icon: 'rights', badge: '' },
  { to: '/catalog', label: 'My music & societies', icon: 'catalog', badge: '' },
  { to: '/rights', label: 'Rights', icon: 'rights', badge: '18' },
  { to: '/royalties', label: 'Royalties', icon: 'royalties', badge: '3' },
  { to: '/payouts', label: 'Payouts', icon: 'payouts', badge: '2' },
  { to: '/support', label: 'Support', icon: 'support', badge: '4' }
] as const
</script>

<template>
  <aside class="workspace-sidebar">
    <div class="brand-lockup workspace-copy">
      <span class="eyebrow">Music operations</span>
      <div class="brand-wordmark">OKSBI</div>
      <p class="muted">Join OKSBI, upload your music, and track PRO and CMO registrations.</p>
    </div>

    <div class="sidebar-panel workspace-copy" style="margin-bottom: 18px">
      <div class="topline">
        <strong>Workspace</strong>
        <span class="pill">Musician</span>
      </div>
      <p class="muted">OKSBI music registration</p>
    </div>

    <nav class="workspace-copy" aria-label="Primary navigation">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: route.path === item.to }"
      >
        <AppIcon :name="item.icon" style="width: 18px; height: 18px" />
        <span>{{ item.label }}</span>
        <span class="pill" style="justify-self: end">{{ item.badge }}</span>
      </NuxtLink>
    </nav>

    <div class="sidebar-stack" style="margin-top: 22px">
      <div class="sidebar-panel workspace-copy" style="width: 100%">
        <span class="eyebrow">Signal</span>
        <strong>Your registration journey</strong>
        <p class="muted">Profile → Upload music → OKSBI review → Society confirmation.</p>
      </div>
    </div>
  </aside>
</template>