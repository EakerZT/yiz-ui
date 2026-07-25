<template>
  <Button @click="visible = true">{{ $t('demo.dialog.draggable') }}</Button>
  <Dialog v-model:show="visible" :title="$t('demo.dialog.dragTitle')" drag>
    <p>{{ $t('demo.dialog.dragTitleHint') }}</p>
    <p style="margin-top: 8px; color: #888">{{ $t('demo.dialog.dragTitleHint2') }}</p>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, Button, Dialog } from 'yiz-ui'

const visible = ref(false)
</script>
