<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.dateRangePicker') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.dateRangePicker.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basic')">
      <div class="demo-picker-field">
        <y-date-range-picker v-model:start="start" v-model:end="end" clearable @change="onChange" />
        <span class="demo-item-hint">{{ format(start) }} - {{ format(end) }}</span>
      </div>
      <p class="demo-date-range-info">{{ $t('demo.dateRangePicker.lastChange', { value: lastChange }) }}</p>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.dateRangePicker.allowSingle')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-date-range-picker v-model:start="optionalStart" v-model:end="optionalEnd" clearable />
        <span class="demo-item-hint">{{ format(optionalStart) }} - {{ format(optionalEnd) }}</span>
      </div>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.dateRangePicker.requiredRange')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-date-range-picker v-model:start="requiredStart" v-model:end="requiredEnd" force-range clearable />
        <span class="demo-item-hint">{{ format(requiredStart) }} - {{ format(requiredEnd) }}</span>
      </div>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-date-range-picker v-model:start="disabledStart" v-model:end="disabledEnd" disabled />
        <span class="demo-item-hint">{{ format(disabledStart) }} - {{ format(disabledEnd) }}</span>
      </div>
    </demo-card>

    <demo-card :source-index="4" :title="$t('demo.dateRangePicker.disableAutoSort')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-date-range-picker v-model:start="manualStart" v-model:end="manualEnd" :auto-sort="false" clearable />
        <span class="demo-item-hint">{{ format(manualStart) }} - {{ format(manualEnd) }}</span>
      </div>
    </demo-card>

    <demo-card :source-index="5" :title="$t('demo.dateRangePicker.disableDates')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-date-range-picker
          v-model:start="workStart"
          v-model:end="workEnd"
          :disabled-date="disabledWeekend"
          clearable
        />
        <span class="demo-item-hint">{{ format(workStart) }} - {{ format(workEnd) }}</span>
      </div>
    </demo-card>

    <demo-card :source-index="6" :title="$t('demo.dateRangePicker.valueFormat')" style="margin-top: 8px">
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
    </demo-card>

    <demo-card :source-index="7" :title="$t('demo.common.prefixSuffix')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-date-range-picker
          v-model:start="affixStart"
          v-model:end="affixEnd"
          prefix="Sprint"
          suffix="UTC+8"
          clearable
        />
        <span class="demo-item-hint">{{ format(affixStart) }} - {{ format(affixEnd) }}</span>
      </div>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

const start = ref<Date | null>(new Date(2026, 5, 1))
const end = ref<Date | null>(new Date(2026, 5, 12))
const optionalStart = ref<Date | null>(new Date(2026, 5, 8))
const optionalEnd = ref<Date | null>(null)
const requiredStart = ref<Date | null>(null)
const requiredEnd = ref<Date | null>(null)
const disabledStart = ref<Date | null>(new Date(2026, 5, 3))
const disabledEnd = ref<Date | null>(new Date(2026, 5, 9))
const manualStart = ref<Date | null>(new Date(2026, 5, 20))
const manualEnd = ref<Date | null>(new Date(2026, 5, 10))
const workStart = ref<Date | null>(null)
const workEnd = ref<Date | null>(null)
const stringStart = ref<string | null>('2026-06-01 00:00:00')
const stringEnd = ref<string | null>('2026-06-12 23:59:59')
const affixStart = ref<Date | null>(new Date(2026, 5, 15))
const affixEnd = ref<Date | null>(new Date(2026, 5, 21))
const lastChange = ref($t('demo.common.none'))

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

function onChange(startValue: Date | string | null, endValue: Date | string | null) {
  lastChange.value = `${formatValue(startValue)} - ${formatValue(endValue)}`
}

function disabledWeekend(date: Date) {
  return date.getDay() === 0 || date.getDay() === 6
}
</script>

<style scoped>
.demo-date-range-info {
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

.demo-picker-field :deep(.yiz-date-range-picker) {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
