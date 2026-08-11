<template>
  <y-button-group>
    <y-button @click="wideVisible = true">width="600px"</y-button>
    <y-button @click="narrowVisible = true">width="300px"</y-button>
  </y-button-group>

  <y-dialog v-model:show="wideVisible" :title="t('demo.dialog.wideDialog')" width="600px">
    <p>{{ t('demo.dialog.wideDialogHint') }}</p>
  </y-dialog>
  <y-dialog v-model:show="narrowVisible" :title="t('demo.dialog.narrowDialog')" width="300px">
    <p>{{ t('demo.dialog.narrowDialogHint') }}</p>
  </y-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const wideVisible = ref(false)
const narrowVisible = ref(false)
</script>
