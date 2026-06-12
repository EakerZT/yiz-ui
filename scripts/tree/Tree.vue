<template>
  <div class="yiz-tree" :class="vClass">
    <div v-if="data.length === 0" class="yiz-tree-empty">{{ emptyText }}</div>
    <TreeNode v-for="node in data" v-else :key="node.key" :node="node" :level="0" />
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, ref, watch, type ComputedRef } from 'vue'
import TreeNode from './TreeNode.vue'

export type TreeKey = string | number

export interface TreeNodeData {
  label: string
  key: TreeKey
  children?: TreeNodeData[]
  disabled?: boolean
  selectable?: boolean
  checkable?: boolean
}

export interface TreeContext {
  indent: ComputedRef<number>
  checkable: ComputedRef<boolean>
  selectable: ComputedRef<boolean>
  expandOnClickNode: ComputedRef<boolean>
  isExpanded: (node: TreeNodeData) => boolean
  isSelected: (node: TreeNodeData) => boolean
  isChecked: (node: TreeNodeData) => boolean
  isHalfChecked: (node: TreeNodeData) => boolean
  toggleExpand: (node: TreeNodeData) => void
  selectNode: (node: TreeNodeData) => void
  toggleCheck: (node: TreeNodeData) => void
}

const selected = defineModel<TreeKey | null>('selected')
const checked = defineModel<TreeKey[]>('checked')
const expanded = defineModel<TreeKey[]>('expanded')

const props = withDefaults(
  defineProps<{
    data?: TreeNodeData[]
    checkable?: boolean
    selectable?: boolean
    defaultExpandAll?: boolean
    expandOnClickNode?: boolean
    indent?: number
    emptyText?: string
  }>(),
  {
    data: () => [],
    checkable: false,
    selectable: true,
    defaultExpandAll: false,
    expandOnClickNode: true,
    indent: 24,
    emptyText: 'No data'
  }
)

const emit = defineEmits<{
  select: [node: TreeNodeData, key: TreeKey]
  check: [checkedKeys: TreeKey[], node: TreeNodeData, checked: boolean]
  expand: [expandedKeys: TreeKey[], node: TreeNodeData, expanded: boolean]
}>()

const initialized = ref(false)

const expandedKeys = computed({
  get: () => expanded.value ?? [],
  set: (value: TreeKey[]) => {
    expanded.value = value
  }
})

const checkedKeys = computed({
  get: () => checked.value ?? [],
  set: (value: TreeKey[]) => {
    checked.value = value
  }
})

const vClass = computed(() => ({
  'yiz-tree-checkable': props.checkable,
  'yiz-tree-selectable': props.selectable
}))

const indentValue = computed(() => Math.max(12, props.indent))
const checkableValue = computed(() => props.checkable)
const selectableValue = computed(() => props.selectable)
const expandOnClickNodeValue = computed(() => props.expandOnClickNode)

watch(
  () => props.data,
  () => {
    if (!initialized.value && props.defaultExpandAll) {
      expandedKeys.value = collectExpandableKeys(props.data)
    }
    initialized.value = true
  },
  { immediate: true }
)

function hasChildren(node: TreeNodeData) {
  return Array.isArray(node.children) && node.children.length > 0
}

function collectExpandableKeys(nodes: TreeNodeData[]): TreeKey[] {
  const result: TreeKey[] = []
  for (const node of nodes) {
    if (hasChildren(node)) {
      result.push(node.key)
      result.push(...collectExpandableKeys(node.children ?? []))
    }
  }
  return result
}

function collectCheckableKeys(node: TreeNodeData): TreeKey[] {
  const result: TreeKey[] = []
  if (!node.disabled && node.checkable !== false) {
    result.push(node.key)
  }
  for (const child of node.children ?? []) {
    result.push(...collectCheckableKeys(child))
  }
  return result
}

function collectDescendantCheckableKeys(node: TreeNodeData): TreeKey[] {
  const result: TreeKey[] = []
  for (const child of node.children ?? []) {
    result.push(...collectCheckableKeys(child))
  }
  return result
}

function isExpanded(node: TreeNodeData) {
  return expandedKeys.value.includes(node.key)
}

function isSelected(node: TreeNodeData) {
  return selected.value === node.key
}

function isChecked(node: TreeNodeData) {
  if (node.disabled || node.checkable === false) return false
  return checkedKeys.value.includes(node.key)
}

function isHalfChecked(node: TreeNodeData) {
  const descendants = collectDescendantCheckableKeys(node)
  if (descendants.length === 0 || isChecked(node)) return false
  return descendants.some((key) => checkedKeys.value.includes(key))
}

function toggleExpand(node: TreeNodeData) {
  if (!hasChildren(node) || node.disabled) return

  const keys = new Set(expandedKeys.value)
  const nextExpanded = !keys.has(node.key)
  if (nextExpanded) {
    keys.add(node.key)
  } else {
    keys.delete(node.key)
  }
  const nextKeys = [...keys]
  expandedKeys.value = nextKeys
  emit('expand', nextKeys, node, nextExpanded)
}

function selectNode(node: TreeNodeData) {
  if (!props.selectable || node.disabled || node.selectable === false) return
  selected.value = node.key
  emit('select', node, node.key)
}

function toggleCheck(node: TreeNodeData) {
  if (!props.checkable || node.disabled || node.checkable === false) return

  const targetKeys = collectCheckableKeys(node)
  const keys = new Set(checkedKeys.value)
  const nextChecked = !isChecked(node)
  for (const key of targetKeys) {
    if (nextChecked) {
      keys.add(key)
    } else {
      keys.delete(key)
    }
  }
  const nextKeys = [...keys]
  checkedKeys.value = nextKeys
  emit('check', nextKeys, node, nextChecked)
}

provide<TreeContext>('yizTree', {
  indent: indentValue,
  checkable: checkableValue,
  selectable: selectableValue,
  expandOnClickNode: expandOnClickNodeValue,
  isExpanded,
  isSelected,
  isChecked,
  isHalfChecked,
  toggleExpand,
  selectNode,
  toggleCheck
})
</script>

<style lang="less">
.yiz-tree {
  color: #333;
  font-size: 14px;
  line-height: 1;
}

.yiz-tree-empty {
  padding: 16px 0;
  color: #999;
  text-align: center;
}

.yiz-tree-node-content {
  display: flex;
  align-items: center;
  min-height: 32px;
  border-radius: 3px;
  cursor: default;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.yiz-tree-selectable .yiz-tree-node-content:not(.yiz-tree-node-disabled) {
  cursor: pointer;
}

.yiz-tree-node-content:not(.yiz-tree-node-disabled):hover {
  background: #f5f7fa;
}

.yiz-tree-node-selected,
.yiz-tree-node-selected:not(.yiz-tree-node-disabled):hover {
  background: var(--yiz-color-primary-light9);
  color: var(--yiz-color-primary);
}

.yiz-tree-node-disabled {
  color: #bfbfbf;
  cursor: not-allowed;
}

.yiz-tree-switcher,
.yiz-tree-switcher-placeholder {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.yiz-tree-switcher {
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: #999;
  cursor: pointer;
}

.yiz-tree-switcher::before {
  content: '';
  display: inline-block;
  width: 0;
  height: 0;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  border-left: 5px solid currentColor;
  transition: transform 0.2s;
}

.yiz-tree-switcher-expanded::before {
  transform: rotate(90deg);
}

.yiz-tree-checkbox {
  display: inline-flex;
  margin-right: 6px;
}

.yiz-tree-checkbox-half .yiz-checkbox-inner {
  background: var(--yiz-color-primary);
  border-color: var(--yiz-color-primary);
}

.yiz-tree-checkbox-half .yiz-checkbox-inner::after {
  top: 50%;
  left: 50%;
  width: 8px;
  height: 2px;
  border: none;
  background: #fff;
  transform: translate(-50%, -50%);
}

.yiz-tree-node-label {
  padding: 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yiz-tree-expand-enter-active,
.yiz-tree-expand-leave-active {
  overflow: hidden;
  transition:
    height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease;
}

.yiz-tree-expand-enter-from,
.yiz-tree-expand-leave-to {
  height: 0;
  opacity: 0;
}

.yiz-tree-expand-enter-to,
.yiz-tree-expand-leave-from {
  opacity: 1;
}
</style>
