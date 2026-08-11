<template>
  <y-button @click="visible = true">height="80%"</y-button>

  <y-dialog v-model:show="visible" :title="t('demo.dialog.customHeight')" height="80%">
    <p>{{ t('demo.dialog.customHeightHint') }}</p>
  </y-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const visible = ref(false)
</script>
