<template>
  <y-sortable-box
    v-model:list="horizontalItems"
    class="demo-sortable-horizontal-list"
    item-key="id"
    direction="horizontal"
  >
    <template #item="{ element }">
      <div class="demo-sortable-horizontal-item">{{ getItemTitle(element) }}</div>
    </template>
  </y-sortable-box>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface DemoItem {
  id: string
  title: string
  type?: string
}

const horizontalItems = ref<DemoItem[]>([
  { id: 'stage-1', title: 'Draft' },
  { id: 'stage-2', title: 'Review' },
  { id: 'stage-3', title: 'Build' },
  { id: 'stage-4', title: 'Release' },
])

function getItemTitle(item: unknown) {
  return (item as DemoItem).title
}
</script>

<style>
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
</style>
