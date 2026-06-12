<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Tree</h2>
    <p class="demo-section-desc">Hierarchical data display with expand, select and check states.</p>

    <y-card title="Basic">
      <y-tree :data="treeData" default-expand-all />
    </y-card>

    <y-card title="Selectable" style="margin-top: 8px">
      <y-tree v-model:selected="selectedKey" :data="treeData" default-expand-all @select="onSelect" />
      <p class="demo-tree-info">Selected: {{ selectedKey ?? 'none' }}</p>
      <p class="demo-tree-info">Last selected: {{ lastSelected }}</p>
    </y-card>

    <y-card title="Checkable" style="margin-top: 8px">
      <y-tree v-model:checked="checkedKeys" :data="treeData" checkable default-expand-all @check="onCheck" />
      <p class="demo-tree-info">Checked: {{ checkedKeys.join(', ') || 'none' }}</p>
      <p class="demo-tree-info">Last check: {{ lastCheck }}</p>
    </y-card>

    <y-card title="Controlled expanded keys" style="margin-top: 8px">
      <y-button-group style="margin-bottom: 12px">
        <y-button @click="expandedKeys = ['components', 'data-entry']">Expand data entry</y-button>
        <y-button @click="expandedKeys = []">Collapse all</y-button>
      </y-button-group>
      <y-tree v-model:expanded="expandedKeys" :data="treeData" />
    </y-card>

    <y-card title="Disabled node" style="margin-top: 8px">
      <y-tree :data="disabledData" checkable default-expand-all />
    </y-card>

    <y-card title="Empty" style="margin-top: 8px">
      <y-tree :data="[]" />
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TreeKey, TreeNodeData } from 'yiz-ui'

const treeData: TreeNodeData[] = [
  {
    label: 'Components',
    key: 'components',
    children: [
      {
        label: 'Data Entry',
        key: 'data-entry',
        children: [
          { label: 'Input', key: 'input' },
          { label: 'Select', key: 'select' },
          { label: 'DatePicker', key: 'date-picker' }
        ]
      },
      {
        label: 'Data Display',
        key: 'data-display',
        children: [
          { label: 'Table', key: 'table' },
          { label: 'Tree', key: 'tree' },
          { label: 'Tag', key: 'tag' }
        ]
      }
    ]
  },
  {
    label: 'Navigation',
    key: 'navigation',
    children: [
      { label: 'Menu', key: 'menu' },
      { label: 'Pagination', key: 'pagination' }
    ]
  }
]

const disabledData: TreeNodeData[] = [
  {
    label: 'Root',
    key: 'root',
    children: [
      { label: 'Available item', key: 'available' },
      { label: 'Disabled item', key: 'disabled', disabled: true },
      {
        label: 'Disabled group',
        key: 'disabled-group',
        disabled: true,
        children: [{ label: 'Child item', key: 'disabled-child' }]
      }
    ]
  }
]

const selectedKey = ref<TreeKey | null>(null)
const checkedKeys = ref<TreeKey[]>(['input'])
const expandedKeys = ref<TreeKey[]>(['components'])
const lastSelected = ref('none')
const lastCheck = ref('none')

function onSelect(node: TreeNodeData, key: TreeKey) {
  lastSelected.value = `${node.label} (${key})`
}

function onCheck(keys: TreeKey[], node: TreeNodeData, checked: boolean) {
  lastCheck.value = `${checked ? 'checked' : 'unchecked'} ${node.label}; total ${keys.length}`
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
