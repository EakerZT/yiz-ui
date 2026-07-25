<template>
  <Button @click="visible = true">{{ $t('demo.common.hideCloseButton') }}</Button>
  <Dialog v-model:show="visible" :title="$t('demo.common.noCloseButton')" :closable="false" disabled-footer>
    <p>{{ $t('demo.dialog.noCloseHint') }}</p>
    <div style="margin-top: 16px">
      <Button type="primary" @click="visible = false">{{ $t('demo.common.close') }}</Button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, Button, Dialog } from 'yiz-ui'

const visible = ref(false)
</script>
