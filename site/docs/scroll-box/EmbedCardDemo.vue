<template>
  <y-card :title="t('demo.scrollBox.scrollList')" style="width: 360px">
    <y-scroll-box :height="160">
      <div
        v-for="i in 6"
        :key="i"
        style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333"
      >
        {{ t('demo.scrollBox.listItem', { index: i }) }}
      </div>
    </y-scroll-box>
  </y-card>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>

<style>
/* ScrollBox custom theme - blue */
</style>
