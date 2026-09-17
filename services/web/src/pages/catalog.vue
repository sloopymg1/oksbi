<script setup lang="ts">
import { api } from '~/api'
import type { ReleaseRecord } from '~/types'

const catalogResource = useApiResource<ReleaseRecord[]>(() => api.listCatalog())

const releases = computed(() => catalogResource.data.value ?? [])
</script>

<template>
  <StatePanel
    :data="releases"
    :loading="catalogResource.loading.value"
    :error="catalogResource.error.value"
    :empty="releases.length === 0"
    empty-title="No releases are staged for outbound delivery"
    empty-body="Use catalog intake to create a release, attach masters and artwork, then route it into provider QA."
    action-label="Create release"
    @retry="catalogResource.reload()"
  >
    <section class="workspace-copy">
      <div class="release-grid">
        <article class="surface content-span-4 workspace-copy">
          <span class="eyebrow">Catalog command</span>
          <h2 class="section-title">Release traffic is organized by next operational blocker.</h2>
          <p class="helper-text">Dense working rows keep UPCs, territory counts, delivery windows, and revenue exposure visible without leaving the queue.</p>
          <div class="button-row">
            <button class="primary-button" type="button">
              <AppIcon name="plus" style="width: 18px; height: 18px" />
              Start new release
            </button>
          </div>
        </article>

        <article class="surface content-span-8 workspace-copy">
          <div class="topline">
            <h2 class="section-title">Queue posture</h2>
            <span class="pill">43 active releases</span>
          </div>
          <div class="kpi-grid">
            <div class="mini-card">
              <span class="metric-label">Metadata holds</span>
              <strong class="metric-value">7</strong>
              <span class="helper-text">Priority before Friday deliveries</span>
            </div>
            <div class="mini-card">
              <span class="metric-label">QA staging</span>
              <strong class="metric-value">9</strong>
              <span class="helper-text">Awaiting provider pack checks</span>
            </div>
            <div class="mini-card">
              <span class="metric-label">Territory locks</span>
              <strong class="metric-value">3</strong>
              <span class="helper-text">Need rights clearance before export</span>
            </div>
            <div class="mini-card">
              <span class="metric-label">Revenue at risk</span>
              <strong class="metric-value">$49k</strong>
              <span class="helper-text">Weighted against next 7-day launches</span>
            </div>
          </div>
        </article>
      </div>

      <section class="table-shell">
        <div class="table-toolbar">
          <div class="workspace-copy" style="gap: 6px">
            <strong>Release workspace</strong>
            <span class="helper-text">Current delivery constraints and timing context.</span>
          </div>
          <div class="header-actions">
            <button class="secondary-button" type="button">Filter by stage</button>
            <button class="ghost-button" type="button">Export queue</button>
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Release</th>
              <th>UPC</th>
              <th>Stage</th>
              <th>Window</th>
              <th>Territories</th>
              <th>Revenue at risk</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="release in releases" :key="release.id">
              <td>
                <div class="person-row" style="grid-template-columns: 56px minmax(0, 1fr)">
                  <img :src="release.artworkUrl" :alt="release.title" class="avatar" style="width: 56px; height: 56px" />
                  <div class="workspace-copy" style="gap: 4px">
                    <strong>{{ release.title }}</strong>
                    <span class="helper-text">{{ release.artist }}</span>
                  </div>
                </div>
              </td>
              <td>{{ release.upc }}</td>
              <td><span class="pill">{{ release.stage }}</span></td>
              <td>{{ release.deliveryWindow }}</td>
              <td>{{ release.territories }}</td>
              <td>{{ release.revenueAtRisk }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </section>
  </StatePanel>
</template>