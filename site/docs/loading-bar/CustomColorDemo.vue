<template>
  <y-button-group>
    <y-button @click="onCustomColor('#52c41a')">{{ $t('demo.common.success') }}</y-button>
    <y-button @click="onCustomColor('#faad14')">{{ $t('demo.common.warning') }}</y-button>
    <y-button @click="onCustomColor('#ff4d4f')">{{ $t('demo.common.error') }}</y-button>
    <y-button @click="onReset">{{ $t('demo.loadingBar.reset') }}</y-button>
  </y-button-group>
</template>

<script lang="ts" setup>
import { $t, loadingBar } from 'yiz-ui'

function onCustomColor(color: string) {
  loadingBar.configure({ color })
  loadingBar.start()
  setTimeout(() => loadingBar.done(), 1500)
}

function onReset() {
  loadingBar.reset()
}
</script>
