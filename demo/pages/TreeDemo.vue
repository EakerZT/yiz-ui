<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Tree 树</h2>
    <p class="demo-section-desc">用于展示层级数据，支持展开、选中和勾选状态。</p>

    <y-card title="基础用法">
      <y-tree :data="treeData" default-expand-all />
    </y-card>

    <y-card title="可选中" style="margin-top: 8px">
      <y-tree v-model:selected="selectedKey" :data="treeData" default-expand-all @select="onSelect" />
      <p class="demo-tree-info">选中：{{ selectedKey ?? '无' }}</p>
      <p class="demo-tree-info">上次选中：{{ lastSelected }}</p>
    </y-card>

    <y-card title="可勾选" style="margin-top: 8px">
      <y-tree v-model:checked="checkedKeys" :data="treeData" checkable default-expand-all @check="onCheck" />
      <p class="demo-tree-info">已勾选：{{ checkedKeys.join(', ') || '无' }}</p>
      <p class="demo-tree-info">上次勾选：{{ lastCheck }}</p>
    </y-card>

    <y-card title="受控展开" style="margin-top: 8px">
      <y-button-group style="margin-bottom: 12px">
        <y-button @click="expandedKeys = ['components', 'data-entry']">展开数据录入</y-button>
        <y-button @click="expandedKeys = []">全部收起</y-button>
      </y-button-group>
      <y-tree v-model:expanded="expandedKeys" :data="treeData" />
    </y-card>

    <y-card title="禁用节点" style="margin-top: 8px">
      <y-tree :data="disabledData" checkable default-expand-all />
    </y-card>

    <y-card title="空状态" style="margin-top: 8px">
      <y-tree :data="[]" />
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { TreeKey, TreeNodeData } from 'yiz-ui'

const treeData: TreeNodeData[] = [
  {
    label: '组件',
    key: 'components',
    children: [
      {
        label: '数据录入',
        key: 'data-entry',
        children: [
          { label: '输入框', key: 'input' },
          { label: '下拉选择', key: 'select' },
          { label: '日期选择器', key: 'date-picker' }
        ]
      },
      {
        label: '数据展示',
        key: 'data-display',
        children: [
          { label: '表格', key: 'table' },
          { label: '树', key: 'tree' },
          { label: '标签', key: 'tag' }
        ]
      }
    ]
  },
  {
    label: '导航',
    key: 'navigation',
    children: [
      { label: '菜单', key: 'menu' },
      { label: '分页', key: 'pagination' }
    ]
  }
]

const disabledData: TreeNodeData[] = [
  {
    label: '根节点',
    key: 'root',
    children: [
      { label: '可用节点', key: 'available' },
      { label: '禁用节点', key: 'disabled', disabled: true },
      {
        label: '禁用分组',
        key: 'disabled-group',
        disabled: true,
        children: [{ label: '子节点', key: 'disabled-child' }]
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
