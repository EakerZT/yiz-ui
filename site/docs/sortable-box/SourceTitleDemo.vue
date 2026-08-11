<template>
  <div class="demo-sortable-board">
    <div>
      <div class="demo-sortable-subtitle">{{ t('demo.sortableBox.library') }}</div>
      <y-sortable-box
        :list="libraryItems"
        class="demo-sortable-list"
        item-key="id"
        mode="source"
        group="builder"
        :create-item="createCanvasItem"
      >
        <template #item="{ element }">
          <div class="demo-sortable-palette">{{ getItemTitle(element) }}</div>
        </template>
      </y-sortable-box>
    </div>
    <div>
      <div class="demo-sortable-subtitle">{{ t('demo.sortableBox.canvas') }}</div>
      <div style="height: 500px">
        <scroll-box>
          <y-sortable-box
            v-model:list="canvasItems"
            class="demo-sortable-list demo-sortable-canvas"
            item-key="id"
            group="builder"
            :min-items="1"
            @preview-change="previewText = getPreviewText($event)"
            @preview-cancel="previewText = ''"
            @preview-commit="previewText = ''"
          >
            <template #item="{ element }">
              <div class="demo-sortable-item">
                <span>{{ getItemTitle(element) }}</span>
                <small>{{ getItemType(element) }}</small>
              </div>
            </template>
          </y-sortable-box>
        </scroll-box>
      </div>
    </div>
  </div>
  <div class="demo-sortable-preview">{{ previewText || t('demo.sortableBox.noPreview') }}</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale, type SortablePreviewChange } from 'yiz-ui'

const t = useLocale()

interface DemoItem {
  id: string
  title: string
  type?: string
}

const libraryItems = ref<DemoItem[]>([
  { id: 'text', title: 'Text', type: 'basic' },
  { id: 'image', title: 'Image', type: 'media' },
  { id: 'button', title: 'Button', type: 'action' },
])

const canvasItems = ref<DemoItem[]>([{ id: 'canvas-initial', title: 'Hero Title', type: 'text' }])

const previewText = ref('')

let idSeed = 0

function getItemTitle(item: unknown) {
  return (item as DemoItem).title
}

function getItemType(item: unknown) {
  return (item as DemoItem).type
}

function createCanvasItem(item: unknown) {
  const source = item as DemoItem
  idSeed += 1
  return {
    id: `${source.id}-${Date.now()}-${idSeed}`,
    title: `${source.title} ${idSeed}`,
    type: source.type,
  }
}

function getPreviewText(event: SortablePreviewChange) {
  return `${t('demo.sortableBox.preview')}: ${event.targetPreview.map((item) => getItemTitle(item)).join(' / ')}`
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
.demo-sortable-item,
.demo-sortable-palette {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 38px;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  color: #333;
  font-size: 14px;
}
.demo-sortable-palette {
  justify-content: flex-start;
  color: var(--yiz-color-primary);
  font-weight: 500;
}
.demo-sortable-board {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.demo-sortable-subtitle {
  margin-bottom: 8px;
  color: #666;
  font-size: 13px;
}
.demo-sortable-canvas {
  min-height: 172px;
}
.demo-sortable-log,
.demo-sortable-preview {
  margin-top: 12px;
  color: #666;
  font-size: 13px;
}
.demo-sortable-item small {
  color: #999;
}
@media (max-width: 720px) {
  .demo-sortable-board,
  .demo-sortable-sync-board {
    grid-template-columns: 1fr;
  }
}
</style>
