<template>
  <y-info type="success" :message="t('demo.info.actionMessage')">
    <template #action>
      <y-button size="small" type="primary">{{ t('demo.common.view') }}</y-button>
    </template>
    {{ t('demo.info.actionDescription') }}
  </y-info>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
