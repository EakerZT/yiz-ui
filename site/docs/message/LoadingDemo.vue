<template>
  <y-button @click="openLoading">{{ t('demo.message.loadingButton') }}</y-button>
</template>

<script lang="ts" setup>
import { useLocale, useMessage } from 'yiz-ui'

const t = useLocale()
const message = useMessage()

function openLoading() {
  message.loading({
    key: 'message-demo-loading',
    content: t('demo.message.loadingMsg'),
  })
  window.setTimeout(() => {
    message.success({
      key: 'message-demo-loading',
      content: t('demo.message.loadedMsg'),
      duration: 2000,
    })
  }, 1200)
}
</script>
