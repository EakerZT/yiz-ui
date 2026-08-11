<template>
  <p style="margin-bottom: 12px; font-size: 13px; color: #888">{{ t('demo.scrollBox.customThemeHint') }}</p>
  <y-scroll-box
    :height="120"
    theme="demo-scroll-theme"
    style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px"
  >
    <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">
      {{ t('demo.scrollBox.customThemeRow', { index: i }) }}
    </p>
  </y-scroll-box>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>

<style>
/* ScrollBox custom theme - blue */
.demo-scroll-theme {
  --yiz-scroll-thumb-bg: rgba(22, 119, 255, 0.25);
  --yiz-scroll-thumb-bg-hover: rgba(22, 119, 255, 0.45);
  --yiz-scroll-thumb-bg-active: rgba(22, 119, 255, 0.65);
  --yiz-scroll-thumb-radius: 6px;
  --yiz-scroll-track-size: 6px;
  --yiz-scroll-track-offset: 2px;
  --yiz-scroll-thumb-min-size: 30px;
}
</style>
