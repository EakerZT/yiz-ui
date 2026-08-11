<template>
  <y-empty :description="t('demo.empty.cartEmpty')">
    <y-button type="primary" size="small">{{ t('demo.empty.goBrowse') }}</y-button>
  </y-empty>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
