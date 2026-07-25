<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.icon') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.icon.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-icon-size-panel">
        <y-radio-button-group v-model:value="iconSize" :options="sizeOptions" />
        <span class="demo-icon-item">
          <y-icon :icon="Flash20Regular" :size="iconSize" />
          <em>{{ iconSize }}px</em>
        </span>
      </div>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.icon.renderSvg')" style="margin-top: 8px">
      <span class="demo-icon-item">
        <y-icon :icon="customSvgIcon" :size="32" />
        <em>{{ $t('demo.icon.svgString') }}</em>
      </span>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.icon.renderSvgIcon')" style="margin-top: 8px">
      <div class="demo-icon-size-panel">
        <y-radio-button-group v-model:value="svgIconSize" :options="sizeOptions" />
        <span class="demo-icon-item">
          <component :is="customSvgIconVNode" />
          <em>{{ $t('demo.icon.svgStringWithSize') }}</em>
        </span>
      </div>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t, renderSvg, renderSvgIcon } from 'yiz-ui'
import { Flash20Regular } from '@vicons/fluent'
import { ref } from 'vue'

const iconSize = ref(20)
const sizeOptions = [
  { label: '12px', value: 12 },
  { label: '20px', value: 20 },
  { label: '36px', value: 36 },
]

const customSvg = `
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z" fill="currentColor" opacity="0.18"/>
  <path d="M12 3L20 7.5M12 3L4 7.5M12 3V12M20 7.5V16.5L12 21M20 7.5L12 12M12 21L4 16.5V7.5M12 21V12M4 7.5L12 12" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
</svg>`

const customSvgIcon = () => renderSvg(customSvg)

const svgIconSize = ref(20)
const customSvgIconVNode = () => renderSvgIcon(customSvg, { size: svgIconSize.value })
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

.demo-icon-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
