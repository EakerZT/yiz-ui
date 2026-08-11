<template>
  <y-button @click="visible = true">{{ t('demo.common.maskClosable') }}</y-button>
  <y-dialog v-model:show="visible" :title="t('demo.common.maskClosable')" mask-closable>
    <p>{{ t('demo.dialog.maskClosableHint') }}</p>
  </y-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const visible = ref(false)
</script>
