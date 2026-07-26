<template>
  <p style="margin-bottom: 12px; font-size: 13px; color: #888">
    {{ $t('demo.scrollBox.autoHideScrollHint', { delay: 1300 }) }}
  </p>
  <y-scroll-box
    :height="120"
    auto-hide="scroll"
    :auto-hide-delay="1300"
    style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px"
  >
    <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">
      {{ $t('demo.scrollBox.autoHideScrollHint2') }}
    </p>
  </y-scroll-box>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>

<style>
/* ScrollBox custom theme - blue */
</style>
