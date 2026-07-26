<template>
  <y-card style="width: 360px">
    <template #title>
      <span style="color: var(--yiz-color-primary); font-weight: 600">{{ $t('demo.card.customTitleStyle') }}</span>
    </template>
    <p>{{ $t('demo.card.customTitleHint') }}</p>
  </y-card>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
