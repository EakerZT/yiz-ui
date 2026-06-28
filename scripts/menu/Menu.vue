<template>
  <div
    class="yiz-menu"
    :class="{ 'yiz-menu-collapsed': collapsed, 'yiz-menu-dark': props.dark }"
    :style="{ width: collapsed ? '56px' : menuWidth }"
  >
    <template v-for="(item, idx) in allItems" :key="idx">
      <!-- collapsed item without children: wrap in Tooltip -->
      <Tooltip v-if="collapsed && !item.children?.length" :content="item.label" placement="right">
        <div
          class="yiz-menu-item"
          :class="{ 'yiz-menu-item-selected': isSelected(item), 'yiz-menu-item-ancestor': isAncestor(item) }"
          @click="onItemClick(item)"
        >
          <span class="yiz-menu-item-icon">
            <template v-if="item.icon">
              <template v-if="typeof item.icon === 'string'">
                <slot name="icon" :icon="item.icon" :item="item" />
              </template>
              <IconRenderer v-else :content="item.icon" />
            </template>
          </span>
          <span class="yiz-menu-item-label" :class="{ 'yiz-menu-item-label-hidden': collapsed }">
            <slot name="item" :item="item" :index="idx">
              {{ item.label }}
            </slot>
          </span>
          <Icon
            v-if="item.children?.length"
            class="yiz-menu-item-arrow"
            :class="{ 'yiz-menu-item-arrow-expanded': isExpanded(item), 'yiz-menu-item-arrow-hidden': collapsed }"
            size="16"
            :icon="ChevronRight16Regular"
          />
        </div>
      </Tooltip>

      <!-- collapsed with children, or non-collapsed -->
      <div
        v-else
        class="yiz-menu-item"
        :class="{ 'yiz-menu-item-selected': isSelected(item), 'yiz-menu-item-ancestor': isAncestor(item) }"
        @click="onItemClick(item)"
        @mouseenter="onItemMouseEnter(item, $event)"
        @mouseleave="onItemMouseLeave(item)"
      >
        <span class="yiz-menu-item-icon">
          <template v-if="item.icon">
            <template v-if="typeof item.icon === 'string'">
              <slot name="icon" :icon="item.icon" :item="item" />
            </template>
            <IconRenderer v-else :content="item.icon" />
          </template>
        </span>
        <span class="yiz-menu-item-label">
          <slot name="item" :item="item" :index="idx">
            {{ item.label }}
          </slot>
        </span>
        <Icon
          v-if="item.children?.length"
          class="yiz-menu-item-arrow"
          :class="{ 'yiz-menu-item-arrow-expanded': isExpanded(item) }"
          size="16"
          :icon="ChevronRight16Regular"
        />
      </div>
      <SubMenu
        v-if="!collapsed"
        :visible="!!(item.children?.length && isExpanded(item))"
        :items="item.children"
        :selected="selected"
        :width="props.width"
        :depth="1"
        @select="onChildSelect"
      >
        <template #icon="scope"><slot name="icon" v-bind="scope" /></template>
        <template #item="scope"><slot name="item" v-bind="scope" /></template>
      </SubMenu>
    </template>
    <div style="display: none"><slot /></div>
  </div>

  <!-- collapsed popup submenu -->
  <PopupSubMenu
    v-if="collapsed"
    :visible="!!popupItem"
    :items="popupItem?.children"
    :selected="selected"
    :position="popupStyle"
    :dark="props.dark"
    popup-class="yiz-menu-popup"
    @select="onCollapsedPopupSelect"
    @mouseenter="onCollapsedPopupEnter"
    @mouseleave="onCollapsedPopupLeave"
  >
    <template #icon="scope"><slot name="icon" v-bind="scope" /></template>
    <template #item="scope"><slot name="item" v-bind="scope" /></template>
  </PopupSubMenu>
</template>

<script lang="ts" setup>
import { computed, Fragment, ref, useSlots } from 'vue'
import { ChevronRight16Regular } from '@vicons/fluent'
import MenuOptionComp from '../menu-option/MenuOption.vue'
import { Icon } from '../icon'
import IconRenderer from './IconRenderer.vue'
import Tooltip from '../tooltip/Tooltip.vue'
import SubMenu from './SubMenu.vue'
import PopupSubMenu from './PopupSubMenu.vue'

export interface MenuItem {
  label: string
  key: any
  children?: MenuItem[]
  icon?: string | (() => any) | any
}

const props = withDefaults(
  defineProps<{
    items?: MenuItem[]
    width?: number | string
    collapsed?: boolean
    dark?: boolean
  }>(),
  {
    items: () => [],
    width: 256,
    collapsed: false,
    dark: false
  }
)

const menuWidth = computed(() => {
  const w = props.width
  const num = typeof w === 'number' ? w : parseFloat(w as string)
  return `${num}px`
})

defineSlots<{
  default?: () => any
  item?: (props: { item: MenuItem; index: number }) => any
  icon?: (props: { icon: string; item: MenuItem }) => any
}>()

const emit = defineEmits<{
  select: [item: MenuItem]
}>()

const selected = defineModel<any>('select')

const expandedKeys = ref<Set<any>>(new Set())

// collapsed mode: popup submenu state
const popupItem = ref<MenuItem | null>(null)
const popupStyle = ref<Record<string, string>>({})
let popupTimer: ReturnType<typeof setTimeout> | null = null

const slots = useSlots()

// 递归展平 Fragment，确保包裹组件或 v-for 生成的 MenuOption 能被正确提取
function collectOptionVNodes(nodes: any[]): any[] {
  const result: any[] = []
  for (const vnode of nodes) {
    if (vnode && (vnode as any).type === Fragment) {
      const children = (vnode as any).children as any[]
      if (children) {
        result.push(...collectOptionVNodes(children))
      }
    } else if (vnode && vnode.type === MenuOptionComp) {
      result.push(vnode)
    }
  }
  return result
}

const slotItems = computed(() => {
  const nodes = collectOptionVNodes(slots.default?.() ?? [])
  const items: MenuItem[] = []
  for (const vnode of nodes) {
    if (vnode.props) {
      const p = vnode.props as Record<string, any>
      if (p.item) {
        items.push({ ...p.item, children: p.children ?? p.item.children, icon: p.icon ?? p.item.icon })
      } else {
        items.push({ label: p.label, key: vnode.key ?? p.key, children: p.children, icon: p.icon })
      }
    }
  }
  return items
})

const allItems = computed(() => {
  return slotItems.value.length > 0 ? slotItems.value : props.items
})

function findAncestors(items: MenuItem[], target: any, ancestors = new Set<any>()): Set<any> | null {
  for (const item of items) {
    if (item.key === target) return ancestors
    if (item.children?.length) {
      const next = new Set(ancestors)
      next.add(item.key)
      const result = findAncestors(item.children, target, next)
      if (result) return result
    }
  }
  return null
}

const ancestorKeys = computed(() => {
  if (selected.value == null) return new Set<any>()
  return findAncestors(allItems.value, selected.value) ?? new Set()
})

function isAncestor(item: MenuItem) {
  return ancestorKeys.value.has(item.key)
}

function isSelected(item: MenuItem) {
  return selected.value != null && item.key === selected.value
}

function isExpanded(item: MenuItem) {
  return expandedKeys.value.has(item.key)
}

function onItemClick(item: MenuItem) {
  if (item.children?.length) {
    if (props.collapsed) return
    const key = item.key
    if (expandedKeys.value.has(key)) {
      expandedKeys.value.delete(key)
    } else {
      expandedKeys.value.add(key)
    }
    expandedKeys.value = new Set(expandedKeys.value)
  } else {
    selected.value = item.key
    emit('select', item)
  }
}

function onChildSelect(item: MenuItem) {
  selected.value = item.key
  emit('select', item)
}

function onItemMouseEnter(item: MenuItem, e: MouseEvent) {
  if (props.collapsed && item.children?.length) {
    if (popupTimer) {
      clearTimeout(popupTimer)
      popupTimer = null
    }
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    popupItem.value = item
    popupStyle.value = {
      position: 'fixed',
      left: `${rect.right}px`,
      top: `${rect.top}px`
    }
  }
}

function onItemMouseLeave(_item: MenuItem) {
  if (props.collapsed) {
    popupTimer = setTimeout(() => {
      popupItem.value = null
    }, 100)
  }
}

// collapsed popup
function onCollapsedPopupEnter() {
  if (popupTimer) {
    clearTimeout(popupTimer)
    popupTimer = null
  }
}

function onCollapsedPopupLeave(e: MouseEvent) {
  const related = e.relatedTarget as HTMLElement | null
  if (related?.closest('.yiz-menu-popup-sub')) return
  popupItem.value = null
}

function onCollapsedPopupSelect(item: MenuItem) {
  selected.value = item.key
  emit('select', item)
  popupItem.value = null
}
</script>

<style lang="less">
.yiz-menu {
  user-select: none;
  border-right: 1px solid var(--yiz-color-border, #d9d9d9);
  background: #fff;
  padding: 4px 0;
  transition: width 0.2s;
  min-height: 100%;
}

.yiz-menu-dark {
  background: rgb(0, 20, 40);
  color: #fff;
  border-right-color: rgb(0, 20, 40);

  .yiz-menu-item {
    color: #fff;

    &:hover {
      background: rgba(255, 255, 255, 0.12);
    }

    &.yiz-menu-item-selected {
      background: var(--yiz-color-primary-heary);
      color: #fff;
    }

    &.yiz-menu-item-ancestor {
      color: #fff;
    }
  }
}

.yiz-menu-collapsed {
  position: relative;
  .yiz-tooltip {
    display: flex;
  }

  .yiz-menu-item-icon {
    width: 24px;
    height: 24px;
    font-size: 24px;
    margin-right: 0;
  }

  .yiz-menu-item-label {
    position: absolute;
    left: 40px;
    opacity: 0;
  }
  .yiz-menu-item-arrow {
    display: none;
  }
}

.yiz-menu-item {
  display: flex;
  align-items: center;
  height: 40px;
  margin: 4px;
  border-radius: var(--yiz-pane-item-border-radius);
  padding: 0 12px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover {
    background: var(--yiz-color-hover-bg);
  }

  &.yiz-menu-item-selected {
    background: var(--yiz-color-primary-light8);
    color: var(--yiz-color-primary);
  }

  &.yiz-menu-item-ancestor {
    color: var(--yiz-color-primary);
  }
}

.yiz-menu-item-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  font-size: 20px;
  transition: all 0.2s;
  margin-right: 8px;
}

.yiz-menu-item-label {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.yiz-menu-item-arrow {
  margin-left: 8px;
  flex-shrink: 0;
  transition:
    transform 0.2s,
    opacity 0.2s;

  &.yiz-menu-item-arrow-expanded {
    transform: rotate(90deg);
  }
}
</style>
