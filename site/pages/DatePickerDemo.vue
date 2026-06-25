<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.datePicker.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.datePicker.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <DatePicker v-model="value1" />
        <span class="demo-item-hint">{{ value1 ? fmt(value1) : $t('demo.common.notSelected') }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.clearable')" style="margin-top: 8px">
      <DatePicker v-model="value2" clearable />
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <DatePicker v-model="value3" disabled />
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-radio-button-group v-model:value="datePickerSize" :options="sizeOptions" />
        <DatePicker v-model="value4" :size="datePickerSize" />
      </div>
    </y-card>

    <y-card :title="$t('demo.datePicker.disableDates')" style="margin-top: 8px">
      <DatePicker v-model="value5" :disabled-date="disabledDate" />
    </y-card>

    <y-card :title="$t('demo.common.customFormat')" style="margin-top: 8px">
      <DatePicker v-model="value6" :format="$t('demo.datePicker.yearMonthDay')" :placeholder="$t('demo.common.placeholder')" />
    </y-card>

    <y-card :title="$t('demo.common.prefixSuffix')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <DatePicker v-model="value7" prefix="Due" suffix="CST" clearable />
        <span class="demo-item-hint">{{ value7 ? fmt(value7) : $t('demo.common.notSelected') }}</span>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'
import { DatePicker } from 'yiz-ui'

type DemoSize = 'small' | 'default' | 'large'

const value1 = ref<Date | null>(null)
const value2 = ref<Date | null>(new Date())
const value3 = ref<Date | null>(new Date())
const value4 = ref<Date | null>(null)
const value5 = ref<Date | null>(null)
const value6 = ref<Date | null>(new Date())
const value7 = ref<Date | null>(new Date(2026, 5, 17))
const datePickerSize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' }
]

function fmt(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function disabledDate(d: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d.getTime() < today.getTime()
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

.demo-picker-field :deep(.yiz-date-picker) {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
