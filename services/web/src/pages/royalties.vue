<script setup lang="ts">
import { api } from '~/api'
import type { RoyaltyRecord } from '~/types'

const royaltyResource = useApiResource<RoyaltyRecord[]>(() => api.listRoyalties())
const rows = computed(() => royaltyResource.data.value ?? [])
</script>

<template>
  <StatePanel
    :data="rows"
    :loading="royaltyResource.loading.value"
    :error="royaltyResource.error.value"
    :empty="rows.length === 0"
    empty-title="No royalty statements are loaded"
    empty-body="Imports, reserves, and net postings will appear after provider statements are staged for reconciliation."
    action-label="Import statement"
    @retry="royaltyResource.reload()"
  >
    <section class="workspace-copy">
      <div class="content-grid">
        <article class="surface content-span-4 workspace-copy">
          <span class="eyebrow">Royalty close</span>
          <h2 class="section-title">Gross-to-net movement is visible before anything hits payout approval.</h2>
          <div class="feed-list">
            <div class="detail-card">
              <span class="metric-label">Reserve ratio</span>
              <strong class="metric-value">5.0%</strong>
              <span class="helper-text">Down 0.8 pts after August source imports</span>
            </div>
            <div class="detail-card">
              <span class="metric-label">Out-of-tolerance lines</span>
              <strong class="metric-value">11</strong>
              <span class="helper-text">8 belong to a single TikTok Europe statement</span>
            </div>
          </div>
        </article>

        <article class="table-shell content-span-8">
          <div class="table-toolbar">
            <div class="workspace-copy" style="gap: 6px">
              <strong>Statement ledger</strong>
              <span class="helper-text">Provider source, reserve posture, and posting state.</span>
            </div>
            <div class="header-actions">
              <button class="secondary-button" type="button">Variance report</button>
              <button class="ghost-button" type="button">Hold adjustments</button>
            </div>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Source</th>
                <th>Gross</th>
                <th>Reserves</th>
                <th>Net</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.id">
                <td>{{ row.statementMonth }}</td>
                <td>{{ row.source }}</td>
                <td>{{ row.gross }}</td>
                <td>{{ row.reserves }}</td>
                <td>{{ row.net }}</td>
                <td><span class="pill">{{ row.status }}</span></td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </section>
  </StatePanel>
</template>