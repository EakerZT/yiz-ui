<template>
  <y-button-group>
    <y-button @click="openInfo">info</y-button>
    <y-button color="success" @click="openSuccess">success</y-button>
    <y-button color="warning" @click="openWarning">warning</y-button>
    <y-button color="error" @click="openError">error</y-button>
  </y-button-group>
</template>

<script lang="ts" setup>
import { useLocale, message } from 'yiz-ui'

const t = useLocale()

function openInfo() {
  message.info(t('demo.message.infoMsg'))
}

function openSuccess() {
  message.success(t('demo.message.successMsg'))
}

function openWarning() {
  message.warning(t('demo.message.warningMsg'))
}

function openError() {
  message.error(t('demo.message.errorMsg'))
}
</script>
