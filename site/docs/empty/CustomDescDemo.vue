<template>
  <y-empty :description="t('demo.empty.noResult')" />
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
