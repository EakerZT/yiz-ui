<template>
  <div class="demo-picker-field">
    <y-date-picker v-model:value="value1" />
    <span class="demo-item-hint">{{ value1 ? fmt(value1) : t('demo.common.notSelected') }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const value1 = ref<Date | null>(null)

function fmt(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
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

.demo-picker-field .yiz-date-picker {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
