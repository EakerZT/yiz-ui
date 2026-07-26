<template>
  <y-scroll-box :max-height="150" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
    <p v-for="i in 10" :key="i" style="margin-bottom: 8px; color: #666">
      {{ $t('demo.scrollBox.maxHeightRow', { index: i }) }}
    </p>
  </y-scroll-box>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>

<style>
/* ScrollBox custom theme - blue */
</style>
