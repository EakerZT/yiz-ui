<template>
  <y-button-group style="margin-bottom: 12px">
    <y-button @click="expandedKeys = ['components', 'data-entry']">{{ t('demo.tree.expandDataEntry') }}</y-button>
    <y-button @click="expandedKeys = []">{{ t('demo.tree.collapseAll') }}</y-button>
  </y-button-group>
  <y-tree v-model:expanded="expandedKeys" :data="treeData" />
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

const expandedKeys = ref<TreeKey[]>(['components'])
</script>
