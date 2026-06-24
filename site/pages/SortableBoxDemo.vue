<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.sortableBox.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.sortableBox.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <y-sortable-box
        v-model="basicItems"
        class="demo-sortable-list"
        item-key="id"
        handle-class="demo-sortable-handle"
        @change="basicLog = JSON.stringify($event)"
      >
        <template #item="{ element }">
          <div class="demo-sortable-item">
            <span class="demo-sortable-handle">::</span>
            <span>{{ getItemTitle(element) }}</span>
          </div>
        </template>
      </y-sortable-box>
      <div class="demo-sortable-log">{{ basicLog }}</div>
    </y-card>

    <y-card :title="$t('demo.sortableBox.dragClassTitle')" style="margin-top: 16px">
      <y-sortable-box
        v-model="dragClassItems"
        class="demo-sortable-list"
        item-key="id"
        drag-class="demo-sortable-dragging-item"
      >
        <template #item="{ element }">
          <div class="demo-sortable-item">
            <span>{{ getItemTitle(element) }}</span>
          </div>
        </template>
      </y-sortable-box>
    </y-card>

    <y-card :title="$t('demo.sortableBox.horizontalTitle')" style="margin-top: 16px">
      <y-sortable-box
        v-model="horizontalItems"
        class="demo-sortable-horizontal-list"
        item-key="id"
        direction="horizontal"
      >
        <template #item="{ element }">
          <div class="demo-sortable-horizontal-item">{{ getItemTitle(element) }}</div>
        </template>
      </y-sortable-box>
    </y-card>

    <y-card :title="$t('demo.sortableBox.nestedTitle')" style="margin-top: 16px">
      <y-sortable-box
        v-model="nestedColumns"
        class="demo-sortable-nested-columns"
        item-key="id"
        handle-class="demo-sortable-column-handle"
        direction="horizontal"
      >
        <template #item="{ element }">
          <section class="demo-sortable-column">
            <header class="demo-sortable-column-header">
              <span class="demo-sortable-column-handle">::</span>
              <span>{{ getNestedColumnTitle(element) }}</span>
            </header>
            <y-sortable-box
              :list="getNestedCards(element)"
              class="demo-sortable-nested-card-list"
              item-key="id"
              group="nested-cards"
            >
              <template #item="{ element: card }">
                <div class="demo-sortable-nested-card">{{ getNestedCardTitle(card) }}</div>
              </template>
            </y-sortable-box>
          </section>
        </template>
      </y-sortable-box>
    </y-card>

    <y-card :title="$t('demo.sortableBox.sourceTitle')" style="margin-top: 16px">
      <div class="demo-sortable-board">
        <div>
          <div class="demo-sortable-subtitle">{{ $t('demo.sortableBox.library') }}</div>
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
          <div class="demo-sortable-subtitle">{{ $t('demo.sortableBox.canvas') }}</div>
          <div style="height: 500px">
            <scroll-box>
              <y-sortable-box
                v-model="canvasItems"
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
      <div class="demo-sortable-preview">{{ previewText || $t('demo.sortableBox.noPreview') }}</div>
    </y-card>

    <y-card :title="$t('demo.sortableBox.guardTitle')" style="margin-top: 16px">
      <div class="demo-sortable-board">
        <y-sortable-box v-model="leftItems" class="demo-sortable-list" item-key="id" group="guard" :min-items="1">
          <template #header>
            <div class="demo-sortable-subtitle">{{ $t('demo.sortableBox.minOne') }}</div>
          </template>
          <template #item="{ element }">
            <div class="demo-sortable-item">{{ getItemTitle(element) }}</div>
          </template>
        </y-sortable-box>
        <y-sortable-box v-model="rightItems" class="demo-sortable-list" item-key="id" group="guard">
          <template #header>
            <div class="demo-sortable-subtitle">{{ $t('demo.sortableBox.freeList') }}</div>
          </template>
          <template #item="{ element }">
            <div class="demo-sortable-item">{{ getItemTitle(element) }}</div>
          </template>
        </y-sortable-box>
      </div>
    </y-card>

    <y-card :title="$t('demo.sortableBox.autoScrollTitle')" style="margin-top: 16px">
      <div style="height: 500px">
        <scroll-box>
          <y-sortable-box v-model="scrollItems" class="demo-sortable-list demo-sortable-scroll-list" item-key="id">
           <template #item="{ element }">
            <div class="demo-sortable-item">{{ getItemTitle(element) }}</div>
            </template>
          </y-sortable-box>
        </scroll-box>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, ScrollBox, type SortablePreviewChange } from 'yiz-ui'

interface DemoItem {
  id: string
  title: string
  type?: string
}

interface NestedCard {
  id: string
  title: string
}

interface NestedColumn {
  id: string
  title: string
  cards: NestedCard[]
}

const basicItems = ref<DemoItem[]>([
  { id: 'task-1', title: '需求评审' },
  { id: 'task-2', title: '视觉设计' },
  { id: 'task-3', title: '组件开发' },
  { id: 'task-4', title: '交互验收' }
])

const horizontalItems = ref<DemoItem[]>([
  { id: 'stage-1', title: 'Draft' },
  { id: 'stage-2', title: 'Review' },
  { id: 'stage-3', title: 'Build' },
  { id: 'stage-4', title: 'Release' }
])

const dragClassItems = ref<DemoItem[]>([
  { id: 'drag-class-1', title: '拖动时保留占位' },
  { id: 'drag-class-2', title: '自定义 drag-class' },
  { id: 'drag-class-3', title: '半透明源元素' }
])

const nestedColumns = ref<NestedColumn[]>([
  {
    id: 'todo',
    title: 'Todo',
    cards: [
      { id: 'todo-1', title: '梳理需求' },
      { id: 'todo-2', title: '确认边界' }
    ]
  },
  {
    id: 'doing',
    title: 'Doing',
    cards: [
      { id: 'doing-1', title: '实现拖动排序' },
      { id: 'doing-2', title: '补充示例' }
    ]
  },
  {
    id: 'done',
    title: 'Done',
    cards: [{ id: 'done-1', title: '基础能力验证' }]
  }
])

const libraryItems = ref<DemoItem[]>([
  { id: 'text', title: 'Text', type: 'basic' },
  { id: 'image', title: 'Image', type: 'media' },
  { id: 'button', title: 'Button', type: 'action' }
])

const canvasItems = ref<DemoItem[]>([{ id: 'canvas-initial', title: 'Hero Title', type: 'text' }])
const leftItems = ref<DemoItem[]>([
  { id: 'left-1', title: '固定保留项' },
  { id: 'left-2', title: '可移动项' }
])
const rightItems = ref<DemoItem[]>([{ id: 'right-1', title: '右侧项目' }])
const scrollItems = ref<DemoItem[]>(
  Array.from({ length: 18 }, (_, index) => ({
    id: `scroll-${index + 1}`,
    title: `Item ${index + 1}`
  }))
)
const basicLog = ref('')
const previewText = ref('')
let idSeed = 0

function getItemTitle(item: unknown) {
  return (item as DemoItem).title
}

function getItemType(item: unknown) {
  return (item as DemoItem).type
}

function getNestedColumnTitle(item: unknown) {
  return (item as NestedColumn).title
}

function getNestedCards(item: unknown) {
  return (item as NestedColumn).cards
}

function getNestedCardTitle(item: unknown) {
  return (item as NestedCard).title
}

function createCanvasItem(item: unknown) {
  const source = item as DemoItem
  idSeed += 1
  return {
    id: `${source.id}-${Date.now()}-${idSeed}`,
    title: `${source.title} ${idSeed}`,
    type: source.type
  }
}

function getPreviewText(event: SortablePreviewChange) {
  return `${$t('demo.sortableBox.preview')}: ${event.targetPreview.map((item) => getItemTitle(item)).join(' / ')}`
}
</script>

<style lang="less">
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

.demo-sortable-handle {
  color: #9ca3af;
  font-family: monospace;
  cursor: move;
}

.demo-sortable-board {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.demo-sortable-horizontal-list {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px;
  border: 1px dashed #d8dce6;
  border-radius: 6px;
  background: #fafbfc;
}

.demo-sortable-horizontal-item {
  min-width: 104px;
  padding: 10px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  color: #333;
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
}

.demo-sortable-nested-columns {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 8px;
  border: 1px dashed #d8dce6;
  border-radius: 6px;
  background: #fafbfc;
}

.demo-sortable-column {
  flex: 0 0 220px;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
}

.demo-sortable-column-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.demo-sortable-column-handle {
  color: #9ca3af;
  font-family: monospace;
  cursor: move;
}

.demo-sortable-nested-card-list {
  display: grid;
  align-content: start;
  gap: 8px;
  min-height: 46px;
}

.demo-sortable-nested-card {
  min-height: 36px;
  padding: 8px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f8fafc;
  color: #333;
  font-size: 13px;
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

.demo-sortable-dragging-item {
  visibility: visible !important;
  border-color: var(--yiz-color-primary);
  border-style: dashed;
  background: #eef6ff;
  color: var(--yiz-color-primary);
  opacity: 0.48;
}

@media (max-width: 720px) {
  .demo-sortable-board {
    grid-template-columns: 1fr;
  }
}
</style>
