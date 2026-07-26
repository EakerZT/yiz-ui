<template>
  <y-button-group>
    <y-button type="primary" @click="onStart">{{ $t('demo.loadingBar.start') }}</y-button>
    <y-button @click="onPause">{{ $t('demo.common.loading') }}</y-button>
    <y-button @click="onResume">{{ $t('demo.loadingBar.resume') }}</y-button>
    <y-button @click="onDone">{{ $t('demo.loadingBar.done') }}</y-button>
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

function onPause() {
  loadingBar.pause()
}

function onResume() {
  loadingBar.resume()
}
</script>
