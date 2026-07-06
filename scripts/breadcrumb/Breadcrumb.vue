<template>
  <nav class="yiz-breadcrumb" :aria-label="ariaLabel">
    <ol class="yiz-breadcrumb-list">
      <li v-for="(item, index) in allItems" :key="getItemKey(item, index)" class="yiz-breadcrumb-item">
        <component
          :is="getItemTag(item, index)"
          class="yiz-breadcrumb-link"
          :class="{
            'yiz-breadcrumb-link-current': isLast(index),
            'yiz-breadcrumb-link-disabled': item.disabled,
          }"
          :href="getItemHref(item, index)"
          :aria-current="isLast(index) ? 'page' : undefined"
          :aria-disabled="item.disabled ? 'true' : undefined"
          :disabled="getItemTag(item, index) === 'button' ? item.disabled : undefined"
          :type="getItemTag(item, index) === 'button' ? 'button' : undefined"
          @click="onItemClick($event, item, index)"
        >
          <BreadcrumbSlotRenderer v-if="item.renderFn" :render="item.renderFn" />
        </component>
        <span v-if="!isLast(index)" class="yiz-breadcrumb-separator" aria-hidden="true">
          <slot name="separator">
            <Icon size="16" :icon="ChevronRight16Regular" />
          </slot>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts" setup>
import { ChevronRight16Regular } from '@vicons/fluent'
import { computed, defineComponent, Fragment, useSlots } from 'vue'
import { Icon } from '../icon'
import BreadcrumbItemComp from './BreadcrumbItem.vue'

export interface BreadcrumbItemData {
  key?: string | number
  href?: string
  disabled?: boolean
}

interface ResolvedBreadcrumbItem extends BreadcrumbItemData {
  renderFn?: () => any
  onClick?: ((event: MouseEvent) => void) | ((event: MouseEvent) => void)[]
}

const props = withDefaults(
  defineProps<{
    ariaLabel?: string
  }>(),
  {
    ariaLabel: 'breadcrumb',
  },
)

const slots = useSlots()

defineSlots<{
  separator?: any
  default?: any
}>()

const BreadcrumbSlotRenderer = defineComponent({
  props: {
    render: {
      type: Function,
      required: true,
    },
  },
  setup(renderProps) {
    return () => renderProps.render()
  },
})

function normalizeBoolProp(value: unknown) {
  return value === '' || value === true
}

// 递归展平 Fragment，确保包裹组件或 v-for 生成的 BreadcrumbItem 能被正确提取
function collectItemVNodes(nodes: any[]): any[] {
  const result: any[] = []
  for (const vnode of nodes) {
    if (vnode && (vnode as any).type === Fragment) {
      const children = (vnode as any).children as any[]
      if (children) {
        result.push(...collectItemVNodes(children))
      }
    } else if (vnode && vnode.type === BreadcrumbItemComp) {
      result.push(vnode)
    }
  }
  return result
}

const slotItems = computed<ResolvedBreadcrumbItem[]>(() => {
  const nodes = collectItemVNodes(slots.default?.() ?? [])
  const result: ResolvedBreadcrumbItem[] = []
  for (const vnode of nodes) {
    const p = (vnode.props ?? {}) as Record<string, any>
    const vnodeSlots = vnode.children
    const renderFn =
      vnodeSlots && typeof vnodeSlots === 'object' && typeof vnodeSlots.default === 'function'
        ? vnodeSlots.default
        : undefined

    if (p.item) {
      result.push({ ...p.item, key: vnode.key ?? p.item.key, renderFn, onClick: p.onClick })
    } else {
      result.push({
        key: vnode.key ?? p.key,
        href: p.href,
        disabled: normalizeBoolProp(p.disabled),
        renderFn,
        onClick: p.onClick,
      })
    }
  }
  return result
})

const allItems = computed<ResolvedBreadcrumbItem[]>(() => slotItems.value)

function isLast(index: number) {
  return index === allItems.value.length - 1
}

function getItemKey(item: ResolvedBreadcrumbItem, index: number) {
  return item.key ?? item.href ?? index
}

function getItemTag(item: ResolvedBreadcrumbItem, index: number) {
  if (isLast(index) || item.disabled) return 'span'
  if (item.href) return 'a'
  return item.onClick ? 'button' : 'span'
}

function getItemHref(item: ResolvedBreadcrumbItem, index: number) {
  return getItemTag(item, index) === 'a' ? item.href : undefined
}

function onItemClick(event: MouseEvent, item: ResolvedBreadcrumbItem, index: number) {
  if (isLast(index) || item.disabled || item.href) return
  if (Array.isArray(item.onClick)) {
    item.onClick.forEach((handler) => handler(event))
  } else {
    item.onClick?.(event)
  }
}
</script>

<style lang="less">
.yiz-breadcrumb {
  color: #333;
  font-size: 14px;
  line-height: 1;
}

.yiz-breadcrumb-list {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.yiz-breadcrumb-item {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.yiz-breadcrumb-link {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: #666;
  font: inherit;
  line-height: 20px;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: var(--yiz-color-primary);
  }
}

.yiz-breadcrumb-link-current,
.yiz-breadcrumb-link-current:hover {
  color: #333;
  cursor: default;
}

.yiz-breadcrumb-link-disabled,
.yiz-breadcrumb-link-disabled:hover {
  color: #c0c4cc;
  cursor: not-allowed;
}

.yiz-breadcrumb-separator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 8px;
  color: #999;
  line-height: 1;
}
</style>
