<script setup lang="ts">
import { api } from '~/api'
import type { SupportRecord } from '~/types'

const supportResource = useApiResource<SupportRecord[]>(() => api.listSupportCases())
const rows = computed(() => supportResource.data.value ?? [])
</script>

<template>
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