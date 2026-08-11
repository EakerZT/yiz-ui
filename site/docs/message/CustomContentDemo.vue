<template>
  <y-button @click="openCustom">{{ t('demo.message.openCustom') }}</y-button>
</template>

<script lang="ts" setup>
import { h } from 'vue'
import { useLocale, message } from 'yiz-ui'

const t = useLocale()

function openCustom() {
  message.open({
    type: 'success',
    content: h('span', [
      t('demo.message.customPrefix'),
      h('strong', { style: 'margin-left: 4px; color: var(--yiz-color-success)' }, t('demo.common.success')),
    ]),
  })
}
</script>
