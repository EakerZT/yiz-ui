<template>
  <div class="demo-picker-field">
    <y-date-time-picker v-model:value="value1" clearable />
    <span class="demo-item-hint">{{ formatValue(value1) }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const value1 = ref<Date | null>(new Date(2026, 5, 17, 9, 30, 0))

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function formatValue(value: Date | string | null) {
  if (!value) return $t('demo.common.empty')
  if (typeof value === 'string') return value
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())} ${pad(value.getHours())}:${pad(
    value.getMinutes(),
  )}:${pad(value.getSeconds())}`
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

.demo-picker-field .yiz-datetime-picker {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
