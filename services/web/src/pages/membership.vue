<script setup lang="ts">
import { request } from '~/api/client'
const form = reactive({ artistName: '', organizationName: 'Independent musician', countryCode: '', taxResidenceCountry: '' })
const pending = ref(false)
const error = ref('')
onMounted(async () => {
  try {
    const { profile } = await request<{ profile: typeof form | null }>('/onboarding')
    if (profile) Object.assign(form, profile)
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to load profile.' }
})
async function save() {
  pending.value = true; error.value = ''
  try {
    await request('/onboarding', { method: 'POST', body: JSON.stringify({ ...form, status: 'submitted' }) })
    await navigateTo('/catalog')
  } catch (e) { error.value = e instanceof Error ? e.message : 'Unable to save profile.' }
  finally { pending.value = false }
}
</script>
<template>
  <section class="surface workspace-copy">
    <span class="eyebrow">Step 1 · Musician profile</span>
    <h1 class="section-title">Welcome to OKSBI</h1>
    <p class="helper-text">Tell us who creates the music. Next, upload a track and provide its writers, ownership shares and requested PRO/CMO destinations.</p>
    <form class="form-stack" @submit.prevent="save">
      <label class="form-label">Artist / stage name<input v-model="form.artistName" class="form-field" required minlength="2" maxlength="160" /></label>
      <label class="form-label">Organization or independent musician<input v-model="form.organizationName" class="form-field" required minlength="2" maxlength="160" /></label>
      <label class="form-label">Country code (for example GH)<input v-model="form.countryCode" class="form-field" required pattern="[A-Za-z]{2}" maxlength="2" /></label>
      <label class="form-label">Tax residence country code<input v-model="form.taxResidenceCountry" class="form-field" required pattern="[A-Za-z]{2}" maxlength="2" /></label>
      <p v-if="error" role="alert" class="validation-note">{{ error }}</p>
      <button class="primary-button" :disabled="pending">{{ pending ? 'Saving…' : 'Save profile and upload music' }}</button>
    </form>
  </section>
</template>
