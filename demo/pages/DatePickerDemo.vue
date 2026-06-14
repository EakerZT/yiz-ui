<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.datePicker.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.datePicker.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.common.selectDate') }}</span>
        <DatePicker v-model="value1" />
        <span class="demo-item-hint">已选：{{ value1 ? fmt(value1) : '未选择' }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.clearable')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.common.withClear') }}</span>
        <DatePicker v-model="value2" clearable />
        <span class="demo-item-hint">{{ $t('demo.common.clearByX') }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.common.disabledState') }}</span>
        <DatePicker v-model="value3" disabled />
      </div>
    </y-card>

    <y-card :title="$t('demo.common.smallSize')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.common.small') }}</span>
        <DatePicker v-model="value4" size="small" />
      </div>
    </y-card>

    <y-card :title="$t('demo.datePicker.disableDates')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.datePicker.limitRange') }}</span>
        <DatePicker v-model="value5" :disabled-date="disabledDate" />
        <span class="demo-item-hint">{{ $t('demo.datePicker.onlyAfterToday') }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.customFormat')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.datePicker.yearMonthDay') }}</span>
        <DatePicker v-model="value6" format="yyyy 年 MM 月 dd 日" :placeholder="$t('demo.common.placeholder')" />
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'
import { DatePicker } from 'yiz-ui'

const value1 = ref<Date | null>(null)
const value2 = ref<Date | null>(new Date())
const value3 = ref<Date | null>(new Date())
const value4 = ref<Date | null>(null)
const value5 = ref<Date | null>(null)
const value6 = ref<Date | null>(new Date())

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
