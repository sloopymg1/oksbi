<script setup lang="ts">
import type { HealthTone } from '~/types'

defineProps<{
  tone: HealthTone
  label: string
}>()
</script>

<template>
  <span class="status-pill" :class="tone">
    <AppIcon :name="tone === 'ok' ? 'check' : tone === 'warning' ? 'warning' : 'spark'" style="width: 14px; height: 14px" />
    {{ label }}
  </span>
</template>