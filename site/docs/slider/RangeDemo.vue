<template>
  <div class="demo-slider-row">
    <y-slider v-model:value="rangeValue" range :marks="rangeMarks" />
    <span class="demo-slider-value">{{ rangeValue[0] }} - {{ rangeValue[1] }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { type SliderMark } from 'yiz-ui'

const rangeValue = ref<[number, number]>([20, 60])

const rangeMarks = computed<SliderMark[]>(() => [
  { value: 0, label: '0' },
  { value: 50, label: '50' },
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
