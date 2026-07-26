<template>
  <y-button @click="openCustom">{{ $t('demo.notification.openCustom') }}</y-button>
</template>

<script lang="ts" setup>
import { h } from 'vue'
import { $t, notification } from 'yiz-ui'

function openCustom() {
  notification.success({
    title: h('span', { style: 'color: var(--yiz-color-success)' }, $t('demo.common.customTitle')),
    content: h('div', [
      $t('demo.notification.customTitleHint'),
      h('div', { style: 'margin-top: 8px; color: #999' }, $t('demo.notification.noAutoCloseHint')),
    ]),
    duration: 0,
  })
}
</script>
