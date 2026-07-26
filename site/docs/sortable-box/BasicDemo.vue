<template>
  <y-sortable-box
    v-model:list="basicItems"
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
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

interface DemoItem {
  id: string
  titleKey: string
  type?: string
}

const basicItems = ref<DemoItem[]>([
  { id: 'task-1', titleKey: 'demo.sortableBox.itemRequirementReview' },
  { id: 'task-2', titleKey: 'demo.sortableBox.itemVisualDesign' },
  { id: 'task-3', titleKey: 'demo.sortableBox.itemComponentDevelopment' },
  { id: 'task-4', titleKey: 'demo.sortableBox.itemInteractionAcceptance' },
])

const basicLog = ref('')

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
.demo-sortable-handle {
  color: #9ca3af;
  font-family: monospace;
  cursor: move;
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
</style>
