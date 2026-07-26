<template>
  <y-button @click="openCustom">{{ $t('demo.message.openCustom') }}</y-button>
</template>

<script lang="ts" setup>
import { h } from 'vue'
import { $t, message } from 'yiz-ui'

function openCustom() {
  message.open({
    type: 'success',
    content: h('span', [
      $t('demo.message.customPrefix'),
      h('strong', { style: 'margin-left: 4px; color: var(--yiz-color-success)' }, $t('demo.common.success')),
    ]),
  })
}
</script>
