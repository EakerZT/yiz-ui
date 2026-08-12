<template>
  <y-button-group wrap gap="8">
    <y-button type="primary" @click="runRootAction">{{ t('demo.layerManager.runRootAction') }}</y-button>
    <y-button @click="openDialog">{{ t('demo.layerManager.openDialog') }}</y-button>
    <y-button @click="openDrawer">{{ t('demo.layerManager.openDrawer') }}</y-button>
    <y-button @click="openNoMaskDrawer">{{ t('demo.layerManager.openNoMaskDrawer') }}</y-button>
    <y-button @click="openConfirm">{{ t('demo.layerManager.openConfirm') }}</y-button>
  </y-button-group>
  <p class="layer-action-hint">{{ t('demo.layerManager.actionHint') }}</p>
  <p class="layer-panel-status">{{ t('demo.layerManager.shortcutCount') }}: {{ shortcutCount }}</p>

  <y-dialog v-model:show="showDialog" :title="t('demo.layerManager.dialogTitle')">
    <p>{{ t('demo.layerManager.dialogContent') }}</p>
    <p class="layer-panel-status">
      {{ t('demo.layerManager.rootStatus', { index: layer.index.value, count: layer.count.value }) }}
    </p>
  </y-dialog>

  <y-drawer v-model:show="showDrawer" :title="t('demo.layerManager.drawerTitle')" width="420px">
    <p>{{ t('demo.layerManager.drawerContent') }}</p>
    <p class="layer-panel-status">
      {{ t('demo.layerManager.rootStatus', { index: layer.index.value, count: layer.count.value }) }}
    </p>
    <div style="margin-top: 16px">
      <y-button type="primary" @click="showNestedDialog = true">
        {{ t('demo.layerManager.openNestedDialog') }}
      </y-button>
    </div>
    <y-dialog v-model:show="showNestedDialog" :title="t('demo.layerManager.nestedDialogTitle')" width="360px">
      <p>{{ t('demo.layerManager.nestedDialogContent') }}</p>
    </y-dialog>
  </y-drawer>

  <y-drawer
    v-model:show="showNoMaskDrawer"
    :title="t('demo.layerManager.noMaskDrawerTitle')"
    :mask="false"
    width="380px"
  >
    <p>{{ t('demo.layerManager.noMaskDrawerContent') }}</p>
  </y-drawer>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue'
import { useLocale, useDialog, useMessage, useModalLayer } from 'yiz-ui'

const t = useLocale()
const message = useMessage()

const layer = useModalLayer()
const dialog = useDialog()
const showDialog = ref(false)
const showDrawer = ref(false)
const showNoMaskDrawer = ref(false)
const showNestedDialog = ref(false)
const confirmOpen = ref(false)
const shortcutCount = ref(0)

watch([showDialog, showDrawer, showNoMaskDrawer], async ([dialogVisible, drawerVisible, noMaskDrawerVisible]) => {
  if (!drawerVisible) showNestedDialog.value = false
  if (dialogVisible || drawerVisible || noMaskDrawerVisible) return
  await nextTick()
  releaseRootLayer()
})

function runRootAction() {
  layer.active()
  if (!layer.isTopLayer.value) {
    message.warning(t('demo.layerManager.shortcutBlocked'))
    return
  }

  shortcutCount.value += 1
  message.success(t('demo.layerManager.shortcutRan', { count: shortcutCount.value }))
  releaseRootLayer()
}

function openDialog() {
  layer.active()
  showDialog.value = true
}

function openDrawer() {
  layer.active()
  showDrawer.value = true
}

function openNoMaskDrawer() {
  layer.active()
  showNoMaskDrawer.value = true
}

function openConfirm() {
  layer.active()
  confirmOpen.value = true
  dialog.confirm({
    title: t('demo.layerManager.confirmTitle'),
    content: t('demo.layerManager.confirmContent'),
    onOk: () => {
      message.success(t('demo.layerManager.confirmOk'))
      finishConfirm()
    },
    onCancel: finishConfirm,
  })
}

function finishConfirm() {
  confirmOpen.value = false
  void nextTick().then(releaseRootLayer)
}

function releaseRootLayer() {
  if (showDialog.value || showDrawer.value || showNoMaskDrawer.value || confirmOpen.value) return
  layer.inactive()
}
</script>

<style scoped>
.layer-action-hint,
.layer-panel-status {
  margin-top: 10px;
  color: #888;
  font-size: 13px;
  line-height: 1.6;
}
</style>
