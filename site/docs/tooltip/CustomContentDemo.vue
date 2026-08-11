<template>
  <y-tooltip placement="top">
    <template #content>
      <span style="color: #f56c6c; font-weight: 600">{{ t('demo.tooltip.redBoldTip') }}</span>
    </template>
    <y-button>{{ t('demo.common.customSlot') }}</y-button>
  </y-tooltip>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
