<template>
  <y-card :title="t('demo.card.cardTitle')" style="width: 360px">
    <p>{{ t('demo.card.content') }}</p>
  </y-card>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
