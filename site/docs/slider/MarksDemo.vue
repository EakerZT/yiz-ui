<template>
  <div class="demo-slider-row">
    <y-slider v-model:value="markValue" :step="10" :marks="marks" />
    <span class="demo-slider-value">{{ markValue }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t, type SliderMark } from 'yiz-ui'

const markValue = ref(40)

const marks = computed<SliderMark[]>(() => [
  { value: 0, label: '0' },
  { value: 30, label: $t('demo.slider.low') },
  { value: 70, label: $t('demo.slider.high') },
  { value: 100, label: '100' },
])
</script>

<style>
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
</style>
