<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.datetimePicker.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.datetimePicker.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basic')">
      <div class="demo-picker-field">
        <y-datetime-picker v-model:value="value1" clearable />
        <span class="demo-item-hint">{{ formatValue(value1) }}</span>
      </div>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.datePicker.valueFormat')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-datetime-picker v-model:value="value2" value-format="YYYY-MM-DD HH:mm:ss" clearable />
        <span class="demo-item-hint">{{ value2 ?? $t('demo.common.empty') }}</span>
      </div>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-radio-button-group v-model:value="pickerSize" :options="sizeOptions" />
        <y-datetime-picker v-model:value="value3" :size="pickerSize" clearable />
      </div>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

type DemoSize = 'small' | 'default' | 'large'

const value1 = ref<Date | null>(new Date(2026, 5, 17, 9, 30, 0))
const value2 = ref<string | null>('2026-06-17 09:30:00')
const value3 = ref<Date | null>(null)
const pickerSize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]

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

.demo-picker-field :deep(.yiz-datetime-picker) {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
