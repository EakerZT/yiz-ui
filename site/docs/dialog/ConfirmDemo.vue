<template>
  <y-button-group wrap gap="8">
    <y-button type="primary" @click="openConfirm">{{ $t('demo.dialog.confirm') }}</y-button>
    <y-button @click="openAsyncConfirm">{{ $t('demo.dialog.asyncConfirm') }}</y-button>
    <y-button @click="openPreventConfirm">{{ $t('demo.dialog.preventClose') }}</y-button>
  </y-button-group>
</template>

<script lang="ts" setup>
import { $t, Dialog, message } from 'yiz-ui'

function openConfirm() {
  Dialog.confirm({
    title: $t('demo.dialog.confirmTitle'),
    content: $t('demo.dialog.confirmContent'),
    onOk: () => {
      message.success($t('demo.dialog.confirmOk'))
    },
  })
}

function openAsyncConfirm() {
  Dialog.confirm({
    title: $t('demo.dialog.asyncConfirm'),
    content: $t('demo.dialog.asyncConfirmContent'),
    onOk: () =>
      new Promise<void>((resolve) => {
        window.setTimeout(() => {
          message.success($t('demo.dialog.asyncConfirmDone'))
          resolve()
        }, 1200)
      }),
  })
}

function openPreventConfirm() {
  Dialog.confirm({
    title: $t('demo.dialog.preventClose'),
    content: $t('demo.dialog.preventCloseContent'),
    onOk: () => {
      message.warning($t('demo.dialog.preventCloseHint'))
      return false
    },
  })
}
</script>
