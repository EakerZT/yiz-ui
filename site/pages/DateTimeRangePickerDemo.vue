<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.datetimeRangePicker.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.datetimeRangePicker.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basic')">
      <div class="demo-picker-field">
        <y-datetime-range-picker v-model:start="start" v-model:end="end" clearable />
        <span class="demo-item-hint">{{ formatValue(start) }} - {{ formatValue(end) }}</span>
      </div>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.dateRangePicker.valueFormat')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-datetime-range-picker
          v-model:start="stringStart"
          v-model:end="stringEnd"
          start-value-format="YYYY-MM-DD HH:mm:ss"
          end-value-format="YYYY-MM-DD HH:mm:ss"
          clearable
        />
        <span class="demo-item-hint"
          >{{ stringStart ?? $t('demo.common.empty') }} - {{ stringEnd ?? $t('demo.common.empty') }}</span
        >
      </div>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.dateRangePicker.requiredRange')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-datetime-range-picker v-model:start="requiredStart" v-model:end="requiredEnd" force-range clearable />
        <span class="demo-item-hint">{{ formatValue(requiredStart) }} - {{ formatValue(requiredEnd) }}</span>
      </div>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const start = ref<Date | null>(new Date(2026, 5, 1, 9, 0, 0))
const end = ref<Date | null>(new Date(2026, 5, 12, 18, 0, 0))
const stringStart = ref<string | null>('2026-06-01 00:00:00')
const stringEnd = ref<string | null>('2026-06-12 23:59:59')
const requiredStart = ref<Date | null>(null)
const requiredEnd = ref<Date | null>(null)

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

.demo-picker-field :deep(.yiz-datetime-range-picker) {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
