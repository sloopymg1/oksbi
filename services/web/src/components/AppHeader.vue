<script setup lang="ts">
const auth = useAuth()
const router = useRouter()
const route = useRoute()

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': {
    title: 'Creator operations dashboard',
    subtitle: 'Release delivery, publishing rights, royalty close, and payout readiness tracked in one operational surface.'
  },
  '/membership': { title: 'Musician profile', subtitle: 'Join OKSBI and prepare your music for society registration.' },
  '/catalog': {
    title: 'My music & society registrations',
    subtitle: 'Upload your music and track each requested PRO or CMO registration.'
  },
  '/rights': {
    title: 'Rights control room',
    subtitle: 'Versioned splits, society alignment, and claims review staged with effective-date context.'
  },
  '/royalties': {
    title: 'Royalty ledger',
    subtitle: 'Statement imports, reserve posture, and reconciliation status kept audit-ready.'
  },
  '/payouts': {
    title: 'Payout center',
    subtitle: 'Approval queues, KYC posture, and settlement scheduling remain visible before release.'
  },
  '/support': {
    title: 'Support and takedowns',
    subtitle: 'Operational cases stay mapped to queue ownership, SLA risk, and provider escalation.'
  }
}

const pageMeta = computed(() => pageTitles[route.path] ?? pageTitles['/'])

async function handleLogout() {
  await auth.logout()
  await router.push('/login')
}
</script>

<template>
  <header class="workspace-header">
    <div class="workspace-copy">
      <span class="eyebrow">Authenticated workspace</span>
      <strong>{{ pageMeta.title }}</strong>
      <p class="helper-text">{{ pageMeta.subtitle }}</p>
    </div>

    <div class="workspace-copy" style="align-content: center">
      <div class="header-actions" style="justify-content: flex-end">
        <label style="position: relative; min-width: min(420px, 100%)">
          <AppIcon name="search" style="position: absolute; left: 14px; top: 14px; width: 18px; height: 18px; color: rgba(23, 33, 31, 0.52)" />
          <input class="search-field" style="padding-left: 42px" placeholder="Search releases, creators, claims, or payout runs" />
        </label>
        <button class="secondary-button" type="button" aria-label="Notifications">
          <AppIcon name="bell" style="width: 18px; height: 18px" />
          4 alerts
        </button>
        <button class="ghost-button" type="button" @click="handleLogout">
          <AppIcon name="logout" style="width: 18px; height: 18px" />
          Sign out
        </button>
      </div>
    </div>
  </header>
</template>