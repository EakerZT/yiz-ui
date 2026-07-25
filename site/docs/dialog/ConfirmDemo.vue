<template>
  <ButtonGroup wrap gap="8">
    <Button type="primary" @click="openConfirm">{{ $t('demo.dialog.confirm') }}</Button>
    <Button @click="openAsyncConfirm">{{ $t('demo.dialog.asyncConfirm') }}</Button>
    <Button @click="openPreventConfirm">{{ $t('demo.dialog.preventClose') }}</Button>
  </ButtonGroup>
</template>

<script lang="ts" setup>
import { $t, Button, ButtonGroup, Dialog, message } from 'yiz-ui'

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
