<template>
  <section class="demo-section">
    <h2 class="demo-section-title">ColorPicker 颜色选择器</h2>
    <p class="demo-section-desc">用于选择 HEX 颜色，支持 v-model、预设色和禁用状态。</p>

    <y-card title="基本" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">默认</span>
        <div class="demo-items">
          <y-color-picker v-model:value="color" />
          <span class="demo-color-value">{{ color }}</span>
        </div>
      </div>
    </y-card>

    <y-card title="透明通道" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">Alpha</span>
        <div class="demo-items">
          <y-color-picker v-model:value="alphaColor" alpha />
          <span class="demo-color-preview" :style="{ backgroundColor: alphaColor }" />
          <span class="demo-color-value">{{ alphaColor }}</span>
        </div>
      </div>
    </y-card>

    <y-card title="自定义预设" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">品牌色</span>
        <div class="demo-items">
          <y-color-picker v-model:value="brandColor" :presets="brandPresets" />
          <span class="demo-color-preview" :style="{ backgroundColor: brandColor }" />
          <span class="demo-color-value">{{ brandColor }}</span>
        </div>
      </div>
    </y-card>

    <y-card title="尺寸与禁用" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">小尺寸</span>
        <div class="demo-items">
          <y-color-picker v-model:value="smallColor" size="small" />
        </div>
      </div>
      <div class="demo-row">
        <span class="demo-label">禁用</span>
        <div class="demo-items">
          <y-color-picker v-model:value="disabledColor" disabled />
        </div>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const color = ref('#1677ff')
const alphaColor = ref('#1677ff80')
const brandColor = ref('#13c2c2')
const smallColor = ref('#52c41a')
const disabledColor = ref('#d9d9d9')

const brandPresets = ['#1677ff', '#13c2c2', '#52c41a', '#faad14', '#ff4d4f', '#722ed1']
</script>

<style scoped>
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
