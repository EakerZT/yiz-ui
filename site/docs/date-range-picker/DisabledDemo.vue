<template>
  <div class="demo-picker-field">
    <y-date-range-picker v-model:start="disabledStart" v-model:end="disabledEnd" disabled />
    <span class="demo-item-hint">{{ format(disabledStart) }} - {{ format(disabledEnd) }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const disabledStart = ref<Date | null>(new Date(2026, 5, 3))

const disabledEnd = ref<Date | null>(new Date(2026, 5, 9))

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function format(date: Date | null) {
  if (!date) return t('demo.common.empty')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
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
