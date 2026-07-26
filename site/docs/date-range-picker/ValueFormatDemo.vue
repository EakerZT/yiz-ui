<template>
  <div class="demo-picker-field">
    <y-date-range-picker
      v-model:start="stringStart"
      v-model:end="stringEnd"
      start-value-format="YYYY-MM-DD 00:00:00"
      end-value-format="YYYY-MM-DD 23:59:59"
      clearable
    />
    <span class="demo-item-hint">{{ formatValue(stringStart) }} - {{ formatValue(stringEnd) }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const stringStart = ref<string | null>('2026-06-01 00:00:00')

const stringEnd = ref<string | null>('2026-06-12 23:59:59')

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
</script>

<style scoped>
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
