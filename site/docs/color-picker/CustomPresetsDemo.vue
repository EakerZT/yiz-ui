<template>
  <div class="demo-picker-field">
    <y-color-picker v-model:value="brandColor" :presets="brandPresets" />
    <div class="demo-color-meta">
      <span class="demo-color-preview" :style="{ backgroundColor: brandColor }" />
      <span class="demo-color-value">{{ brandColor }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const brandColor = ref('#13c2c2')

const brandPresets = ['#1677ff', '#13c2c2', '#52c41a', '#faad14', '#ff4d4f', '#722ed1']
</script>

<style scoped>
.demo-picker-field {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.demo-picker-field .yiz-color-picker {
  width: 100%;
}

.demo-color-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.demo-color-value {
  color: #666;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  text-transform: uppercase;
}

.demo-color-preview {
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
</style>
