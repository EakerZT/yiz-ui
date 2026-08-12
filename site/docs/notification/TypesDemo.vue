<template>
  <y-button-group>
    <y-button @click="openInfo">info</y-button>
    <y-button color="success" @click="openSuccess">success</y-button>
    <y-button color="warning" @click="openWarning">warning</y-button>
    <y-button color="error" @click="openError">error</y-button>
  </y-button-group>
</template>

<script lang="ts" setup>
import { useLocale, useNotification } from 'yiz-ui'

const t = useLocale()
const notification = useNotification()

function openInfo() {
  notification.info({
    title: t('demo.common.info'),
    content: t('demo.notification.infoMsg'),
  })
}

function openSuccess() {
  notification.success({
    title: t('demo.common.success'),
    content: t('demo.notification.successMsg'),
  })
}

function openWarning() {
  notification.warning({
    title: t('demo.common.warning'),
    content: t('demo.notification.warningMsg'),
  })
}

function openError() {
  notification.error({
    title: t('demo.common.error'),
    content: t('demo.notification.errorMsg'),
  })
}
</script>
