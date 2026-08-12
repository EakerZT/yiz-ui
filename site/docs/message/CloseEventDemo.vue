<template>
  <y-button @click="openCloseEvent">{{ t('demo.common.open') }}</y-button
  ><span class="demo-hint">{{ t('demo.message.closeCount', { count: closeCount }) }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale, useMessage } from 'yiz-ui'

const t = useLocale()
const message = useMessage()

const closeCount = ref(0)

function openCloseEvent() {
  message.info(t('demo.message.closeEventHint'), 1500, () => {
    closeCount.value++
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
