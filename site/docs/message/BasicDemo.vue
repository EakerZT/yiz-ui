<template>
  <y-button type="primary" @click="openBasic">{{ $t('demo.message.open') }}</y-button>
</template>

<script lang="ts" setup>
import { $t, message } from 'yiz-ui'

function openBasic() {
  message($t('demo.message.basicMsg'))
}
</script>
