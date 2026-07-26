<template>
  <y-tooltip :content="$t('demo.tooltip.tipHint')" placement="top">
    <span class="demo-link">{{ $t('demo.tooltip.hoverHere') }}</span>
  </y-tooltip>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>

<style scoped>
.demo-link {
  color: var(--yiz-color-primary);
  cursor: pointer;
  font-size: 14px;
}
.demo-link:hover {
  text-decoration: underline;
}
</style>
