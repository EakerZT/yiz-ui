<template>
  <y-button @click="openManual">{{ t('demo.notification.needManualClose') }}</y-button>
</template>

<script lang="ts" setup>
import { useLocale, useNotification } from 'yiz-ui'

const t = useLocale()
const notification = useNotification()

function openManual() {
  notification({
    title: t('demo.notification.manualClose'),
    content: t('demo.notification.manualCloseHint'),
    duration: 0,
  })
}
</script>
