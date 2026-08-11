<template>
  <span>{{ t('demo.common.view') }}</span
  ><y-divider direction="vertical" /><span>{{ t('demo.common.edit') }}</span
  ><y-divider direction="vertical" /><span>{{ t('demo.common.delete') }}</span>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
