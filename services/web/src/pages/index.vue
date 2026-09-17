<script setup lang="ts">
import { api } from '~/api'
import type { DashboardSnapshot } from '~/types'

const router = useRouter()
const auth = useAuth()

const dashboardResource = useApiResource<DashboardSnapshot>(() => api.getDashboardSnapshot())

watchEffect(() => {
  if (auth.ready.value && !auth.user.value) {
    void router.replace('/login')
  }
})

const snapshot = computed(() => dashboardResource.data.value)
const isEmpty = computed(() => !snapshot.value || snapshot.value.metrics.length === 0)
</script>

<template>
  <StatePanel
    :data="snapshot"
    :loading="dashboardResource.loading.value || !auth.ready.value"
    :error="auth.error.value ?? dashboardResource.error.value"
    :empty="isEmpty"
    empty-title="No operational data is staged yet"
    empty-body="When release intake, rights claims, and royalty imports are connected, this command surface will summarize the work here."
    action-label="Create first release"
    @retry="dashboardResource.reload()"
  >
    <section v-if="snapshot" class="workspace-copy">
      <div class="hero-card">
        <svg class="hero-mesh" aria-hidden="true" viewBox="0 0 800 400" preserveAspectRatio="none">
          <defs>
            <radialGradient id="m1" cx="0%" cy="0%" r="80%">
              <stop offset="0%" stop-color="#e7654b" stop-opacity="0.55" />
              <stop offset="100%" stop-color="#e7654b" stop-opacity="0" />
            </radialGradient>
            <radialGradient id="m2" cx="100%" cy="100%" r="80%">
              <stop offset="0%" stop-color="#8bbda7" stop-opacity="0.46" />
              <stop offset="100%" stop-color="#8bbda7" stop-opacity="0" />
            </radialGradient>
          </defs>
          <rect width="800" height="400" fill="url(#m1)" />
          <rect width="800" height="400" fill="url(#m2)" />
        </svg>

        <div class="hero-grid">
          <div class="hero-copy workspace-copy">
            <span class="eyebrow">Release + rights + finance</span>
            <h1 class="page-title">Landing view for the full music operations cycle.</h1>
            <p class="page-subtitle">
              {{ auth.user.value?.fullName }} is signed in, so the dashboard opens directly into delivery risk, split health,
              royalty close posture, and payout readiness.
            </p>
            <div class="button-row">
              <NuxtLink class="primary-button" to="/catalog">
                <AppIcon name="plus" style="width: 18px; height: 18px" />
                Review release queue
              </NuxtLink>
              <NuxtLink class="secondary-button" to="/rights">
                <AppIcon name="arrow" style="width: 18px; height: 18px" />
                Resolve rights exceptions
              </NuxtLink>
            </div>
          </div>

          <div class="hero-side workspace-copy">
            <div v-for="release in snapshot.spotlightReleases" :key="release.id" class="release-tile">
              <img :src="release.artworkUrl" :alt="release.title" class="release-art" />
              <div class="workspace-copy" style="gap: 8px">
                <strong>{{ release.title }}</strong>
                <span>{{ release.artist }}</span>
                <div class="stats-inline">
                  <span class="pill">{{ release.stage }}</span>
                  <span class="pill">{{ release.revenueAtRisk }} at risk</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stat-grid">
        <article v-for="metric in snapshot.metrics" :key="metric.id" class="surface metric-card">
          <div class="topline">
            <span class="metric-label">{{ metric.label }}</span>
            <StatusPill :label="metric.tone" :tone="metric.tone" />
          </div>
          <div class="metric-value">{{ metric.value }}</div>
          <p class="helper-text">{{ metric.trend }}</p>
        </article>
      </div>

      <div class="content-grid">
        <section class="surface content-span-8 workspace-copy">
          <div class="topline">
            <h2 class="section-title">Operational signal board</h2>
            <NuxtLink to="/royalties" class="secondary-button">Open ledger</NuxtLink>
          </div>
          <div class="alert-list">
            <article v-for="notice in snapshot.notices" :key="notice.id" class="alert-row" :class="notice.tone">
              <div class="topline">
                <strong>{{ notice.title }}</strong>
                <StatusPill :label="notice.tone" :tone="notice.tone" />
              </div>
              <p class="helper-text">{{ notice.detail }}</p>
            </article>
          </div>
        </section>

        <section class="surface content-span-4 workspace-copy">
          <div class="topline">
            <h2 class="section-title">Activity</h2>
            <span class="pill">Live feed</span>
          </div>
          <div class="feed-list">
            <article v-for="item in snapshot.activity" :key="item.id" class="feed-row">
              <strong>{{ item.title }}</strong>
              <p class="helper-text">{{ item.detail }}</p>
              <span class="muted">{{ item.timestamp }}</span>
            </article>
          </div>
        </section>

        <section class="surface content-span-12 workspace-copy">
          <div class="topline">
            <h2 class="section-title">Royalty health watch</h2>
            <NuxtLink to="/payouts" class="secondary-button">Prep payout cycle</NuxtLink>
          </div>
          <div class="detail-grid">
            <article v-for="item in snapshot.royaltyHealth" :key="item.id" class="detail-card content-span-6">
              <div class="topline">
                <strong>{{ item.title }}</strong>
                <StatusPill :label="item.tone" :tone="item.tone" />
              </div>
              <p class="helper-text">{{ item.detail }}</p>
            </article>
          </div>
        </section>
      </div>
    </section>
  </StatePanel>
</template>