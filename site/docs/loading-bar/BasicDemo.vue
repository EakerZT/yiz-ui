<template>
  <y-button-group>
    <y-button type="primary" @click="onStart">{{ $t('demo.loadingBar.start') }}</y-button>
    <y-button @click="onDone">{{ $t('demo.loadingBar.done') }}</y-button>
    <y-button color="error" @click="onFail">{{ $t('demo.loadingBar.fail') }}</y-button>
  </y-button-group>
</template>

<script lang="ts" setup>
import { $t, loadingBar } from 'yiz-ui'

function onStart() {
  loadingBar.start()
}

function onDone() {
  loadingBar.done()
}

function onFail() {
  loadingBar.start()
  setTimeout(() => loadingBar.fail(), 800)
}
</script>
