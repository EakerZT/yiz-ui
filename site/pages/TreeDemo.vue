<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.tree') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.tree.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basic')">
      <y-tree :data="treeData" default-expand-all />
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.tree.selectable')" style="margin-top: 8px">
      <y-tree v-model:selected="selectedKey" :data="treeData" default-expand-all @select="onSelect" />
      <p class="demo-tree-info">{{ $t('demo.tree.selected', { value: selectedKey ?? $t('demo.common.none') }) }}</p>
      <p class="demo-tree-info">{{ $t('demo.tree.lastSelected', { value: lastSelected }) }}</p>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.tree.checkable')" style="margin-top: 8px">
      <y-tree v-model:checked="checkedKeys" :data="treeData" checkable default-expand-all @check="onCheck" />
      <p class="demo-tree-info">
        {{ $t('demo.tree.checked', { value: checkedKeys.join(', ') || $t('demo.common.none') }) }}
      </p>
      <p class="demo-tree-info">{{ $t('demo.tree.lastCheck', { value: lastCheck }) }}</p>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.tree.beforeAfterSlots')" style="margin-top: 8px">
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
    </demo-card>

    <demo-card :source-index="4" :title="$t('demo.tree.controlledExpand')" style="margin-top: 8px">
      <y-button-group style="margin-bottom: 12px">
        <y-button @click="expandedKeys = ['components', 'data-entry']">{{ $t('demo.tree.expandDataEntry') }}</y-button>
        <y-button @click="expandedKeys = []">{{ $t('demo.tree.collapseAll') }}</y-button>
      </y-button-group>
      <y-tree v-model:expanded="expandedKeys" :data="treeData" />
    </demo-card>

    <demo-card :source-index="5" :title="$t('demo.tree.disabledNode')" style="margin-top: 8px">
      <y-tree :data="disabledData" checkable default-expand-all />
    </demo-card>

    <demo-card :source-index="6" :title="$t('demo.tree.emptyState')" style="margin-top: 8px">
      <y-tree :data="[]" />
    </demo-card>
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
        children: [{ label: $t('demo.tree.childNode'), key: 'disabled-child' }],
      },
    ],
  },
]

const selectedKey = ref<TreeKey | null>(null)
const checkedKeys = ref<TreeKey[]>(['input'])
const slotSelectedKey = ref<TreeKey | null>('input')
const slotCheckedKeys = ref<TreeKey[]>(['input'])
const expandedKeys = ref<TreeKey[]>(['components'])
const lastSelected = ref($t('demo.common.none'))
const lastCheck = ref($t('demo.common.none'))

function onSelect(node: TreeNodeData, key: TreeKey) {
  lastSelected.value = `${node.label} (${key})`
}

function onCheck(keys: TreeKey[], node: TreeNodeData, checked: boolean) {
  lastCheck.value = $t(checked ? 'demo.tree.checkEvent' : 'demo.tree.uncheckEvent', {
    label: node.label,
    total: keys.length,
  })
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
