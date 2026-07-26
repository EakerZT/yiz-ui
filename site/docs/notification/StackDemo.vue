<template>
  <y-button @click="openMultiple">{{ $t('demo.notification.stackOpen') }}</y-button>
</template>

<script lang="ts" setup>
import { $t, notification } from 'yiz-ui'

function openMultiple() {
  for (let i = 1; i <= 4; i++) {
    notification({
      title: $t('demo.notification.notifLabel', { index: i }),
      content: $t('demo.notification.notifMsg', { index: i }),
      type: i % 2 === 0 ? 'success' : 'info',
      duration: 5000,
    })
  }
}
</script>
