<template>
  <div class="demo-picker-field">
    <y-date-range-picker v-model:start="affixStart" v-model:end="affixEnd" prefix="Sprint" suffix="UTC+8" clearable />
    <span class="demo-item-hint">{{ format(affixStart) }} - {{ format(affixEnd) }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const affixStart = ref<Date | null>(new Date(2026, 5, 15))

const affixEnd = ref<Date | null>(new Date(2026, 5, 21))

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
