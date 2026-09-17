<script setup lang="ts" generic="T">
defineProps<{
  data: T | null
  loading: boolean
  error: string | null
  empty: boolean
  emptyTitle: string
  emptyBody: string
  actionLabel?: string
}>()

const emit = defineEmits<{
  retry: []
  action: []
}>()
</script>

<template>
  <div>
    <div v-if="loading" class="surface">
    <div class="workspace-copy">
      <div class="skeleton-line" style="width: 30%" />
      <div class="skeleton-line" style="width: 62%" />
      <div class="stat-grid">
        <div class="skeleton-tile" />
        <div class="skeleton-tile" />
        <div class="skeleton-tile" />
        <div class="skeleton-tile" />
      </div>
    </div>
    </div>

    <div v-else-if="error" class="error-shell workspace-copy">
    <div class="topline">
      <span class="status-pill warning">
        <AppIcon name="warning" style="width: 14px; height: 14px" />
        Error
      </span>
    </div>
    <h2 class="section-title">The operational feed could not be loaded.</h2>
    <p class="helper-text">{{ error }}</p>
    <div class="button-row">
      <button class="primary-button" type="button" @click="emit('retry')">Retry request</button>
    </div>
    </div>

    <div v-else-if="empty" class="empty-shell workspace-copy">
    <span class="pill">
      <AppIcon name="spark" style="width: 14px; height: 14px" />
      Empty state
    </span>
    <h2 class="section-title">{{ emptyTitle }}</h2>
    <p class="helper-text">{{ emptyBody }}</p>
    <div v-if="actionLabel" class="button-row">
      <button class="primary-button" type="button" @click="emit('action')">{{ actionLabel }}</button>
    </div>
    </div>

    <slot v-else />
  </div>
</template>