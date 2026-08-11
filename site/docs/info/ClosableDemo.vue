<template>
  <div class="demo-info-list">
    <y-info closable :message="t('demo.info.closableMessage')" @close="onClose" />
    <y-info closable :close-text="t('demo.common.close')" :message="t('demo.info.closeTextMessage')" />
    <p class="demo-info-event">{{ t('demo.info.closeCount', { count: closeCount }) }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const closeCount = ref(0)

function onClose() {
  closeCount.value += 1
}
</script>

<style scoped>
.demo-info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-info-event {
  margin: 0;
  color: #666;
  font-size: 13px;
}
</style>
