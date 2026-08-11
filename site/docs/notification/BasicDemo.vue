<template>
  <y-button type="primary" @click="openBasic">{{ t('demo.notification.open') }}</y-button>
</template>

<script lang="ts" setup>
import { useLocale, useNotification } from 'yiz-ui'

const t = useLocale()
const notification = useNotification()

function openBasic() {
  notification({
    title: t('demo.notification.systemNotification'),
    content: t('demo.notification.basicMsg'),
  })
}
</script>
