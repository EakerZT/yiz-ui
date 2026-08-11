<template>
  <y-button @click="visible = true">{{ t('demo.common.open') }}</y-button>
  <span v-if="closeCount > 0 || okCount > 0" class="demo-hint">
    {{ t('demo.dialog.footerEventCount', { close: closeCount, ok: okCount }) }}
  </span>

  <y-dialog v-model:show="visible" :title="t('demo.dialog.closeEvent')" @close="closeCount++" @ok="okCount++">
    <p>{{ t('demo.dialog.closeEventHint') }}</p>
  </y-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const visible = ref(false)
const closeCount = ref(0)
const okCount = ref(0)
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  color: #999;
  font-size: 12px;
}
</style>
