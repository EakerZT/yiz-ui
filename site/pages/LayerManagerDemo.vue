<template>
  <section class="demo-section layer-manager-demo">
    <h2 class="demo-section-title">{{ $t('demo.layerManager.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.layerManager.desc') }}</p>

    <y-card :title="$t('demo.layerManager.status')" style="margin-top: 8px">
      <div class="layer-status-grid">
        <div class="layer-status-item">
          <span>{{ $t('demo.layerManager.isTopLayer') }}</span>
          <strong :class="{ inactive: !layer.isTopLayer }">
            {{ layer.isTopLayer ? $t('demo.layerManager.top') : $t('demo.layerManager.notTop') }}
          </strong>
        </div>
        <div class="layer-status-item">
          <span>{{ $t('demo.layerManager.count') }}</span>
          <strong>{{ layer.count }}</strong>
        </div>
        <div class="layer-status-item">
          <span>{{ $t('demo.layerManager.index') }}</span>
          <strong>{{ layer.index }}</strong>
        </div>
        <div class="layer-status-item">
          <span>{{ $t('demo.layerManager.shortcutCount') }}</span>
          <strong>{{ shortcutCount }}</strong>
        </div>
      </div>
    </y-card>

    <y-card :title="$t('demo.layerManager.actions')" style="margin-top: 8px">
      <div class="demo-row">
        <div class="demo-items">
          <y-button type="primary" @click="runRootAction">{{ $t('demo.layerManager.runRootAction') }}</y-button>
          <y-button @click="showDialog = true">{{ $t('demo.layerManager.openDialog') }}</y-button>
          <y-button @click="showDrawer = true">{{ $t('demo.layerManager.openDrawer') }}</y-button>
          <y-button @click="showNoMaskDrawer = true">{{ $t('demo.layerManager.openNoMaskDrawer') }}</y-button>
          <y-button @click="openConfirm">{{ $t('demo.layerManager.openConfirm') }}</y-button>
        </div>
      </div>
      <p class="layer-action-hint">{{ $t('demo.layerManager.actionHint') }}</p>
    </y-card>

    <y-card :title="$t('demo.layerManager.eventLog')" style="margin-top: 8px">
      <ul v-if="logs.length" class="layer-event-list">
        <li v-for="(item, index) in logs" :key="index">{{ item }}</li>
      </ul>
      <p v-else class="layer-empty-log">{{ $t('demo.layerManager.noEvent') }}</p>
    </y-card>

    <y-dialog v-model:show="showDialog" :title="$t('demo.layerManager.dialogTitle')">
      <p>{{ $t('demo.layerManager.dialogContent') }}</p>
      <p class="layer-panel-status">
        {{ $t('demo.layerManager.rootStatus', { index: layer.index.value, count: layer.count.value }) }}
      </p>
    </y-dialog>

    <y-drawer v-model:show="showDrawer" :title="$t('demo.layerManager.drawerTitle')" width="420px">
      <p>{{ $t('demo.layerManager.drawerContent') }}</p>
      <p class="layer-panel-status">
        {{ $t('demo.layerManager.rootStatus', { index: layer.index.value, count: layer.count.value }) }}
      </p>
      <div style="margin-top: 16px">
        <y-button type="primary" @click="showNestedDialog = true">
          {{ $t('demo.layerManager.openNestedDialog') }}
        </y-button>
      </div>
      <y-dialog v-model:show="showNestedDialog" :title="$t('demo.layerManager.nestedDialogTitle')" width="360px">
        <p>{{ $t('demo.layerManager.nestedDialogContent') }}</p>
      </y-dialog>
    </y-drawer>

    <y-drawer
      v-model:show="showNoMaskDrawer"
      :title="$t('demo.layerManager.noMaskDrawerTitle')"
      :mask="false"
      width="380px"
    >
      <p>{{ $t('demo.layerManager.noMaskDrawerContent') }}</p>
    </y-drawer>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, message, useDialog, useModalLayer } from 'yiz-ui'

const layer = useModalLayer()
const dialog = useDialog()

layer.active()

const showDialog = ref(false)
const showDrawer = ref(false)
const showNoMaskDrawer = ref(false)
const showNestedDialog = ref(false)
const shortcutCount = ref(0)
const logs = ref<string[]>([])

layer.onActivate(() => {
  pushLog($t('demo.layerManager.logActivate', { index: layer.index.value, count: layer.count.value }))
})

layer.onDeactivate(() => {
  pushLog($t('demo.layerManager.logDeactivate', { index: layer.index.value, count: layer.count.value }))
})

function pushLog(text: string) {
  logs.value = [text, ...logs.value].slice(0, 6)
}

function runRootAction() {
  if (!layer.isTopLayer.value) {
    message.warning($t('demo.layerManager.shortcutBlocked'))
    return
  }

  shortcutCount.value += 1
  message.success($t('demo.layerManager.shortcutRan', { count: shortcutCount.value }))
}

function openConfirm() {
  dialog.confirm({
    title: $t('demo.layerManager.confirmTitle'),
    content: $t('demo.layerManager.confirmContent'),
    onOk: () => {
      message.success($t('demo.layerManager.confirmOk'))
    },
  })
}
</script>

<style scoped>
.layer-status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.layer-status-item {
  min-height: 72px;
  padding: 12px;
  border: 1px solid #e6e8eb;
  border-radius: 6px;
  background: #f8fafc;
}

.layer-status-item span {
  display: block;
  color: #888;
  font-size: 13px;
  line-height: 20px;
}

.layer-status-item strong {
  display: block;
  margin-top: 6px;
  color: var(--yiz-color-primary);
  font-size: 20px;
  line-height: 28px;
}

.layer-status-item strong.inactive {
  color: var(--yiz-color-warning);
}

.layer-action-hint,
.layer-panel-status,
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
  padding-left: 18px;
  color: #666;
  font-size: 13px;
  line-height: 1.6;
}
</style>
