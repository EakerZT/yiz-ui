<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.icon') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.icon.desc') }}</p>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <y-button-group>
        <span v-for="s in [12, 16, 20, 28, 36]" :key="s" class="demo-icon-item">
          <y-icon :icon="Flash20Regular" :size="s" />
          <em>{{ s }}px</em>
        </span>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.icon.renderSvg')" style="margin-top: 8px">
      <span class="demo-icon-item">
        <y-icon :icon="customSvgIcon" :size="32" />
        <em>{{ $t('demo.icon.svgString') }}</em>
      </span>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t, renderSvg } from 'yiz-ui'
import { Flash20Regular } from '@vicons/fluent'

const customSvg = `
<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" fill="currentColor" opacity="0.18"/>
  <path d="M12 3L20 7.5M12 3L4 7.5M12 3V12M20 7.5V16.5L12 21M20 7.5L12 12M12 21L4 16.5V7.5M12 21V12M4 7.5L12 12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
</svg>`

const customSvgIcon = () => renderSvg(customSvg)
</script>

<style scoped>
.demo-icon-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}
.demo-icon-item em {
  font-style: normal;
  color: #bbb;
}
</style>
