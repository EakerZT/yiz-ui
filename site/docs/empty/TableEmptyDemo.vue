<template>
  <div style="border: 1px solid #d9d9d9; border-radius: 4px">
    <y-empty :description="t('demo.empty.noData')" size="small" />
  </div>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
