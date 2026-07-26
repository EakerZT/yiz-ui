<template>
  <y-sortable-box
    v-model:list="dragClassItems"
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

interface DemoItem {
  id: string
  titleKey: string
  type?: string
}

const dragClassItems = ref<DemoItem[]>([
  { id: 'drag-class-1', titleKey: 'demo.sortableBox.itemKeepPlaceholder' },
  { id: 'drag-class-2', titleKey: 'demo.sortableBox.itemCustomDragClass' },
  { id: 'drag-class-3', titleKey: 'demo.sortableBox.itemTranslucentSource' },
])

function getItemTitle(item: unknown) {
  return $t((item as DemoItem).titleKey)
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
</style>
