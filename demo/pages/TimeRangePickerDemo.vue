<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.timeRangePicker.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.timeRangePicker.desc') }}</p>

    <y-card :title="$t('demo.common.basic')">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.timeRangePicker.timeRange') }}</span>
        <div class="demo-items">
          <y-time-range-picker v-model:start="start" v-model:end="end" clearable @change="onChange" />
          <span class="demo-item-hint">{{ start ?? '空' }} - {{ end ?? '空' }}</span>
        </div>
      </div>
      <p class="demo-time-range-info">上次变更：{{ lastChange }}</p>
    </y-card>

    <y-card :title="$t('demo.dateRangePicker.allowSingle')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.dateRangePicker.optional') }}</span>
        <div class="demo-items">
          <y-time-range-picker v-model:start="optionalStart" v-model:end="optionalEnd" clearable />
          <span class="demo-item-hint">{{ optionalStart ?? '空' }} - {{ optionalEnd ?? '空' }}</span>
        </div>
      </div>
    </y-card>

    <y-card :title="$t('demo.dateRangePicker.requiredRange')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.dateRangePicker.required') }}</span>
        <div class="demo-items">
          <y-time-range-picker
            v-model:start="requiredStart"
            v-model:end="requiredEnd"
            force-range
            clearable
          />
          <span class="demo-item-hint">{{ requiredStart ?? '空' }} - {{ requiredEnd ?? '空' }}</span>
        </div>
      </div>
    </y-card>

    <y-card :title="$t('demo.timePicker.showSeconds')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.timePicker.withSeconds') }}</span>
        <div class="demo-items">
          <y-time-range-picker
            v-model:start="secondStart"
            v-model:end="secondEnd"
            show-seconds
            clearable
          />
          <span class="demo-item-hint">{{ secondStart ?? '空' }} - {{ secondEnd ?? '空' }}</span>
        </div>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

const start = ref<string | null>('09:00:00')
const end = ref<string | null>('18:00:00')
const optionalStart = ref<string | null>('10:30:00')
const optionalEnd = ref<string | null>(null)
const requiredStart = ref<string | null>(null)
const requiredEnd = ref<string | null>(null)
const secondStart = ref<string | null>('08:15:30')
const secondEnd = ref<string | null>('12:45:00')
const lastChange = ref('无')

function onChange(startValue: string | null, endValue: string | null) {
  lastChange.value = `${startValue ?? '空'} - ${endValue ?? '空'}`
}
</script>

<style scoped>
.demo-time-range-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}
</style>
