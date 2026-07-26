<template>
  <y-tree :data="treeData" default-expand-all />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { $t, type TreeNodeData } from 'yiz-ui'

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
</script>
