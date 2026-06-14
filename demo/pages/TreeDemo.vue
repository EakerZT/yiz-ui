<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.tree') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.tree.desc') }}</p>

    <y-card :title="$t('demo.common.basic')">
      <y-tree :data="treeData" default-expand-all />
    </y-card>

    <y-card :title="$t('demo.tree.selectable')" style="margin-top: 8px">
      <y-tree v-model:selected="selectedKey" :data="treeData" default-expand-all @select="onSelect" />
      <p class="demo-tree-info">选中：{{ selectedKey ?? '无' }}</p>
      <p class="demo-tree-info">上次选中：{{ lastSelected }}</p>
    </y-card>

    <y-card :title="$t('demo.tree.checkable')" style="margin-top: 8px">
      <y-tree v-model:checked="checkedKeys" :data="treeData" checkable default-expand-all @check="onCheck" />
      <p class="demo-tree-info">已勾选：{{ checkedKeys.join(', ') || '无' }}</p>
      <p class="demo-tree-info">上次勾选：{{ lastCheck }}</p>
    </y-card>

    <y-card :title="$t('demo.tree.controlledExpand')" style="margin-top: 8px">
      <y-button-group style="margin-bottom: 12px">
        <y-button @click="expandedKeys = ['components', 'data-entry']">{{ $t('demo.tree.expandDataEntry') }}</y-button>
        <y-button @click="expandedKeys = []">{{ $t('demo.tree.collapseAll') }}</y-button>
      </y-button-group>
      <y-tree v-model:expanded="expandedKeys" :data="treeData" />
    </y-card>

    <y-card :title="$t('demo.tree.disabledNode')" style="margin-top: 8px">
      <y-tree :data="disabledData" checkable default-expand-all />
    </y-card>

    <y-card :title="$t('demo.tree.emptyState')" style="margin-top: 8px">
      <y-tree :data="[]" />
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'
import type { TreeKey, TreeNodeData } from 'yiz-ui'

const treeData: TreeNodeData[] = [
  {
    label: $t('demo.tree.components'),
    key: 'components',
    children: [
      {
        label: $t('demo.tree.dataEntry'),
        key: 'data-entry',
        children: [
          { label: $t('demo.tree.inputBox'), key: 'input' },
          { label: $t('demo.tree.dropdown'), key: 'select' },
          { label: $t('demo.tree.dateSelector'), key: 'date-picker' }
        ]
      },
      {
        label: $t('demo.tree.dataDisplay'),
        key: 'data-display',
        children: [
          { label: $t('demo.tree.table'), key: 'table' },
          { label: '树', key: 'tree' },
          { label: $t('demo.tree.tag'), key: 'tag' }
        ]
      }
    ]
  },
  {
    label: $t('demo.tree.navigation'),
    key: 'navigation',
    children: [
      { label: $t('demo.tree.menu'), key: 'menu' },
      { label: $t('demo.tree.pagination'), key: 'pagination' }
    ]
  }
]

const disabledData: TreeNodeData[] = [
  {
    label: $t('demo.tree.root'),
    key: 'root',
    children: [
      { label: $t('demo.tree.availableNode'), key: 'available' },
      { label: $t('demo.tree.disabledNode'), key: 'disabled', disabled: true },
      {
        label: $t('demo.tree.disabledGroup'),
        key: 'disabled-group',
        disabled: true,
        children: [{ label: $t('demo.tree.childNode'), key: 'disabled-child' }]
      }
    ]
  }
]

const selectedKey = ref<TreeKey | null>(null)
const checkedKeys = ref<TreeKey[]>(['input'])
const expandedKeys = ref<TreeKey[]>(['components'])
const lastSelected = ref('无')
const lastCheck = ref('无')

function onSelect(node: TreeNodeData, key: TreeKey) {
  lastSelected.value = `${node.label} (${key})`
}

function onCheck(keys: TreeKey[], node: TreeNodeData, checked: boolean) {
  lastCheck.value = `${checked ? '勾选' : '取消勾选'} ${node.label}；共 ${keys.length} 项`
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
