<template>
  <y-button-group>
    <y-button @click="openTopLeft">top-left</y-button>
    <y-button @click="openTopRight">top-right</y-button>
    <y-button @click="openBottomLeft">bottom-left</y-button>
    <y-button @click="openBottomRight">bottom-right</y-button>
  </y-button-group>
</template>

<script lang="ts" setup>
import { useLocale, useNotification } from 'yiz-ui'

const t = useLocale()
const notification = useNotification()

function openTopLeft() {
  notification({
    title: t('demo.notification.topLeft'),
    content: t('demo.notification.topLeftHint'),
    placement: 'top-left',
  })
}

function openTopRight() {
  notification({
    title: t('demo.notification.topRight'),
    content: t('demo.notification.topRightHint'),
    placement: 'top-right',
  })
}

function openBottomLeft() {
  notification({
    title: t('demo.notification.bottomLeft'),
    content: t('demo.notification.bottomLeftHint'),
    placement: 'bottom-left',
  })
}

function openBottomRight() {
  notification({
    title: t('demo.notification.bottomRight'),
    content: t('demo.notification.bottomRightHint'),
    placement: 'bottom-right',
  })
}
</script>
