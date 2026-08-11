<template>
  <p>{{ t('demo.divider.paragraph') }}</p>
  <y-divider />
  <p>{{ t('demo.divider.paragraph') }}</p>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
