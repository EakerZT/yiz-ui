<template>
  <y-button @click="onIndeterminate">{{ $t('demo.loadingBar.indeterminate') }}</y-button>
</template>

<script lang="ts" setup>
import { $t, loadingBar } from 'yiz-ui'

function onIndeterminate() {
  loadingBar.configure({ indeterminate: true })
  loadingBar.start()
  setTimeout(() => {
    loadingBar.done()
    loadingBar.configure({ indeterminate: false })
  }, 2500)
}
</script>
