<template>
  <section class="demo-section">
    <h2 class="demo-section-title">TimeRangePicker</h2>
    <p class="demo-section-desc">Time range selection with independent start and end model bindings.</p>

    <y-card title="Basic">
      <div class="demo-row">
        <span class="demo-label">Range</span>
        <div class="demo-items">
          <y-time-range-picker v-model:start="start" v-model:end="end" clearable @change="onChange" />
          <span class="demo-item-hint">{{ start ?? 'empty' }} - {{ end ?? 'empty' }}</span>
        </div>
      </div>
      <p class="demo-time-range-info">Last change: {{ lastChange }}</p>
    </y-card>

    <y-card title="Single side allowed" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">Optional</span>
        <div class="demo-items">
          <y-time-range-picker v-model:start="optionalStart" v-model:end="optionalEnd" clearable />
          <span class="demo-item-hint">{{ optionalStart ?? 'empty' }} - {{ optionalEnd ?? 'empty' }}</span>
        </div>
      </div>
    </y-card>

    <y-card title="Force range" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">Required</span>
        <div class="demo-items">
          <y-time-range-picker
            v-model:start="requiredStart"
            v-model:end="requiredEnd"
            force-range
            clearable
          />
          <span class="demo-item-hint">{{ requiredStart ?? 'empty' }} - {{ requiredEnd ?? 'empty' }}</span>
        </div>
      </div>
    </y-card>

    <y-card title="Show seconds" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">Seconds</span>
        <div class="demo-items">
          <y-time-range-picker
            v-model:start="secondStart"
            v-model:end="secondEnd"
            show-seconds
            clearable
          />
          <span class="demo-item-hint">{{ secondStart ?? 'empty' }} - {{ secondEnd ?? 'empty' }}</span>
        </div>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const start = ref<string | null>('09:00:00')
const end = ref<string | null>('18:00:00')
const optionalStart = ref<string | null>('10:30:00')
const optionalEnd = ref<string | null>(null)
const requiredStart = ref<string | null>(null)
const requiredEnd = ref<string | null>(null)
const secondStart = ref<string | null>('08:15:30')
const secondEnd = ref<string | null>('12:45:00')
const lastChange = ref('none')

function onChange(startValue: string | null, endValue: string | null) {
  lastChange.value = `${startValue ?? 'empty'} - ${endValue ?? 'empty'}`
}
</script>

<style scoped>
.demo-time-range-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}
</style>
