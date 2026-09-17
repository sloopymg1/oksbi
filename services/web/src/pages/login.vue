<script setup lang="ts">
const auth = useAuth()
const router = useRouter()

const email = ref('maya@oksbi.local')
const password = ref('')
const localError = ref<string | null>(null)

async function handleSubmit() {
  localError.value = null
  if (!email.value || !password.value) {
    localError.value = 'Enter your email and password to access the operations workspace.'
    return
  }

  try {
    await auth.login({ email: email.value, password: password.value })
    await router.push('/')
  } catch (caughtError) {
    localError.value = caughtError instanceof Error ? caughtError.message : 'Login failed.'
  }
}
</script>

<template>
  <main class="workspace-main" style="display: grid; min-height: 100vh; align-items: center">
    <section class="auth-shell auth-grid">
      <div class="auth-panel workspace-copy">
        <span class="eyebrow">API login</span>
        <h1 class="page-title" style="color: var(--ink)">Sign in to the OKSBI operations workspace.</h1>
        <p class="helper-text">
          Sign in with your OKSBI account to access the operations workspace.
        </p>
        <div class="button-row">
          <button class="primary-button" type="button" @click="handleSubmit">Sign in</button>
          <NuxtLink class="secondary-button" to="/create-account">Create account</NuxtLink>
        </div>
      </div>

      <div class="auth-panel workspace-copy">
        <label class="form-label">
          Email
          <input v-model="email" class="form-field" type="email" placeholder="maya@oksbi.local" />
        </label>
        <label class="form-label">
          Password
          <input v-model="password" class="form-field" type="password" placeholder="Your password" />
        </label>
        <p v-if="localError || auth.error.value" class="validation-note">{{ localError ?? auth.error.value }}</p>
        <button class="primary-button" type="button" :disabled="auth.pending.value" @click="handleSubmit">
          {{ auth.pending.value ? 'Signing in...' : 'Open dashboard' }}
        </button>
      </div>
    </section>
  </main>
</template>