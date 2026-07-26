<template>
  <y-button @click="openCloseEvent">{{ $t('demo.common.open') }}</y-button
  ><span class="demo-hint">{{ $t('demo.notification.closeCount', { count: closeCount }) }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, notification } from 'yiz-ui'

const closeCount = ref(0)

function openCloseEvent() {
  notification({
    title: $t('demo.dialog.closeEvent'),
    content: $t('demo.notification.closeEventHint'),
    onClose: () => {
      closeCount.value++
    },
  })
}
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
