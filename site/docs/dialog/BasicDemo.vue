<template>
  <y-button type="primary" @click="visible = true">{{ $t('demo.dialog.openDialog') }}</y-button>
  <y-dialog v-model:show="visible" :title="$t('demo.dialog.basicDialog')">
    <p>{{ $t('demo.dialog.basicContent') }}</p>
  </y-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const visible = ref(false)
</script>
