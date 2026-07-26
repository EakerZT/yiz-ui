<template>
  <y-button @click="visible = true">{{ $t('demo.common.maskClosable') }}</y-button>
  <y-dialog v-model:show="visible" :title="$t('demo.common.maskClosable')" mask-closable>
    <p>{{ $t('demo.dialog.maskClosableHint') }}</p>
  </y-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const visible = ref(false)
</script>
