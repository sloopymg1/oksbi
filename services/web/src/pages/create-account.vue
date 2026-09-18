<script setup lang="ts">
const auth = useAuth()
const router = useRouter()

const form = reactive({
  fullName: '',
  organization: '',
  email: '',
  password: ''
})

const localError = ref<string | null>(null)
const successMessage = ref<string | null>(null)

async function handleCreateAccount() {
  localError.value = null
  successMessage.value = null

  if (!form.fullName || !form.email || !form.password) {
    localError.value = 'Complete every field before creating the account.'
    return
  }

  if (form.password.length < 12) {
          localError.value = 'Password must be at least 12 characters.'
    return
  }

  try {
    await auth.createAccount({ ...form })
    successMessage.value = 'Account created. Complete your musician profile next.'
    await router.push('/membership')
  } catch (caughtError) {
    localError.value = caughtError instanceof Error ? caughtError.message : 'Unable to create account.'
  }
}
</script>

<template>
  <main class="workspace-main" style="display: grid; min-height: 100vh; align-items: center">
    <section class="auth-shell auth-grid">
      <div class="auth-panel workspace-copy">
        <span class="eyebrow">Create account</span>
        <h1 class="page-title" style="color: var(--ink)">Join OKSBI. Give your music a home.</h1>
        <p class="helper-text">
          Register as a musician, upload your music, and request registration with performing rights organizations (PROs) and collective management organizations (CMOs).
        </p>
        <NuxtLink class="secondary-button" to="/login">Back to sign in</NuxtLink>
      </div>

      <div class="auth-panel workspace-copy">
        <div class="form-stack">
          <label class="form-label">
            Full name
            <input v-model="form.fullName" class="form-field" placeholder="Amina Doyle" />
          </label>

          <label class="form-label">
            Email
            <input v-model="form.email" class="form-field" type="email" placeholder="creator@oksbi.local" />
          </label>
          <label class="form-label">
            Password
            <input v-model="form.password" class="form-field" type="password" placeholder="At least 12 characters" />
            <span class="validation-note">Use an email address that is not already registered.</span>
          </label>
          <p v-if="localError || auth.error.value" class="validation-note">{{ localError ?? auth.error.value }}</p>
          <p v-if="successMessage" class="helper-text">{{ successMessage }}</p>
          <button class="primary-button" type="button" :disabled="auth.pending.value" @click="handleCreateAccount">
            {{ auth.pending.value ? 'Creating account...' : 'Create account' }}
          </button>
        </div>
      </div>
    </section>
  </main>
</template>