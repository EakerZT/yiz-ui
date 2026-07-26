<template>
  <y-button-group>
    <y-button @click="onSet40">{{ $t('demo.loadingBar.set40') }}</y-button>
    <y-button @click="onInc">{{ $t('demo.loadingBar.inc') }}</y-button>
  </y-button-group>
</template>

<script lang="ts" setup>
import { $t, loadingBar } from 'yiz-ui'

function onSet40() {
  loadingBar.set(0.4)
}

function onInc() {
  loadingBar.inc()
}
</script>
