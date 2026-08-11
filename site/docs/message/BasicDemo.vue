<template>
  <y-button type="primary" @click="openBasic">{{ t('demo.message.open') }}</y-button>
</template>

<script lang="ts" setup>
import { useLocale, useMessage } from 'yiz-ui'

const t = useLocale()
const message = useMessage()

function openBasic() {
  message(t('demo.message.basicMsg'))
}
</script>
