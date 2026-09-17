<script setup lang="ts">
import { api } from '~/api'
import type { PayoutRecord } from '~/types'

const payoutResource = useApiResource<PayoutRecord[]>(() => api.listPayouts())
const rows = computed(() => payoutResource.data.value ?? [])

function confirmRelease(creator: string) {
  if (window.confirm(`Release payout for ${creator}? This action is operationally sensitive.`)) {
    void payoutResource.reload()
  }
}
</script>

<template>
  <StatePanel
    :data="rows"
    :loading="payoutResource.loading.value"
    :error="payoutResource.error.value"
    :empty="rows.length === 0"
    empty-title="No creator payouts are queued"
    empty-body="Approved royalty cycles will open settlement rows here when creators are ready for release."
    action-label="Start payout run"
    @retry="payoutResource.reload()"
  >
    <section class="workspace-copy">
      <div class="detail-grid">
        <article class="surface content-span-4 workspace-copy">
          <span class="eyebrow">Settlement watch</span>
          <h2 class="section-title">Compliance posture and payout scheduling stay adjacent to each creator row.</h2>
          <div class="feed-list">
            <article class="detail-card">
              <span class="metric-label">Queued for approval</span>
              <strong class="metric-value">2</strong>
              <span class="helper-text">Next payment rail release is 20 Sep at 10:00 UTC.</span>
            </article>
            <article class="detail-card">
              <span class="metric-label">Compliance holds</span>
              <strong class="metric-value">1</strong>
              <span class="helper-text">Banking mismatch blocks one EUR payout until reverified.</span>
            </article>
          </div>
        </article>

        <article class="table-shell content-span-8">
          <div class="table-toolbar">
            <div class="workspace-copy" style="gap: 6px">
              <strong>Creator payout queue</strong>
              <span class="helper-text">Funds, rail, tax posture, and release state.</span>
            </div>
            <button class="secondary-button" type="button">Export payment file</button>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Creator</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Tax status</th>
                <th>Scheduled</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.id">
                <td>{{ row.creator }}</td>
                <td>{{ row.amount }}</td>
                <td>{{ row.method }}</td>
                <td>{{ row.taxStatus }}</td>
                <td>{{ row.scheduledFor }}</td>
                <td><span class="pill">{{ row.status }}</span></td>
                <td>
                  <button class="ghost-button" type="button" @click="confirmRelease(row.creator)">Release</button>
                </td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </section>
  </StatePanel>
</template>