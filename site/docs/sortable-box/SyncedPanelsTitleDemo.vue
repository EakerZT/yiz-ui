<template>
  <div class="demo-sortable-sync-board">
    <div>
      <div class="demo-sortable-subtitle">{{ $t('demo.sortableBox.canvasView') }}</div>
      <y-sortable-box
        :list="syncDisplayItems"
        class="demo-sortable-sync-canvas"
        item-key="id"
        :animation="180"
        @update:list="updateSyncItems"
        @preview-change="syncCanvasPreview"
        @preview-cancel="clearSyncPreview"
        @preview-commit="clearSyncPreview"
      >
        <template #item="{ element }">
          <div
            class="demo-sortable-sync-node"
            :class="{ 'demo-sortable-sync-related': isSyncHighlighted(element, 'canvas') }"
          >
            <strong>{{ getItemTitle(element) }}</strong>
            <span>{{ getItemType(element) }}</span>
          </div>
        </template>
      </y-sortable-box>
    </div>
    <div>
      <div class="demo-sortable-subtitle">{{ $t('demo.sortableBox.layersView') }}</div>
      <y-sortable-box
        :list="syncDisplayItems"
        class="demo-sortable-list"
        item-key="id"
        :animation="180"
        @update:list="updateSyncItems"
        @preview-change="syncLayersPreview"
        @preview-cancel="clearSyncPreview"
        @preview-commit="clearSyncPreview"
      >
        <template #item="{ element }">
          <div
            class="demo-sortable-layer-item"
            :class="{ 'demo-sortable-sync-related': isSyncHighlighted(element, 'layers') }"
          >
            <span>{{ getItemTitle(element) }}</span>
            <small>{{ getItemType(element) }}</small>
          </div>
        </template>
      </y-sortable-box>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t, type SortablePreviewChange } from 'yiz-ui'

interface DemoItem {
  id: string
  titleKey: string
  type?: string
}

const syncItems = ref<DemoItem[]>([
  { id: 'sync-title', titleKey: 'demo.sortableBox.itemTitle', type: 'Text' },
  { id: 'sync-image', titleKey: 'demo.sortableBox.itemImage', type: 'Image' },
  { id: 'sync-button', titleKey: 'demo.sortableBox.itemButton', type: 'Button' },
  { id: 'sync-form', titleKey: 'demo.sortableBox.itemForm', type: 'Form' },
])

const syncPreviewItems = ref<DemoItem[] | null>(null)

const syncDraggingKey = ref('')

const syncDraggingSource = ref<'canvas' | 'layers' | ''>('')

const syncDisplayItems = computed(() => syncPreviewItems.value ?? syncItems.value)

function getItemTitle(item: unknown) {
  return $t((item as DemoItem).titleKey)
}

function getItemType(item: unknown) {
  return (item as DemoItem).type
}

function getItemId(item: unknown) {
  return (item as DemoItem).id
}

function updateSyncItems(items: unknown[]) {
  syncItems.value = items as DemoItem[]
}

function syncCanvasPreview(event: SortablePreviewChange<DemoItem>) {
  syncPanelPreview(event, 'canvas')
}

function syncLayersPreview(event: SortablePreviewChange<DemoItem>) {
  syncPanelPreview(event, 'layers')
}

function syncPanelPreview(event: SortablePreviewChange<DemoItem>, source: 'canvas' | 'layers') {
  syncPreviewItems.value = [...event.sourcePreview]
  syncDraggingKey.value = getItemId(event.dragging)
  syncDraggingSource.value = source
}

function isSyncHighlighted(item: unknown, panel: 'canvas' | 'layers') {
  return !!syncDraggingKey.value && syncDraggingSource.value !== panel && getItemId(item) === syncDraggingKey.value
}

function clearSyncPreview() {
  syncPreviewItems.value = null
  syncDraggingKey.value = ''
  syncDraggingSource.value = ''
}
</script>

<style>
.demo-sortable-list {
  display: grid;
  align-content: start;
  gap: 8px;
  min-height: 48px;
  padding: 8px;
  border: 1px dashed #d8dce6;
  border-radius: 6px;
  background: #fafbfc;
}
.demo-sortable-sync-board {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.75fr);
  gap: 16px;
}
.demo-sortable-sync-canvas {
  display: grid;
  align-content: start;
  gap: 10px;
  min-height: 260px;
  padding: 12px;
  border: 1px dashed #d8dce6;
  border-radius: 6px;
  background: #f7f9fc;
}
.demo-sortable-sync-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  padding: 10px 12px;
  border: 1px solid #dce3ee;
  border-radius: 6px;
  background: #fff;
  color: #333;
  font-size: 14px;
}
.demo-sortable-sync-node span,
.demo-sortable-layer-item small {
  color: #999;
  font-size: 12px;
}
.demo-sortable-layer-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  color: #333;
  font-size: 13px;
}
.demo-sortable-sync-related {
  border-color: var(--yiz-color-primary);
  background: #eef6ff;
  box-shadow: 0 0 0 2px rgba(65, 145, 255, 0.16);
  color: var(--yiz-color-primary);
}
.demo-sortable-subtitle {
  margin-bottom: 8px;
  color: #666;
  font-size: 13px;
}
@media (max-width: 720px) {
  .demo-sortable-board,
  .demo-sortable-sync-board {
    grid-template-columns: 1fr;
  }
}
</style>
