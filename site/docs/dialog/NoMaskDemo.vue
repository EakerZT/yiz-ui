<template>
  <y-button @click="visible = true">{{ t('demo.common.noMask') }}</y-button>
  <y-dialog v-model:show="visible" :title="t('demo.common.noMask')" :mask="false">
    <p>{{ t('demo.dialog.noMaskHint') }}</p>
  </y-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const visible = ref(false)
</script>
