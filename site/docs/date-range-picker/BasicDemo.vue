<template>
  <div class="demo-picker-field">
    <y-date-range-picker v-model:start="start" v-model:end="end" clearable @change="onChange" />
    <span class="demo-item-hint">{{ format(start) }} - {{ format(end) }}</span>
  </div>
  <p class="demo-date-range-info">{{ $t('demo.dateRangePicker.lastChange', { value: lastChangeText }) }}</p>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

const start = ref<Date | null>(new Date(2026, 5, 1))

const end = ref<Date | null>(new Date(2026, 5, 12))

const lastChange = ref<{ start: Date | string | null; end: Date | string | null } | null>(null)

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function format(date: Date | null) {
  if (!date) return $t('demo.common.empty')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function formatValue(value: Date | string | null) {
  if (typeof value === 'string') return value
  return format(value)
}

const lastChangeText = computed(() =>
  lastChange.value
    ? `${formatValue(lastChange.value.start)} - ${formatValue(lastChange.value.end)}`
    : $t('demo.common.none'),
)

function onChange(startValue: Date | string | null, endValue: Date | string | null) {
  lastChange.value = { start: startValue, end: endValue }
}
</script>

<style scoped>
.demo-date-range-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}

.demo-picker-field {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.demo-picker-field .yiz-date-range-picker {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
