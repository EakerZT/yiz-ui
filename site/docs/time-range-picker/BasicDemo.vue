<template>
  <div class="demo-picker-field">
    <y-time-range-picker v-model:start="start" v-model:end="end" clearable @change="onChange" />
    <span class="demo-item-hint">{{
      (start ?? t('demo.common.empty')) + ' - ' + (end ?? t('demo.common.empty'))
    }}</span>
  </div>
  <p class="demo-time-range-info">{{ t('demo.timeRangePicker.lastChange', { value: lastChangeText }) }}</p>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const start = ref<string | null>('09:00:00')

const end = ref<string | null>('18:00:00')

const lastChange = ref<{ start: string | null; end: string | null } | null>(null)

const lastChangeText = computed(() => {
  if (!lastChange.value) return t('demo.common.none')
  const startValue = lastChange.value.start ?? t('demo.common.empty')
  const endValue = lastChange.value.end ?? t('demo.common.empty')
  return `${startValue} - ${endValue}`
})

function onChange(startValue: string | null, endValue: string | null) {
  lastChange.value = { start: startValue, end: endValue }
}
</script>

<style scoped>
.demo-time-range-info {
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

.demo-picker-field .yiz-time-range-picker {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
