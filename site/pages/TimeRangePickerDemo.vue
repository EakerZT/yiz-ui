<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.timeRangePicker.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.timeRangePicker.desc') }}</p>

    <y-card :title="$t('demo.common.basic')">
      <div class="demo-picker-field">
        <y-time-range-picker v-model:start="start" v-model:end="end" clearable @change="onChange" />
        <span class="demo-item-hint">{{ (start ?? $t('demo.common.empty')) + ' - ' + (end ?? $t('demo.common.empty')) }}</span>
      </div>
      <p class="demo-time-range-info">{{ $t('demo.timeRangePicker.lastChange', { value: lastChange }) }}</p>
    </y-card>

    <y-card :title="$t('demo.dateRangePicker.allowSingle')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-time-range-picker v-model:start="optionalStart" v-model:end="optionalEnd" clearable />
        <span class="demo-item-hint">{{ (optionalStart ?? $t('demo.common.empty')) + ' - ' + (optionalEnd ?? $t('demo.common.empty')) }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.dateRangePicker.requiredRange')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-time-range-picker v-model:start="requiredStart" v-model:end="requiredEnd" force-range clearable />
        <span class="demo-item-hint">{{ (requiredStart ?? $t('demo.common.empty')) + ' - ' + (requiredEnd ?? $t('demo.common.empty')) }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-time-range-picker v-model:start="disabledStart" v-model:end="disabledEnd" disabled />
        <span class="demo-item-hint">{{
          (disabledStart ?? $t('demo.common.empty')) + ' - ' + (disabledEnd ?? $t('demo.common.empty'))
        }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.timePicker.showSeconds')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-time-range-picker v-model:start="secondStart" v-model:end="secondEnd" show-seconds clearable />
        <span class="demo-item-hint">{{ (secondStart ?? $t('demo.common.empty')) + ' - ' + (secondEnd ?? $t('demo.common.empty')) }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.prefixSuffix')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-time-range-picker
          v-model:start="affixStart"
          v-model:end="affixEnd"
          prefix="Work"
          suffix="UTC+8"
          clearable
        />
        <span class="demo-item-hint">{{
          (affixStart ?? $t('demo.common.empty')) + ' - ' + (affixEnd ?? $t('demo.common.empty'))
        }}</span>
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
const disabledStart = ref<string | null>('09:30:00')
const disabledEnd = ref<string | null>('17:30:00')
const secondStart = ref<string | null>('08:15:30')
const secondEnd = ref<string | null>('12:45:00')
const affixStart = ref<string | null>('09:00:00')
const affixEnd = ref<string | null>('18:00:00')
const lastChange = ref($t('demo.common.none'))

function onChange(startValue: string | null, endValue: string | null) {
  lastChange.value = `${startValue ?? $t('demo.common.empty')} - ${endValue ?? $t('demo.common.empty')}`
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

.demo-picker-field :deep(.yiz-time-range-picker) {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
