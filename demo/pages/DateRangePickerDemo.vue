<template>
  <section class="demo-section">
    <h2 class="demo-section-title">DateRangePicker 日期段</h2>
    <p class="demo-section-desc">用于选择日期范围，支持开始和结束日期独立绑定。</p>

    <y-card title="基础用法">
      <div class="demo-row">
        <span class="demo-label">日期范围</span>
        <div class="demo-items">
          <y-date-range-picker v-model:start="start" v-model:end="end" clearable @change="onChange" />
          <span class="demo-item-hint">{{ format(start) }} - {{ format(end) }}</span>
        </div>
      </div>
      <p class="demo-date-range-info">上次变更：{{ lastChange }}</p>
    </y-card>

    <y-card title="允许单侧为空" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">可选</span>
        <div class="demo-items">
          <y-date-range-picker v-model:start="optionalStart" v-model:end="optionalEnd" clearable />
          <span class="demo-item-hint">{{ format(optionalStart) }} - {{ format(optionalEnd) }}</span>
        </div>
      </div>
    </y-card>

    <y-card title="强制范围" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">必填</span>
        <div class="demo-items">
          <y-date-range-picker v-model:start="requiredStart" v-model:end="requiredEnd" force-range clearable />
          <span class="demo-item-hint">{{ format(requiredStart) }} - {{ format(requiredEnd) }}</span>
        </div>
      </div>
    </y-card>

    <y-card title="关闭自动排序" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">手动</span>
        <div class="demo-items">
          <y-date-range-picker v-model:start="manualStart" v-model:end="manualEnd" :auto-sort="false" clearable />
          <span class="demo-item-hint">{{ format(manualStart) }} - {{ format(manualEnd) }}</span>
        </div>
      </div>
    </y-card>

    <y-card title="禁用日期" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">周末</span>
        <div class="demo-items">
          <y-date-range-picker
            v-model:start="workStart"
            v-model:end="workEnd"
            :disabled-date="disabledWeekend"
            clearable
          />
          <span class="demo-item-hint">{{ format(workStart) }} - {{ format(workEnd) }}</span>
        </div>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const start = ref<Date | null>(new Date(2026, 5, 1))
const end = ref<Date | null>(new Date(2026, 5, 12))
const optionalStart = ref<Date | null>(new Date(2026, 5, 8))
const optionalEnd = ref<Date | null>(null)
const requiredStart = ref<Date | null>(null)
const requiredEnd = ref<Date | null>(null)
const manualStart = ref<Date | null>(new Date(2026, 5, 20))
const manualEnd = ref<Date | null>(new Date(2026, 5, 10))
const workStart = ref<Date | null>(null)
const workEnd = ref<Date | null>(null)
const lastChange = ref('无')

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function format(date: Date | null) {
  if (!date) return '空'
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function onChange(startValue: Date | null, endValue: Date | null) {
  lastChange.value = `${format(startValue)} - ${format(endValue)}`
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
</style>
