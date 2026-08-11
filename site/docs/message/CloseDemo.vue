<template>
  <y-button @click="destroyAll">{{ t('demo.message.destroyAll') }}</y-button>
</template>

<script lang="ts" setup>
import { useLocale, message } from 'yiz-ui'

const t = useLocale()

function destroyAll() {
  message.destroy()
}
</script>
