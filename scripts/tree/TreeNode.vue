<template>
  <div class="yiz-tree-node">
    <div
      class="yiz-tree-node-content"
      :class="{
        'yiz-tree-node-selected': context.isSelected(node),
        'yiz-tree-node-disabled': node.disabled
      }"
      :style="{ paddingLeft: `${level * context.indent.value}px` }"
      @click="onContentClick"
    >
      <button
        v-if="hasChildren"
        class="yiz-tree-switcher"
        :class="{ 'yiz-tree-switcher-expanded': expanded }"
        type="button"
        :disabled="node.disabled"
        @click.stop="context.toggleExpand(node)"
      >
        <Icon class="yiz-tree-switcher-icon" size="16" :icon="CaretRight16Regular" />
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

      <span class="yiz-tree-node-label">{{ node.label }}</span>
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
        <TreeNode v-for="child in node.children" :key="child.key" :node="child" :level="level + 1" />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { CaretRight16Regular } from '@vicons/fluent'
import Checkbox from '../checkbox/Checkbox.vue'
import { Icon } from '../icon'
import type { TreeContext, TreeNodeData } from './Tree.vue'

defineOptions({
  name: 'TreeNode'
})

const props = defineProps<{
  node: TreeNodeData
  level: number
}>()

const treeContext = inject<TreeContext>('yizTree')

if (!treeContext) {
  throw new Error('TreeNode must be used inside Tree')
}

const context = treeContext

const hasChildren = computed(() => Array.isArray(props.node.children) && props.node.children.length > 0)
const expanded = computed(() => context.isExpanded(props.node))

function onContentClick() {
  if (props.node.disabled) return
  if (context.expandOnClickNode.value && hasChildren.value) {
    context.toggleExpand(props.node)
  }
  context.selectNode(props.node)
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
