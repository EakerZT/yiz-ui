<template>
  <section class="demo-section">
    <h2 class="demo-section-title">DateRangePicker</h2>
    <p class="demo-section-desc">Date range selection with independent start and end model bindings.</p>

    <y-card title="Basic">
      <div class="demo-row">
        <span class="demo-label">Range</span>
        <div class="demo-items">
          <y-date-range-picker v-model:start="start" v-model:end="end" clearable @change="onChange" />
          <span class="demo-item-hint">{{ format(start) }} - {{ format(end) }}</span>
        </div>
      </div>
      <p class="demo-date-range-info">Last change: {{ lastChange }}</p>
    </y-card>

    <y-card title="Single side allowed" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">Optional</span>
        <div class="demo-items">
          <y-date-range-picker v-model:start="optionalStart" v-model:end="optionalEnd" clearable />
          <span class="demo-item-hint">{{ format(optionalStart) }} - {{ format(optionalEnd) }}</span>
        </div>
      </div>
    </y-card>

    <y-card title="Force range" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">Required</span>
        <div class="demo-items">
          <y-date-range-picker v-model:start="requiredStart" v-model:end="requiredEnd" force-range clearable />
          <span class="demo-item-hint">{{ format(requiredStart) }} - {{ format(requiredEnd) }}</span>
        </div>
      </div>
    </y-card>

    <y-card title="Disable auto sort" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">Manual</span>
        <div class="demo-items">
          <y-date-range-picker v-model:start="manualStart" v-model:end="manualEnd" :auto-sort="false" clearable />
          <span class="demo-item-hint">{{ format(manualStart) }} - {{ format(manualEnd) }}</span>
        </div>
      </div>
    </y-card>

    <y-card title="Disabled dates" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">Weekends</span>
        <div class="demo-items">
          <y-date-range-picker
            v-model:start="workStart"
            v-model:end="workEnd"
            :disabled-date="disabledWeekend"
            clearable
          />
          <span class="demo-item-hint">{{ format(workStart) }} - {{ format(workEnd) }}</span>
        </div>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const start = ref<Date | null>(new Date(2026, 5, 1))
const end = ref<Date | null>(new Date(2026, 5, 12))
const optionalStart = ref<Date | null>(new Date(2026, 5, 8))
const optionalEnd = ref<Date | null>(null)
const requiredStart = ref<Date | null>(null)
const requiredEnd = ref<Date | null>(null)
const manualStart = ref<Date | null>(new Date(2026, 5, 20))
const manualEnd = ref<Date | null>(new Date(2026, 5, 10))
const workStart = ref<Date | null>(null)
const workEnd = ref<Date | null>(null)
const lastChange = ref('none')

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function format(date: Date | null) {
  if (!date) return 'empty'
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function onChange(startValue: Date | null, endValue: Date | null) {
  lastChange.value = `${format(startValue)} - ${format(endValue)}`
}

function disabledWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
}
</script>

<style scoped>
.demo-date-range-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}
</style>
