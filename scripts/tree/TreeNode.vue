<template>
  <div class="yiz-tree-node">
    <div
      class="yiz-tree-node-content"
      :class="{
        'yiz-tree-node-selected': context.isSelected(node),
        'yiz-tree-node-disabled': node.disabled,
      }"
      :style="{ paddingLeft: `${level * context.indent.value}px` }"
      role="treeitem"
      :tabindex="node.disabled ? -1 : context.isFocused(node) ? 0 : -1"
      :aria-level="level + 1"
      :aria-expanded="hasChildren ? expanded : undefined"
      :aria-selected="context.selectable.value ? context.isSelected(node) : undefined"
      :aria-checked="ariaChecked"
      :aria-disabled="node.disabled || undefined"
      @focus="context.setFocused(node)"
      @click="onContentClick"
      @keydown="onKeydown"
    >
      <button
        v-if="hasChildren"
        class="yiz-tree-switcher"
        :class="{ 'yiz-tree-switcher-expanded': expanded }"
        type="button"
        :disabled="node.disabled"
        tabindex="-1"
        :aria-label="t(expanded ? 'tree.collapse' : 'tree.expand', { label: node.label })"
        @click.stop="context.toggleExpand(node)"
      >
        <Icon class="yiz-tree-switcher-icon" size="16" :icon="ChevronRight16Regular" />
      </button>
      <span v-else class="yiz-tree-switcher-placeholder" />

      <span
        v-if="context.checkable.value && node.checkable !== false"
        class="yiz-tree-checkbox"
        :class="{ 'yiz-tree-checkbox-half': context.isHalfChecked(node) }"
        @click.stop
      >
        <Checkbox
          :checked="context.isChecked(node)"
          :disabled="node.disabled"
          @update:checked="context.toggleCheck(node)"
        />
      </span>

      <span v-if="$slots.before" class="yiz-tree-node-before">
        <slot name="before" :item="node" :selected="context.isSelected(node)" :checked="context.isChecked(node)" />
      </span>
      <span class="yiz-tree-node-label">{{ node.label }}</span>
      <span v-if="$slots.after" class="yiz-tree-node-after">
        <slot name="after" :item="node" :selected="context.isSelected(node)" :checked="context.isChecked(node)" />
      </span>
    </div>

    <Transition
      name="yiz-tree-expand"
      @before-enter="onExpandBeforeEnter"
      @enter="onExpandEnter"
      @after-enter="onExpandAfterEnter"
      @before-leave="onExpandBeforeLeave"
      @leave="onExpandLeave"
    >
      <div v-if="hasChildren && expanded" class="yiz-tree-node-children">
        <TreeNode v-for="child in node.children" :key="child.key" :node="child" :level="level + 1">
          <template v-if="$slots.before" #before="scope">
            <slot name="before" v-bind="scope" />
          </template>
          <template v-if="$slots.after" #after="scope">
            <slot name="after" v-bind="scope" />
          </template>
        </TreeNode>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { ChevronRight16Regular } from '@vicons/fluent'
import Checkbox from '../checkbox/Checkbox.vue'
import { Icon } from '../icon'
import type { TreeContext, TreeNodeData, TreeSlotProps } from './Tree.vue'
import { useLocale } from '../locale'

const t = useLocale()

defineOptions({
  name: 'TreeNode',
})

const props = defineProps<{
  node: TreeNodeData
  level: number
}>()

defineSlots<{
  before?: (props: TreeSlotProps) => any
  after?: (props: TreeSlotProps) => any
}>()

const treeContext = inject<TreeContext>('yizTree')

if (!treeContext) {
  throw new Error('TreeNode must be used inside Tree')
}

const context = treeContext

const hasChildren = computed(() => Array.isArray(props.node.children) && props.node.children.length > 0)
const expanded = computed(() => context.isExpanded(props.node))
const ariaChecked = computed(() => {
  if (!context.checkable.value || props.node.checkable === false) return undefined
  return context.isHalfChecked(props.node) ? 'mixed' : context.isChecked(props.node)
})

function onContentClick(event: MouseEvent) {
  if (props.node.disabled) return
  ;(event.currentTarget as HTMLElement).focus()
  if (context.expandOnClickNode.value && hasChildren.value) {
    context.toggleExpand(props.node)
  }
  context.selectNode(props.node)
}

function getVisibleTreeItems(current: HTMLElement) {
  const tree = current.closest('.yiz-tree')
  if (!tree) return []
  return Array.from(tree.querySelectorAll<HTMLElement>('[role="treeitem"]')).filter(
    (item) => item.offsetParent !== null && item.getAttribute('aria-disabled') !== 'true',
  )
}

function focusTreeItem(item: HTMLElement | null | undefined) {
  item?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (props.node.disabled) return
  const current = event.currentTarget as HTMLElement
  const visibleItems = getVisibleTreeItems(current)
  const currentIndex = visibleItems.indexOf(current)

  if (event.key === 'ArrowDown') focusTreeItem(visibleItems[currentIndex + 1] ?? visibleItems[0])
  else if (event.key === 'ArrowUp')
    focusTreeItem(visibleItems[currentIndex - 1] ?? visibleItems[visibleItems.length - 1])
  else if (event.key === 'Home') focusTreeItem(visibleItems[0])
  else if (event.key === 'End') focusTreeItem(visibleItems[visibleItems.length - 1])
  else if (event.key === 'ArrowRight' && hasChildren.value) {
    if (!expanded.value) context.toggleExpand(props.node)
    else {
      const firstChild = current.parentElement?.querySelector<HTMLElement>(
        ':scope > .yiz-tree-node-children > .yiz-tree-node > .yiz-tree-node-content',
      )
      focusTreeItem(firstChild)
    }
  } else if (event.key === 'ArrowLeft') {
    if (hasChildren.value && expanded.value) context.toggleExpand(props.node)
    else {
      const parentItem = current.parentElement?.parentElement?.closest<HTMLElement>('.yiz-tree-node')
      focusTreeItem(parentItem?.querySelector<HTMLElement>(':scope > .yiz-tree-node-content'))
    }
  } else if (event.key === 'Enter') {
    context.selectNode(props.node)
  } else if (event.key === ' ') {
    if (context.checkable.value && props.node.checkable !== false) context.toggleCheck(props.node)
    else context.selectNode(props.node)
  } else {
    return
  }

  event.preventDefault()
  event.stopPropagation()
}

function onExpandBeforeEnter(el: Element) {
  const target = el as HTMLElement
  target.style.height = '0'
}

function onExpandEnter(el: Element) {
  const target = el as HTMLElement
  target.style.height = `${target.scrollHeight}px`
}

function onExpandAfterEnter(el: Element) {
  const target = el as HTMLElement
  target.style.height = ''
}

function onExpandBeforeLeave(el: Element) {
  const target = el as HTMLElement
  target.style.height = `${target.scrollHeight}px`
}

function onExpandLeave(el: Element) {
  const target = el as HTMLElement
  target.offsetHeight
  target.style.height = '0'
}
</script>
