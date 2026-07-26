<template>
  <y-button @click="visible = true">{{ $t('demo.common.hideCloseButton') }}</y-button>
  <y-dialog v-model:show="visible" :title="$t('demo.common.noCloseButton')" :closable="false" disabled-footer>
    <p>{{ $t('demo.dialog.noCloseHint') }}</p>
    <div style="margin-top: 16px">
      <y-button type="primary" @click="visible = false">{{ $t('demo.common.close') }}</y-button>
    </div>
  </y-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const visible = ref(false)
</script>
