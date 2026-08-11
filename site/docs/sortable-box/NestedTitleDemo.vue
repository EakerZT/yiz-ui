<template>
  <y-sortable-box
    v-model:list="nestedColumns"
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
          @update:list="(items) => updateNestedCards(element, items)"
        >
          <template #item="{ element: card }">
            <div class="demo-sortable-nested-card">{{ getNestedCardTitle(card) }}</div>
          </template>
        </y-sortable-box>
      </section>
    </template>
  </y-sortable-box>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

interface NestedCard {
  id: string
  titleKey: string
}

interface NestedColumn {
  id: string
  title: string
  cards: NestedCard[]
}

const nestedColumns = ref<NestedColumn[]>([
  {
    id: 'todo',
    title: 'Todo',
    cards: [
      { id: 'todo-1', titleKey: 'demo.sortableBox.itemRefineRequirements' },
      { id: 'todo-2', titleKey: 'demo.sortableBox.itemConfirmScope' },
    ],
  },
  {
    id: 'doing',
    title: 'Doing',
    cards: [
      { id: 'doing-1', titleKey: 'demo.sortableBox.itemImplementSorting' },
      { id: 'doing-2', titleKey: 'demo.sortableBox.itemAddExamples' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [{ id: 'done-1', titleKey: 'demo.sortableBox.itemVerifyCoreBehavior' }],
  },
])

function getNestedColumnTitle(item: unknown) {
  return (item as NestedColumn).title
}

function getNestedCards(item: unknown) {
  return (item as NestedColumn).cards
}

function getNestedCardTitle(item: unknown) {
  return t((item as NestedCard).titleKey)
}

function updateNestedCards(column: unknown, cards: unknown[]) {
  const target = column as NestedColumn
  target.cards = cards as NestedCard[]
}
</script>

<style>
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
</style>
