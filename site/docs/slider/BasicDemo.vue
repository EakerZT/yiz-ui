<template>
  <div class="demo-slider-row">
    <y-slider v-model:value="basic" />
    <span class="demo-slider-value">{{ basic }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const basic = ref(30)
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
