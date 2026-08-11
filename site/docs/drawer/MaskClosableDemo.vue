<template>
  <y-button @click="visible4 = true">{{ t('demo.common.maskClosable') }}</y-button>

  <y-drawer v-model:show="visible4" :title="t('demo.common.maskClosable')" :mask-closable="true">
    <p>{{ t('demo.drawer.maskClosableHint') }}</p>
  </y-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const visible4 = ref(false)
</script>
