<script setup lang="ts">
const auth = useAuth()
const route = useRoute()

const isAuthPage = computed(() => route.path === '/login' || route.path === '/create-account')

await callOnce(async () => {
  await auth.ensureSession()
})
</script>

<template>
  <div v-if="isAuthPage">
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