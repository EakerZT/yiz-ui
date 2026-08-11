<template>
  <div class="demo-picker-field">
    <y-date-time-range-picker v-model:start="requiredStart" v-model:end="requiredEnd" force-range clearable />
    <span class="demo-item-hint">{{ formatValue(requiredStart) }} - {{ formatValue(requiredEnd) }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const requiredStart = ref<Date | null>(null)

const requiredEnd = ref<Date | null>(null)

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function formatValue(value: Date | string | null) {
  if (!value) return t('demo.common.empty')
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

.demo-picker-field .yiz-datetime-range-picker {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
