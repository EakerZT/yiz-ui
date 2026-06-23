<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.slider.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.slider.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <div class="demo-slider-row">
        <y-slider v-model:value="basic" />
        <span class="demo-slider-value">{{ basic }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.slider.step')" style="margin-top: 16px">
      <div class="demo-slider-row">
        <y-slider v-model:value="stepValue" :min="-50" :max="50" :step="10" show-stops />
        <span class="demo-slider-value">{{ stepValue }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.slider.range')" style="margin-top: 16px">
      <div class="demo-slider-row">
        <y-slider v-model:value="rangeValue" range :marks="rangeMarks" />
        <span class="demo-slider-value">{{ rangeValue[0] }} - {{ rangeValue[1] }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.slider.marks')" style="margin-top: 16px">
      <div class="demo-slider-row">
        <y-slider v-model:value="markValue" :step="10" :marks="marks" />
        <span class="demo-slider-value">{{ markValue }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.slider.tooltip')" style="margin-top: 16px">
      <div class="demo-slider-row">
        <y-slider v-model:value="tooltipValue" :format-tooltip="formatTooltip" />
        <span class="demo-slider-value">{{ tooltipValue }}%</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 16px">
      <div class="demo-slider-stack">
        <y-slider v-model:value="disabledValue" disabled />
        <y-slider v-model:value="disabledRangeValue" range disabled />
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t, type SliderMark } from 'yiz-ui'

const basic = ref(30)
const stepValue = ref(20)
const rangeValue = ref<[number, number]>([20, 60])
const markValue = ref(40)
const tooltipValue = ref(35)
const disabledValue = ref(50)
const disabledRangeValue = ref<[number, number]>([25, 75])

const marks = computed<SliderMark[]>(() => [
  { value: 0, label: '0' },
  { value: 30, label: $t('demo.slider.low') },
  { value: 70, label: $t('demo.slider.high') },
  { value: 100, label: '100' }
])

const rangeMarks = computed<SliderMark[]>(() => [
  { value: 0, label: '0' },
  { value: 50, label: '50' },
  { value: 100, label: '100' }
])

function formatTooltip(value: number) {
  return `${value}%`
}
</script>

<style lang="less">
.demo-slider-row {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 560px;
}

.demo-slider-row .yiz-slider {
  flex: 1;
}

.demo-slider-value {
  width: 72px;
  flex-shrink: 0;
  color: #666;
  font-size: 13px;
  text-align: right;
}

.demo-slider-stack {
  display: grid;
  max-width: 520px;
  gap: 16px;
}
</style>
