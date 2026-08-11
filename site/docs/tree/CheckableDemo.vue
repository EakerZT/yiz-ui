<template>
  <y-tree v-model:checked="checkedKeys" :data="treeData" checkable default-expand-all @check="onCheck" />
  <p class="demo-tree-info">
    {{ t('demo.tree.checked', { value: checkedKeys.join(', ') || t('demo.common.none') }) }}
  </p>
  <p class="demo-tree-info">{{ t('demo.tree.lastCheck', { value: lastCheck }) }}</p>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale, type TreeKey, type TreeNodeData } from 'yiz-ui'

const t = useLocale()

interface LastCheckState {
  key: TreeKey
  checked: boolean
  total: number
}

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

const checkedKeys = ref<TreeKey[]>(['input'])
const lastCheckState = ref<LastCheckState | null>(null)
const lastCheck = computed(() => {
  const state = lastCheckState.value
  if (!state) return t('demo.common.none')
  const label = findTreeNodeLabel(treeData.value, state.key) ?? String(state.key)
  return t(state.checked ? 'demo.tree.checkEvent' : 'demo.tree.uncheckEvent', {
    label,
    total: state.total,
  })
})

function onCheck(keys: TreeKey[], node: TreeNodeData, checked: boolean) {
  lastCheckState.value = {
    key: node.key,
    checked,
    total: keys.length,
  }
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
