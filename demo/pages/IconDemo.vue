<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Icon 图标</h2>
    <p class="demo-section-desc">渲染 @vicons/fluent 图标，支持自定义尺寸。</p>

    <div class="demo-row">
      <span class="demo-label">Size</span>
      <div class="demo-items">
        <span class="demo-item demo-item-icon"><y-icon :icon="Flash20Regular" :size="12" /><em>12</em></span>
        <span class="demo-item demo-item-icon"><y-icon :icon="Flash20Regular" :size="16" /><em>16</em></span>
        <span class="demo-item demo-item-icon"><y-icon :icon="Flash20Regular" :size="20" /><em>20</em></span>
        <span class="demo-item demo-item-icon"><y-icon :icon="Flash20Regular" :size="28" /><em>28</em></span>
        <span class="demo-item demo-item-icon"><y-icon :icon="Flash20Regular" :size="36" /><em>36</em></span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Flash20Regular } from '@vicons/fluent'
</script>
