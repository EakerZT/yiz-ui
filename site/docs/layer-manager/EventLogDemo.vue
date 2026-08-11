<template>
  <y-button type="primary" @click="openDialog">{{ t('demo.layerManager.openDialog') }}</y-button>

  <y-dialog v-model:show="showDialog" :title="t('demo.layerManager.dialogTitle')" @after-leave="deactivateLayer">
    <p>{{ t('demo.layerManager.dialogContent') }}</p>
  </y-dialog>

  <ul v-if="logs.length" class="layer-event-list">
    <li v-for="(item, index) in logs" :key="index">{{ item }}</li>
  </ul>
  <p v-else class="layer-empty-log">{{ t('demo.layerManager.noEvent') }}</p>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'
import { useLocale, useModalLayer } from 'yiz-ui'

const t = useLocale()

interface LayerLog {
  type: 'activate' | 'deactivate'
  index: number
  count: number
}

const layer = useModalLayer()
const showDialog = ref(false)
const logEvents = ref<LayerLog[]>([])
const logs = computed(() =>
  logEvents.value.map((event) =>
    t(event.type === 'activate' ? 'demo.layerManager.logActivate' : 'demo.layerManager.logDeactivate', {
      index: event.index,
      count: event.count,
    }),
  ),
)

layer.onActivate(() => {
  pushLog('activate')
})

layer.onDeactivate(() => {
  pushLog('deactivate')
})

async function openDialog() {
  layer.active()
  await nextTick()
  showDialog.value = true
}

function deactivateLayer() {
  layer.inactive()
}

function pushLog(type: LayerLog['type']) {
  const event = { type, index: layer.index.value, count: layer.count.value }
  logEvents.value = [event, ...logEvents.value].slice(0, 6)
}
</script>

<style scoped>
.layer-empty-log {
  margin-top: 10px;
  color: #888;
  font-size: 13px;
  line-height: 1.6;
}

.layer-event-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  padding-left: 18px;
  color: #666;
  font-size: 13px;
  line-height: 1.6;
}
</style>
