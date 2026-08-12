<template>
  <y-button @click="destroyAll">{{ t('demo.message.destroyAll') }}</y-button>
</template>

<script lang="ts" setup>
import { useLocale, useMessage } from 'yiz-ui'

const t = useLocale()
const message = useMessage()

function destroyAll() {
  message.destroy()
}
</script>
