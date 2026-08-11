<template>
  <y-tooltip :content="t('demo.tooltip.longTip')" placement="top">
    <y-button type="primary">{{ t('demo.tooltip.hoverToView') }}</y-button>
  </y-tooltip>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
