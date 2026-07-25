<template>
  <Button @click="visible = true">{{ $t('demo.common.noMask') }}</Button>
  <Dialog v-model:show="visible" :title="$t('demo.common.noMask')" :mask="false">
    <p>{{ $t('demo.dialog.noMaskHint') }}</p>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, Button, Dialog } from 'yiz-ui'

const visible = ref(false)
</script>
