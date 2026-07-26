<template>
  <div style="height: 500px">
    <scroll-box>
      <y-sortable-box v-model:list="scrollItems" class="demo-sortable-list demo-sortable-scroll-list" item-key="id">
        <template #item="{ element }">
          <div class="demo-sortable-item">{{ getItemTitle(element) }}</div>
        </template>
      </y-sortable-box>
    </scroll-box>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface DemoItem {
  id: string
  title: string
  type?: string
}

const scrollItems = ref<DemoItem[]>(
  Array.from({ length: 18 }, (_, index) => ({
    id: `scroll-${index + 1}`,
    title: `Item ${index + 1}`,
  })),
)

function getItemTitle(item: unknown) {
  return (item as DemoItem).title
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
</style>
