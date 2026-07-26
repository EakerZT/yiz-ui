<template>
  <y-button type="primary" @click="openBasic">{{ $t('demo.notification.open') }}</y-button>
</template>

<script lang="ts" setup>
import { $t, notification } from 'yiz-ui'

function openBasic() {
  notification({
    title: $t('demo.notification.systemNotification'),
    content: $t('demo.notification.basicMsg'),
  })
}
</script>
