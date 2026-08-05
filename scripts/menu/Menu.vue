<template>
  <div
    class="yiz-menu"
    :class="{ 'yiz-menu-collapsed': collapsed, 'yiz-menu-dark': props.dark }"
    :style="{ width: collapsed ? '56px' : menuWidth }"
    role="menu"
    v-bind="$attrs"
  >
    <template v-for="(item, idx) in allItems" :key="item.key ?? idx">
      <div
        v-if="item.type === 'divider'"
        class="yiz-menu-divider"
        :class="{ 'yiz-menu-divider-with-name': item.name }"
        role="separator"
      >
        <span v-if="item.name" class="yiz-menu-divider-name">{{ item.name }}</span>
      </div>

      <!-- collapsed item without children: wrap in Tooltip -->
      <Tooltip v-else-if="collapsed && !item.children?.length" :content="item.label" placement="right">
        <div
          class="yiz-menu-item"
          :class="{ 'yiz-menu-item-selected': isSelected(item), 'yiz-menu-item-ancestor': isAncestor(item) }"
          @click="onItemClick(item)"
          role="menuitem"
          tabindex="0"
          :aria-current="isSelected(item) ? 'page' : undefined"
          :aria-haspopup="item.children?.length ? 'menu' : undefined"
          :aria-expanded="item.children?.length ? isExpanded(item) : undefined"
          @keydown="onItemKeydown($event, item)"
        >
          <span class="yiz-menu-item-icon">
            <template v-if="item.icon">
              <template v-if="typeof item.icon === 'string'">
                <slot name="icon" :icon="item.icon" :item="item" :selected="isSelected(item)" />
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
        role="menuitem"
        tabindex="0"
        :aria-current="isSelected(item) ? 'page' : undefined"
        :aria-haspopup="item.children?.length ? 'menu' : undefined"
        :aria-expanded="
          item.children?.length ? (collapsed ? !!popupItem && popupItem.key === item.key : isExpanded(item)) : undefined
        "
        @keydown="onItemKeydown($event, item)"
        @mouseenter="onItemMouseEnter(item, $event)"
        @mouseleave="onItemMouseLeave(item)"
      >
        <span class="yiz-menu-item-icon">
          <template v-if="item.icon">
            <template v-if="typeof item.icon === 'string'">
              <slot name="icon" :icon="item.icon" :item="item" :selected="isSelected(item)" />
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
        v-if="item.type !== 'divider' && !collapsed"
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
import { computed, Fragment, nextTick, ref, useSlots } from 'vue'
import { ChevronRight16Regular } from '@vicons/fluent'
import { Icon } from '../icon'
import MenuDividerComp from '../menu-divider/MenuDivider.vue'
import MenuItemComp from '../menu-item/MenuItem.vue'
import IconRenderer from './IconRenderer.vue'
import Tooltip from '../tooltip/Tooltip.vue'
import SubMenu from './SubMenu.vue'
import PopupSubMenu from './PopupSubMenu.vue'
import { isMenuDivider, type MenuEntry, type MenuItemOption } from './types'
import { moveMenuFocus } from './keyboard'

const props = withDefaults(
  defineProps<{
    items?: MenuEntry[]
    width?: number | string
    collapsed?: boolean
    dark?: boolean
  }>(),
  {
    items: () => [],
    width: 256,
    collapsed: false,
    dark: false,
  },
)

const menuWidth = computed(() => {
  const w = props.width
  const num = typeof w === 'number' ? w : parseFloat(w as string)
  return `${num}px`
})

defineSlots<{
  default?: () => any
  item?: (props: { item: MenuItemOption; index: number }) => any
  icon?: (props: { icon: any; item: MenuItemOption; selected: boolean }) => any
}>()

const emit = defineEmits<{
  select: [item: MenuItemOption]
}>()

const selected = defineModel<any>('select')

const expandedKeys = ref<Set<any>>(new Set())

// collapsed mode: popup submenu state
const popupItem = ref<MenuItemOption | null>(null)
const popupStyle = ref<Record<string, string>>({})
let popupTimer: ReturnType<typeof setTimeout> | null = null

const slots = useSlots()

// 递归展平 Fragment，确保包裹组件或 v-for 生成的声明组件能被正确提取
function collectEntryVNodes(nodes: any[]): any[] {
  const result: any[] = []
  for (const vnode of nodes) {
    if (vnode && (vnode as any).type === Fragment) {
      const children = (vnode as any).children as any[]
      if (children) {
        result.push(...collectEntryVNodes(children))
      }
    } else if (vnode && (vnode.type === MenuItemComp || vnode.type === MenuDividerComp)) {
      result.push(vnode)
    }
  }
  return result
}

function getNestedEntries(vnode: any): MenuEntry[] {
  const children = vnode.children as Record<string, (() => any[]) | undefined> | any[] | undefined
  if (Array.isArray(children)) return extractEntries(children)
  if (children && typeof children.default === 'function') return extractEntries(children.default())
  return []
}

function extractEntries(nodes: any[]): MenuEntry[] {
  const entries: MenuEntry[] = []
  for (const vnode of collectEntryVNodes(nodes)) {
    const p = (vnode.props ?? {}) as Record<string, any>
    if (vnode.type === MenuDividerComp) {
      entries.push({ type: 'divider', name: p.name, key: vnode.key ?? p.key })
      continue
    }

    const nestedEntries = getNestedEntries(vnode)
    const children = nestedEntries.length ? nestedEntries : (p.children ?? p.item?.children)
    if (p.item) {
      entries.push({ ...p.item, children, icon: p.icon ?? p.item.icon })
    } else {
      entries.push({ label: p.label, key: vnode.key ?? p.key, children, icon: p.icon })
    }
  }
  return entries
}

const slotItems = computed(() => {
  return extractEntries(slots.default?.() ?? [])
})

const allItems = computed(() => {
  return slotItems.value.length > 0 ? slotItems.value : props.items
})

function findAncestors(items: MenuEntry[], target: any, ancestors = new Set<any>()): Set<any> | null {
  for (const item of items) {
    if (isMenuDivider(item)) continue
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

function isAncestor(item: MenuItemOption) {
  return ancestorKeys.value.has(item.key)
}

function isSelected(item: MenuItemOption) {
  return selected.value != null && item.key === selected.value
}

function isExpanded(item: MenuItemOption) {
  return expandedKeys.value.has(item.key)
}

function onItemClick(item: MenuItemOption) {
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

async function openCollapsedPopup(item: MenuItemOption, element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  popupItem.value = item
  popupStyle.value = {
    position: 'fixed',
    left: `${rect.right}px`,
    top: `${rect.top}px`,
  }
  await nextTick()
  document.querySelector<HTMLElement>('.yiz-menu-popup .yiz-menu-item')?.focus()
}

function onItemKeydown(event: KeyboardEvent, item: MenuItemOption) {
  const current = event.currentTarget as HTMLElement
  if (event.key === 'ArrowDown') moveMenuFocus(current, 'next')
  else if (event.key === 'ArrowUp') moveMenuFocus(current, 'previous')
  else if (event.key === 'Home') moveMenuFocus(current, 'first')
  else if (event.key === 'End') moveMenuFocus(current, 'last')
  else if (event.key === 'ArrowRight' && item.children?.length) {
    if (props.collapsed) void openCollapsedPopup(item, current)
    else if (!isExpanded(item)) onItemClick(item)
  } else if (event.key === 'ArrowLeft' && item.children?.length) {
    if (props.collapsed) popupItem.value = null
    else if (isExpanded(item)) onItemClick(item)
  } else if (event.key === 'Enter' || event.key === ' ') {
    if (props.collapsed && item.children?.length) void openCollapsedPopup(item, current)
    else onItemClick(item)
  } else {
    return
  }
  event.preventDefault()
}

function onChildSelect(item: MenuItemOption) {
  selected.value = item.key
  emit('select', item)
}

function onItemMouseEnter(item: MenuItemOption, e: MouseEvent) {
  if (props.collapsed && item.children?.length) {
    if (popupTimer) {
      clearTimeout(popupTimer)
      popupTimer = null
    }
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    popupItem.value = item
    popupStyle.value = { position: 'fixed', left: `${rect.right}px`, top: `${rect.top}px` }
  }
}

function onItemMouseLeave(_item: MenuItemOption) {
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

function onCollapsedPopupSelect(item: MenuItemOption) {
  selected.value = item.key
  emit('select', item)
  popupItem.value = null
}
</script>

<style lang="less">
.yiz-menu {
  user-select: none;
  border-right: 1px solid var(--yiz-color-border, #d9d9d9);
  background: var(--yiz-color-bg-container);
  padding: 4px 0;
  transition: width var(--yiz-motion-duration-default);
  min-height: 100%;
}

.yiz-menu-dark {
  background: rgb(0, 20, 40);
  color: var(--yiz-color-text-inverse);
  border-right-color: rgb(0, 20, 40);

  .yiz-menu-item {
    color: var(--yiz-color-text-inverse);

    &:hover {
      background: rgba(255, 255, 255, 0.12);
    }

    &.yiz-menu-item-selected {
      background: var(--yiz-color-primary-dark);
      color: var(--yiz-color-text-inverse);
    }

    &.yiz-menu-item-ancestor {
      color: var(--yiz-color-text-inverse);
    }
  }

  .yiz-menu-divider {
    color: rgba(255, 255, 255, 0.45);

    &::after {
      border-top-color: rgba(255, 255, 255, 0.16);
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

  .yiz-menu-divider {
    margin: 8px 12px;

    .yiz-menu-divider-name {
      display: none;
    }
  }
}

.yiz-menu-divider {
  display: block;
  min-height: 1px;
  margin: 12px 20px 8px;
  color: var(--yiz-color-text-tertiary);
  font-size: 14px;
  line-height: 20px;
  pointer-events: none;

  &::after {
    content: '';
    display: block;
    width: 100%;
    border-top: 1px solid var(--yiz-color-border, #d9d9d9);
  }
}

.yiz-menu-divider-name {
  display: block;
  margin-bottom: 8px;
}

.yiz-menu-item {
  display: flex;
  align-items: center;
  height: var(--yiz-control-height-large);
  margin: 4px;
  border-radius: var(--yiz-pane-item-border-radius);
  padding: 0 12px;
  font-size: 14px;
  color: var(--yiz-color-text-primary);
  cursor: pointer;
  transition: background var(--yiz-motion-duration-default);
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
