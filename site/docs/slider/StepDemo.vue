<template>
  <div class="demo-slider-row">
    <y-slider v-model:value="stepValue" :min="-50" :max="50" :step="10" show-stops />
    <span class="demo-slider-value">{{ stepValue }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const stepValue = ref(20)
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
