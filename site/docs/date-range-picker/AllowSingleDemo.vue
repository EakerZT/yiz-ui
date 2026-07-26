<template>
  <div class="demo-picker-field">
    <y-date-range-picker v-model:start="optionalStart" v-model:end="optionalEnd" clearable />
    <span class="demo-item-hint">{{ format(optionalStart) }} - {{ format(optionalEnd) }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const optionalStart = ref<Date | null>(new Date(2026, 5, 8))

const optionalEnd = ref<Date | null>(null)

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function format(date: Date | null) {
  if (!date) return $t('demo.common.empty')
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
