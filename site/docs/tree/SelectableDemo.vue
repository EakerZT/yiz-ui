<template>
  <y-tree v-model:selected="selectedKey" :data="treeData" default-expand-all @select="onSelect" />
  <p class="demo-tree-info">{{ t('demo.tree.selected', { value: selectedKey ?? t('demo.common.none') }) }}</p>
  <p class="demo-tree-info">{{ t('demo.tree.lastSelected', { value: lastSelected }) }}</p>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale, type TreeKey, type TreeNodeData } from 'yiz-ui'

const t = useLocale()

const treeData = computed<TreeNodeData[]>(() => [
  {
    label: t('demo.tree.components'),
    key: 'components',
    children: [
      {
        label: t('demo.tree.dataEntry'),
        key: 'data-entry',
        children: [
          { label: t('demo.tree.inputBox'), key: 'input' },
          { label: t('demo.tree.dropdown'), key: 'select' },
          { label: t('demo.tree.dateSelector'), key: 'date-picker' },
        ],
      },
      {
        label: t('demo.tree.dataDisplay'),
        key: 'data-display',
        children: [
          { label: t('demo.tree.table'), key: 'table' },
          { label: t('demo.tree.tree'), key: 'tree' },
          { label: t('demo.tree.tag'), key: 'tag' },
        ],
      },
    ],
  },
  {
    label: t('demo.tree.navigation'),
    key: 'navigation',
    children: [
      { label: t('demo.tree.menu'), key: 'menu' },
      { label: t('demo.tree.pagination'), key: 'pagination' },
    ],
  },
])

const selectedKey = ref<TreeKey | null>(null)
const lastSelectedKey = ref<TreeKey | null>(null)
const lastSelected = computed(() => {
  const key = lastSelectedKey.value
  if (key === null) return t('demo.common.none')
  return `${findTreeNodeLabel(treeData.value, key) ?? String(key)} (${key})`
})

function onSelect(_node: TreeNodeData, key: TreeKey) {
  lastSelectedKey.value = key
}

function findTreeNodeLabel(nodes: TreeNodeData[], key: TreeKey): string | undefined {
  for (const node of nodes) {
    if (node.key === key) return node.label
    const childLabel = node.children ? findTreeNodeLabel(node.children, key) : undefined
    if (childLabel) return childLabel
  }
  return undefined
}
</script>

<style scoped>
.demo-tree-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}

.demo-tree-info + .demo-tree-info {
  margin-top: 4px;
}
</style>
