<template>
  <y-button @click="visible = true">{{ t('demo.dialog.draggable') }}</y-button>
  <y-dialog v-model:show="visible" :title="t('demo.dialog.dragTitle')" drag>
    <p>{{ t('demo.dialog.dragTitleHint') }}</p>
    <p style="margin-top: 8px; color: #888">{{ t('demo.dialog.dragTitleHint2') }}</p>
  </y-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const visible = ref(false)
</script>
