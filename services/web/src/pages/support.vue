<script setup lang="ts">
import { api } from '~/api'
import { request } from '~/api/client'
const subject = ref('')
const description = ref('')
const sending = ref(false)
const feedback = ref('')
async function createCase() {
  sending.value = true
  try {
    await request('/support/cases', { method: 'POST', body: JSON.stringify({ category: 'rights', subject: subject.value, description: description.value }) })
    feedback.value = 'Your rights support request has been sent to OKSBI.'
    subject.value = ''; description.value = ''; await supportResource.reload()
  } catch (e) { feedback.value = e instanceof Error ? e.message : 'Unable to send request.' }
  finally { sending.value = false }
}
import type { SupportRecord } from '~/types'

const supportResource = useApiResource<SupportRecord[]>(() => api.listSupportCases())
const rows = computed(() => supportResource.data.value ?? [])
</script>

<template>
  <section class="surface workspace-copy" style="margin-bottom: 24px">
    <h1 class="section-title">Contact OKSBI about your music registration</h1>
    <form class="form-stack" @submit.prevent="createCase">
      <label class="form-label">Subject / track title<input v-model="subject" required maxlength="180" class="form-field" /></label>
      <label class="form-label">Corrections or questions<textarea v-model="description" required minlength="10" maxlength="4000" class="form-field" /></label>
      <p v-if="feedback" role="status">{{ feedback }}</p>
      <button class="primary-button" :disabled="sending">{{ sending ? 'Sending…' : 'Send to OKSBI' }}</button>
    </form>
  </section>
  <StatePanel
    :data="rows"
    :loading="supportResource.loading.value"
    :error="supportResource.error.value"
    :empty="rows.length === 0"
    empty-title="No open support or takedown cases"
    empty-body="Queue assignments, provider escalations, and SLA risk will appear once cases enter operations."
    action-label="Open support case"
    @retry="supportResource.reload()"
  >
    <section class="workspace-copy">
      <div class="support-grid">
        <article class="surface content-span-4 workspace-copy">
          <span class="eyebrow">Support desk</span>
          <h2 class="section-title">Cases are grouped by operational queue with takedown urgency kept visible.</h2>
          <p class="helper-text">Support, copyright, and payout incidents stay attached to ownership and creator context.</p>
          <div class="detail-card">
            <span class="metric-label">SLA warning</span>
            <strong class="metric-value">4</strong>
            <span class="helper-text">Critical catalog integrity cases must be reviewed within six hours.</span>
          </div>
        </article>

        <article class="table-shell content-span-8">
          <div class="table-toolbar">
            <div class="workspace-copy" style="gap: 6px">
              <strong>Queue and escalation view</strong>
              <span class="helper-text">Owner, queue, and provider involvement at a glance.</span>
            </div>
            <button class="secondary-button" type="button">Escalation board</button>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Case</th>
                <th>Queue</th>
                <th>Priority</th>
                <th>Owner</th>
                <th>Updated</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.id">
                <td>{{ row.subject }}</td>
                <td>{{ row.queue }}</td>
                <td>{{ row.priority }}</td>
                <td>{{ row.owner }}</td>
                <td>{{ row.updatedAt }}</td>
                <td><span class="pill">{{ row.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </section>
  </StatePanel>
</template>