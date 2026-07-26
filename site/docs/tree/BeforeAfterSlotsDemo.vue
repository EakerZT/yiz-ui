<template>
  <y-tree
    v-model:selected="slotSelectedKey"
    v-model:checked="slotCheckedKeys"
    :data="treeData"
    checkable
    default-expand-all
  >
    <template #before="{ item, selected, checked }">
      <span
        class="demo-tree-slot-marker"
        :class="{
          'demo-tree-slot-marker-selected': selected,
          'demo-tree-slot-marker-checked': checked,
        }"
      >
        {{ item.children?.length ? '◆' : '•' }}
      </span>
    </template>
    <template #after="{ item, selected, checked }">
      <span class="demo-tree-slot-after">
        <code>{{ item.key }}</code>
        <y-tag v-if="selected" color="primary" size="small">{{ $t('demo.tree.selectedState') }}</y-tag>
        <y-tag v-if="checked" color="success" size="small">{{ $t('demo.tree.checkedState') }}</y-tag>
      </span>
    </template>
  </y-tree>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t, type TreeKey, type TreeNodeData } from 'yiz-ui'

const treeData = computed<TreeNodeData[]>(() => [
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
          { label: $t('demo.tree.dateSelector'), key: 'date-picker' },
        ],
      },
      {
        label: $t('demo.tree.dataDisplay'),
        key: 'data-display',
        children: [
          { label: $t('demo.tree.table'), key: 'table' },
          { label: $t('demo.tree.tree'), key: 'tree' },
          { label: $t('demo.tree.tag'), key: 'tag' },
        ],
      },
    ],
  },
  {
    label: $t('demo.tree.navigation'),
    key: 'navigation',
    children: [
      { label: $t('demo.tree.menu'), key: 'menu' },
      { label: $t('demo.tree.pagination'), key: 'pagination' },
    ],
  },
])

const slotSelectedKey = ref<TreeKey | null>('input')
const slotCheckedKeys = ref<TreeKey[]>(['input'])
</script>

<style scoped>
.demo-tree-slot-marker {
  color: #999;
}

.demo-tree-slot-marker-selected {
  color: var(--yiz-color-primary);
}

.demo-tree-slot-marker-checked {
  color: var(--yiz-color-success);
}

.demo-tree-slot-after {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 6px;
}

.demo-tree-slot-after code {
  color: #999;
  font-size: 12px;
}
</style>
