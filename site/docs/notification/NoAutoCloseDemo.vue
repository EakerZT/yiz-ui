<template>
  <y-button @click="openManual">{{ $t('demo.notification.needManualClose') }}</y-button>
</template>

<script lang="ts" setup>
import { $t, notification } from 'yiz-ui'

function openManual() {
  notification({
    title: $t('demo.notification.manualClose'),
    content: $t('demo.notification.manualCloseHint'),
    duration: 0,
  })
}
</script>
