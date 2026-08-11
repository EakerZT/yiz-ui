<template>
  <y-button @click="visible10 = true">{{ t('demo.common.open') }}</y-button
  ><span v-if="closeCount > 0 || okCount > 0" class="demo-hint">
    {{ t('demo.drawer.footerEventCount', { close: closeCount, ok: okCount }) }}
  </span>

  <y-drawer v-model:show="visible10" :title="t('demo.dialog.closeEvent')" @close="closeCount++" @ok="okCount++">
    <p>{{ t('demo.dialog.closeEventHint') }}</p>
  </y-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const visible10 = ref(false)

const closeCount = ref(0)

const okCount = ref(0)
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
