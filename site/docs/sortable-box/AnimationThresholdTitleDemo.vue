<template>
  <div class="demo-sortable-board">
    <y-sortable-box
      v-model:list="thresholdLeftItems"
      class="demo-sortable-list"
      item-key="id"
      group="threshold"
      :animation="220"
      easing="cubic-bezier(0.2, 0, 0, 1)"
      :swap-threshold="0.65"
      :empty-insert-threshold="24"
    >
      <template #item="{ element }">
        <div class="demo-sortable-item">{{ getItemTitle(element) }}</div>
      </template>
    </y-sortable-box>
    <y-sortable-box
      v-model:list="thresholdRightItems"
      class="demo-sortable-list"
      item-key="id"
      group="threshold"
      :animation="220"
      easing="cubic-bezier(0.2, 0, 0, 1)"
      :swap-threshold="0.65"
      :empty-insert-threshold="24"
    >
      <template #header>
        <div class="demo-sortable-subtitle">{{ t('demo.sortableBox.emptyTarget') }}</div>
      </template>
      <template #item="{ element }">
        <div class="demo-sortable-item">{{ getItemTitle(element) }}</div>
      </template>
    </y-sortable-box>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

interface DemoItem {
  id: string
  titleKey: string
  type?: string
}

const thresholdLeftItems = ref<DemoItem[]>([
  { id: 'threshold-1', titleKey: 'demo.sortableBox.itemAnimatedSorting' },
  { id: 'threshold-2', titleKey: 'demo.sortableBox.itemThresholdDetection' },
  { id: 'threshold-3', titleKey: 'demo.sortableBox.itemNearEmptyList' },
])

const thresholdRightItems = ref<DemoItem[]>([])

function getItemTitle(item: unknown) {
  return t((item as DemoItem).titleKey)
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
