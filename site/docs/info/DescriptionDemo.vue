<template>
  <y-info type="info" :message="t('demo.info.longMessage')" :description="t('demo.info.longDescription')" />
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
