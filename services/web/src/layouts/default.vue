<script setup lang="ts">
const auth = useAuth()
const route = useRoute()

const isAuthPage = computed(() => route.path === '/login' || route.path === '/create-account')
const isPublicPage = computed(() => isAuthPage.value || ['/', '/about', '/services', '/artists', '/ask', '/knowledge-base'].includes(route.path))
const musicianRoutes = ['/membership', '/catalog']
const isAdminMusicianPage = computed(() => route.path === '/musicians' || route.path.startsWith('/musicians/'))

await callOnce(async () => {
  await auth.ensureSession()
})

watchEffect(() => {
  if (!auth.ready.value || isPublicPage.value) return
  if (!auth.user.value) {
    void navigateTo('/login')
  } else if (auth.user.value.role !== 'admin' && (isAdminMusicianPage.value || !musicianRoutes.includes(route.path))) {
    void navigateTo('/membership')
  }
})
</script>

<template>
  <AppTopNav />
  <AssistantFab />

  <div v-if="isPublicPage">
    <slot />
  </div>

  <div v-else class="page-shell">
    <AppSidebar />
    <main class="workspace-main">
      <AppHeader />
      <slot />
    </main>
  </div>
</template>