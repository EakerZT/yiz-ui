<template>
  <Button @click="visible = true">{{ $t('demo.common.maskClosable') }}</Button>
  <Dialog v-model:show="visible" :title="$t('demo.common.maskClosable')" mask-closable>
    <p>{{ $t('demo.dialog.maskClosableHint') }}</p>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, Button, Dialog } from 'yiz-ui'

const visible = ref(false)
</script>
