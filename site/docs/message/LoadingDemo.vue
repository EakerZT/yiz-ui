<template>
  <y-button @click="openLoading">{{ $t('demo.message.loadingButton') }}</y-button>
</template>

<script lang="ts" setup>
import { $t, message } from 'yiz-ui'

function openLoading() {
  message.loading({
    key: 'message-demo-loading',
    content: $t('demo.message.loadingMsg'),
  })
  window.setTimeout(() => {
    message.success({
      key: 'message-demo-loading',
      content: $t('demo.message.loadedMsg'),
      duration: 2000,
    })
  }, 1200)
}
</script>
