<template>
  <y-tree :data="disabledData" checkable default-expand-all />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLocale, type TreeNodeData } from 'yiz-ui'

const t = useLocale()

const disabledData = computed<TreeNodeData[]>(() => [
  {
    label: t('demo.tree.root'),
    key: 'root',
    children: [
      { label: t('demo.tree.availableNode'), key: 'available' },
      { label: t('demo.tree.disabledNode'), key: 'disabled', disabled: true },
      {
        label: t('demo.tree.disabledGroup'),
        key: 'disabled-group',
        disabled: true,
        children: [{ label: t('demo.tree.childNode'), key: 'disabled-child' }],
      },
    ],
  },
])
</script>
