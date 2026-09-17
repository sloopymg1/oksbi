<script setup lang="ts">
import { api } from '~/api'
import type { RightRecord } from '~/types'

const rightsResource = useApiResource<RightRecord[]>(() => api.listRights())
const rows = computed(() => rightsResource.data.value ?? [])
</script>

<template>
  <StatePanel
    :data="rows"
    :loading="rightsResource.loading.value"
    :error="rightsResource.error.value"
    :empty="rows.length === 0"
    empty-title="No rights conflicts need attention"
    empty-body="Claims, agreements, and split versions will appear here when there is a rights review queue."
    action-label="Create split review"
    @retry="rightsResource.reload()"
  >
    <section class="workspace-copy">
      <div class="detail-grid">
        <article class="surface content-span-4 workspace-copy">
          <span class="eyebrow">Rights review</span>
          <h2 class="section-title">Effective dates and approval state stay visible before any publishing changes ship.</h2>
          <p class="helper-text">Use this board to prevent overlapping claims, invalid ownership totals, or unapproved amendments from reaching finance.</p>
          <div class="note-card">
            <strong>Validation note</strong>
            <label class="form-label">
              Split amendment summary
              <input class="form-field" value="Two writers exceed 100.00% combined on Midnight Export" />
              <span class="validation-note">Total ownership must equal 100.00% before approval can proceed.</span>
            </label>
          </div>
        </article>

        <article class="table-shell content-span-8">
          <div class="table-toolbar">
            <div class="workspace-copy" style="gap: 6px">
              <strong>Current claims and split reviews</strong>
              <span class="helper-text">Publishing operations with audit context and blockers.</span>
            </div>
            <button class="secondary-button" type="button">Open approval log</button>
          </div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Work</th>
                <th>Writer</th>
                <th>Society</th>
                <th>Split status</th>
                <th>Issue</th>
                <th>Effective date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.id">
                <td>{{ row.work }}</td>
                <td>{{ row.writer }}</td>
                <td>{{ row.society }}</td>
                <td><span class="pill">{{ row.splitStatus }}</span></td>
                <td>{{ row.issue }}</td>
                <td>{{ row.effectiveDate }}</td>
              </tr>
            </tbody>
          </table>
        </article>
      </div>
    </section>
  </StatePanel>
</template>