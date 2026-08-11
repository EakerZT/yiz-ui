<template>
  <y-button @click="openManual">{{ t('demo.notification.needManualClose') }}</y-button>
</template>

<script lang="ts" setup>
import { useLocale, notification } from 'yiz-ui'

const t = useLocale()

function openManual() {
  notification({
    title: t('demo.notification.manualClose'),
    content: t('demo.notification.manualCloseHint'),
    duration: 0,
  })
}
</script>
