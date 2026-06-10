<template>
  <div
    class="yiz-menu"
    :class="{ 'yiz-menu-sub': isSub, 'yiz-menu-collapsed': collapsed }"
    :style="{ width: collapsed ? '56px' : menuWidth }"
  >
    <template v-for="(item, idx) in allItems" :key="idx">
      <!-- collapsed item without children: wrap in Tooltip -->
      <Tooltip
        v-if="collapsed && !item.children?.length"
        :content="item.label"
        placement="right"
      >
        <div
          class="yiz-menu-item"
          :class="{ 'yiz-menu-item-selected': isSelected(item) }"
          @click="onItemClick(item)"
        >
          <span class="yiz-menu-item-content">
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
          </span>
          <svg
            v-if="item.children?.length"
            class="yiz-menu-item-arrow"
            :class="{ 'yiz-menu-item-arrow-expanded': isExpanded(item), 'yiz-menu-item-arrow-hidden': collapsed }"
            viewBox="0 0 16 16"
            width="12"
            height="12"
          >
            <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </Tooltip>

      <!-- collapsed with children, non-collapsed, or popup mode -->
      <div
        v-else
        class="yiz-menu-item"
        :class="{ 'yiz-menu-item-selected': isSelected(item) }"
        @click="onItemClick(item)"
        @mouseenter="onItemMouseEnter(item, $event)"
        @mouseleave="onItemMouseLeave(item)"
      >
        <span class="yiz-menu-item-content">
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
        </span>
        <svg
          v-if="item.children?.length"
          class="yiz-menu-item-arrow"
          :class="{ 'yiz-menu-item-arrow-expanded': isExpanded(item), 'yiz-menu-item-arrow-hidden': collapsed }"
          viewBox="0 0 16 16"
          width="12"
          height="12"
        >
          <path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <!-- expanded submenu (non-collapsed, non-popup) -->
      <Transition v-if="!collapsed && !popup" name="yiz-menu-sub-slide">
        <div v-if="item.children?.length && isExpanded(item)" class="yiz-menu-sub">
          <Menu
            is-sub
            :items="item.children"
            :model-value="modelValue"
            :width="props.width"
            @select="onChildSelect"
          />
        </div>
      </Transition>
    </template>
    <div style="display: none"><slot /></div>
  </div>

  <!-- collapsed popup submenu -->
  <Teleport v-if="collapsed && popupItem" to="body">
    <div class="yiz-menu-popup" :style="popupStyle" @mouseenter="onCollapsedPopupEnter" @mouseleave="onCollapsedPopupLeave">
      <Menu
        popup
        :items="popupItem.children"
        :model-value="modelValue"
        :width="200"
        @select="onCollapsedPopupSelect"
      />
    </div>
  </Teleport>

  <!-- popup mode nested submenu -->
  <Teleport v-if="popup && popupSubItem" to="body">
    <div class="yiz-menu-popup-sub" :style="popupSubStyle" @mouseenter="onPopupSubEnterNested" @mouseleave="onPopupSubLeaveNested">
      <Menu
        popup
        :items="popupSubItem.children"
        :model-value="modelValue"
        :width="200"
        @select="onPopupSubSelect"
      />
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots } from 'vue'
import MenuOptionComp from '../menu-option/MenuOption.vue'
import IconRenderer from './IconRenderer.vue'
import Tooltip from '../tooltip/Tooltip.vue'

export interface MenuItem {
  label: string
  value: any
  children?: MenuItem[]
  icon?: string | (() => any) | any
}

const props = withDefaults(
  defineProps<{
    items?: MenuItem[]
    width?: number | string
    isSub?: boolean
    collapsed?: boolean
    popup?: boolean
  }>(),
  {
    items: () => [],
    width: 256,
    isSub: false,
    collapsed: false,
    popup: false
  }
)

const menuWidth = computed(() => {
  const w = props.width
  const num = typeof w === 'number' ? w : parseFloat(w as string)
  return `${num}px`
})

defineSlots<{
  item?: (props: { item: MenuItem; index: number }) => any
  icon?: (props: { icon: string; item: MenuItem }) => any
}>()

const emit = defineEmits<{
  select: [item: MenuItem]
}>()

const modelValue = defineModel<any>('modelValue')

const expandedKeys = ref<Set<any>>(new Set())

// collapsed mode: popup submenu state
const popupItem = ref<MenuItem | null>(null)
const popupStyle = ref<Record<string, string>>({})
let popupTimer: ReturnType<typeof setTimeout> | null = null

// popup mode: nested submenu state
const popupSubItem = ref<MenuItem | null>(null)
const popupSubStyle = ref<Record<string, string>>({})
let popupSubTimer: ReturnType<typeof setTimeout> | null = null

const slots = useSlots()

const slotItems = computed(() => {
  const nodes = slots.default?.() ?? []
  const items: MenuItem[] = []
  for (const vnode of nodes) {
    if (vnode.type === MenuOptionComp && vnode.props) {
      const p = vnode.props as Record<string, any>
      if (p.item) {
        items.push({ ...p.item, children: p.children ?? p.item.children, icon: p.icon ?? p.item.icon })
      } else {
        items.push({ label: p.label, value: p.value, children: p.children, icon: p.icon })
      }
    }
  }
  return items
})

const allItems = computed(() => {
  return slotItems.value.length > 0 ? slotItems.value : props.items
})

function isSelected(item: MenuItem) {
  return modelValue.value != null && item.value === modelValue.value
}

function isExpanded(item: MenuItem) {
  return expandedKeys.value.has(item.value)
}

function onItemClick(item: MenuItem) {
  if (item.children?.length) {
    if (props.collapsed || props.popup) return
    const key = item.value
    if (expandedKeys.value.has(key)) {
      expandedKeys.value.delete(key)
    } else {
      expandedKeys.value.add(key)
    }
    expandedKeys.value = new Set(expandedKeys.value)
  } else {
    modelValue.value = item.value
    emit('select', item)
  }
}

function onChildSelect(item: MenuItem) {
  emit('select', item)
}

// combined mouseenter: handles both collapsed popup and popup mode
function onItemMouseEnter(item: MenuItem, e: MouseEvent) {
  if (props.collapsed && item.children?.length) {
    if (popupTimer) { clearTimeout(popupTimer); popupTimer = null }
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    popupItem.value = item
    popupStyle.value = {
      position: 'fixed',
      left: `${rect.right}px`,
      top: `${rect.top}px`
    }
  } else if (props.popup) {
    if (popupSubTimer) { clearTimeout(popupSubTimer); popupSubTimer = null }
    if (item.children?.length) {
      const el = e.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      const menuW = 200
      const gap = 4
      const s: Record<string, string> = {
        position: 'fixed',
        left: `${rect.right}px`,
        top: `${rect.top}px`
      }
      if (rect.right + menuW + gap > window.innerWidth) {
        s.left = `${rect.left - menuW - gap}px`
      }
      const estimatedHeight = Math.min((item.children?.length || 0) * 40 + 8, 400)
      if (rect.top + estimatedHeight > window.innerHeight) {
        s.top = 'auto'
        s.bottom = `${window.innerHeight - rect.bottom}px`
      }
      popupSubItem.value = item
      popupSubStyle.value = s
    } else {
      popupSubItem.value = null
    }
  }
}

// combined mouseleave: handles both collapsed popup and popup mode
function onItemMouseLeave(_item: MenuItem) {
  if (props.collapsed) {
    popupTimer = setTimeout(() => {
      popupItem.value = null
    }, 100)
  } else if (props.popup) {
    popupSubTimer = setTimeout(() => {
      popupSubItem.value = null
    }, 100)
  }
}

// collapsed popup
function onCollapsedPopupEnter() {
  if (popupTimer) { clearTimeout(popupTimer); popupTimer = null }
}

function onCollapsedPopupLeave(e: MouseEvent) {
  const related = e.relatedTarget as HTMLElement | null
  if (related?.closest('.yiz-menu-popup-sub')) return
  popupItem.value = null
}

function onCollapsedPopupSelect(item: MenuItem) {
  emit('select', item)
  popupItem.value = null
}

// popup mode nested submenu
function onPopupSubEnterNested() {
  if (popupSubTimer) { clearTimeout(popupSubTimer); popupSubTimer = null }
}

function onPopupSubLeaveNested(e: MouseEvent) {
  const related = e.relatedTarget as HTMLElement | null
  if (related?.closest('.yiz-menu-popup-sub')) return
  popupSubItem.value = null
}

function onPopupSubSelect(item: MenuItem) {
  emit('select', item)
  popupSubItem.value = null
}
</script>

<style lang="less">
.yiz-menu {
  user-select: none;
  border-right: 1px solid var(--yiz-color-border, #d9d9d9);
  background: #fff;
  padding: 4px 0;
  transition: width 0.2s;
}

.yiz-menu-collapsed {
  .yiz-tooltip {
    display: flex;
  }

  .yiz-menu-item {
    justify-content: center;
    flex: 1;
  }

  .yiz-menu-item-content {
    justify-content: center;
    gap: 0;
  }

  .yiz-menu-item-arrow {
    display: none;
  }
}

.yiz-menu-sub {
  border: none;
  padding: 0;
  overflow: hidden;
}

.yiz-menu-sub-slide-enter-active,
.yiz-menu-sub-slide-leave-active {
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-menu-sub-slide-enter-from,
.yiz-menu-sub-slide-leave-to {
  max-height: 0;
}

.yiz-menu-sub-slide-enter-to,
.yiz-menu-sub-slide-leave-from {
  max-height: 500px;
}

.yiz-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover {
    background: var(--yiz-color-primary-light8);
  }

  &.yiz-menu-item-selected {
    background: var(--yiz-color-primary-light8);
    color: var(--yiz-color-primary);
  }
}

.yiz-menu-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.yiz-menu-item-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.yiz-menu-item-label {
  overflow: hidden;
  white-space: nowrap;
  transition: opacity 0.2s, max-width 0.2s;
  max-width: 200px;

  &.yiz-menu-item-label-hidden {
    opacity: 0;
    max-width: 0;
  }
}

.yiz-menu-item-arrow {
  margin-left: 8px;
  flex-shrink: 0;
  transition: transform 0.2s, opacity 0.2s;

  &.yiz-menu-item-arrow-expanded {
    transform: rotate(90deg);
  }

  &.yiz-menu-item-arrow-hidden {
    opacity: 0;
  }
}

.yiz-menu .yiz-menu .yiz-menu-item {
  padding-left: 28px;
}

// collapsed popup submenu
.yiz-menu-popup {
  z-index: 3000;

  > .yiz-menu {
    border: 1px solid var(--yiz-color-border, #d9d9d9);
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}

// popup mode nested submenu
.yiz-menu-popup-sub {
  z-index: 3100;

  > .yiz-menu {
    border: 1px solid var(--yiz-color-border, #d9d9d9);
    border-radius: 4px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
}
</style>
