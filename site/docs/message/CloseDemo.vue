<template>
  <y-button @click="destroyAll">{{ $t('demo.message.destroyAll') }}</y-button>
</template>

<script lang="ts" setup>
import { $t, message } from 'yiz-ui'

function destroyAll() {
  message.destroy()
}
</script>
