<template>
  <div class="yiz-context-menu" :style="{ width: menuWidth }" @mouseleave="onMenuLeave">
    <template v-for="(item, idx) in allItems" :key="idx">
      <!-- divider -->
      <div v-if="item.type === 'divider'" class="yiz-context-menu-divider" />

      <!-- submenu -->
      <div
        v-else-if="item.type === 'submenu'"
        class="yiz-context-menu-item"
        :class="{
          'yiz-context-menu-item-disabled': item.disabled,
          'yiz-context-menu-item-hover': hoveredSubmenu === item.value,
        }"
        @mouseenter="onSubmenuEnter(item, $event)"
        @click.stop
      >
        <span class="yiz-context-menu-item-content">
          <span class="yiz-context-menu-item-icon">
            <template v-if="item.icon">
              <template v-if="typeof item.icon === 'string'">
                <slot name="icon" :icon="item.icon" :item="item" />
              </template>
              <IconRenderer v-else :content="item.icon" />
            </template>
          </span>
          <slot name="item" :item="item" :index="idx">
            {{ item.label }}
          </slot>
        </span>
        <Icon class="yiz-context-menu-sub-arrow" size="16" :icon="ChevronRight16Regular" />
        <Transition name="yiz-context-menu-sub">
          <div
            v-if="hoveredSubmenu === item.value && item.children?.length"
            class="yiz-context-menu-sub"
            :style="submenuStyle"
          >
            <ContextMenu :items="item.children" @select="onChildSelect" />
          </div>
        </Transition>
      </div>

      <!-- checkbox -->
      <div
        v-else-if="item.type === 'checkbox'"
        class="yiz-context-menu-item"
        :class="{ 'yiz-context-menu-item-disabled': item.disabled }"
        @click="onCheckboxClick(item)"
        @mouseenter="onItemHover"
      >
        <span class="yiz-context-menu-item-check">
          <Icon v-if="isChecked(item)" size="16" :icon="Checkmark16Regular" />
        </span>
        <slot name="item" :item="item" :index="idx">
          {{ item.label }}
        </slot>
      </div>

      <!-- radiogroup -->
      <div
        v-else-if="item.type === 'radiogroup'"
        class="yiz-context-menu-item"
        :class="{ 'yiz-context-menu-item-disabled': item.disabled }"
        @click="onRadioClick(item)"
        @mouseenter="onItemHover"
      >
        <span class="yiz-context-menu-item-radio">
          <Icon v-if="isChecked(item)" size="16" :icon="CheckmarkCircle16Regular" />
        </span>
        <slot name="item" :item="item" :index="idx">
          {{ item.label }}
        </slot>
      </div>

      <!-- default item -->
      <div
        v-else
        class="yiz-context-menu-item"
        :class="{ 'yiz-context-menu-item-disabled': item.disabled }"
        @click="onItemClick(item)"
        @mouseenter="onItemHover"
      >
        <span class="yiz-context-menu-item-content">
          <span class="yiz-context-menu-item-icon">
            <template v-if="item.icon">
              <template v-if="typeof item.icon === 'string'">
                <slot name="icon" :icon="item.icon" :item="item" />
              </template>
              <IconRenderer v-else :content="item.icon" />
            </template>
          </span>
          <slot name="item" :item="item" :index="idx">
            {{ item.label }}
          </slot>
        </span>
      </div>
    </template>
    <div style="display: none"><slot /></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, Fragment, ref, useSlots } from 'vue'
import { Checkmark16Regular, CheckmarkCircle16Regular, ChevronRight16Regular } from '@vicons/fluent'
import ContextMenuOptionComp from '../context-menu-option/ContextMenuOption.vue'
import { Icon } from '../icon'
import IconRenderer from '../menu/IconRenderer.vue'

export interface ContextMenuItem {
  label?: string
  value?: any
  icon?: string | (() => any) | any
  type?: 'item' | 'divider' | 'submenu' | 'checkbox' | 'radiogroup'
  name?: string
  disabled?: boolean
  checked?: boolean
  children?: ContextMenuItem[]
}

const props = withDefaults(
  defineProps<{
    items?: ContextMenuItem[]
    width?: number | string
  }>(),
  {
    items: () => [],
    width: 200,
  },
)

const menuWidth = computed(() => {
  const w = props.width
  const num = typeof w === 'number' ? w : parseFloat(w as string)
  return `${num}px`
})

defineSlots<{
  default?: () => any
  item?: (props: { item: ContextMenuItem; index: number }) => any
  icon?: (props: { icon: string; item: ContextMenuItem }) => any
}>()

const emit = defineEmits<{
  select: [item: ContextMenuItem]
}>()

const slots = useSlots()

const checkedValues = ref<Set<any>>(new Set())
const radioValues = ref<Map<string, any>>(new Map())
const hoveredSubmenu = ref<any>(null)
const submenuStyle = ref<Record<string, string>>({})

// 递归展平 Fragment，确保包裹组件或 v-for 生成的 ContextMenuOption 能被正确提取
function collectOptionVNodes(nodes: any[]): any[] {
  const result: any[] = []
  for (const vnode of nodes) {
    if (vnode && (vnode as any).type === Fragment) {
      const children = (vnode as any).children as any[]
      if (children) {
        result.push(...collectOptionVNodes(children))
      }
    } else if (vnode && vnode.type === ContextMenuOptionComp) {
      result.push(vnode)
    }
  }
  return result
}

const slotItems = computed(() => {
  const nodes = collectOptionVNodes(slots.default?.() ?? [])
  const items: ContextMenuItem[] = []
  for (const vnode of nodes) {
    if (vnode.props) {
      const p = vnode.props as Record<string, any>
      if (p.item) {
        items.push({
          ...p.item,
          type: p.type ?? p.item.type ?? 'item',
          disabled: p.disabled ?? p.item.disabled,
          checked: p.checked ?? p.item.checked,
          icon: p.icon ?? p.item.icon,
          children: p.children ?? p.item.children,
        })
      } else {
        items.push({
          label: p.label,
          value: p.value,
          icon: p.icon,
          type: p.type ?? 'item',
          name: p.name,
          disabled: p.disabled,
          checked: p.checked,
          children: p.children,
        })
      }
    }
  }
  return items
})

const allItems = computed(() => {
  return slotItems.value.length > 0 ? slotItems.value : props.items
})

function isChecked(item: ContextMenuItem): boolean {
  if (item.type === 'radiogroup' && item.name) {
    return radioValues.value.get(item.name) === item.value
  }
  if (item.type === 'checkbox') {
    return checkedValues.value.has(item.value) || !!item.checked
  }
  return !!item.checked
}

function onCheckboxClick(item: ContextMenuItem) {
  if (item.disabled) return
  const key = item.value
  if (checkedValues.value.has(key)) {
    checkedValues.value.delete(key)
  } else {
    checkedValues.value.add(key)
  }
  checkedValues.value = new Set(checkedValues.value)
  emit('select', { ...item, checked: checkedValues.value.has(key) })
}

function onRadioClick(item: ContextMenuItem) {
  if (item.disabled) return
  if (item.name) {
    radioValues.value.set(item.name, item.value)
    radioValues.value = new Map(radioValues.value)
  }
  emit('select', { ...item, checked: true })
}

function onItemClick(item: ContextMenuItem) {
  if (item.disabled) return
  emit('select', item)
}

function onSubmenuEnter(item: ContextMenuItem, e: MouseEvent) {
  if (item.disabled) return
  hoveredSubmenu.value = item.value

  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const menuW = typeof props.width === 'number' ? props.width : parseFloat(props.width as string) || 200
  const gap = 4

  const s: Record<string, string> = {}

  // horizontal: check if submenu fits to the right
  if (rect.right + menuW + gap > window.innerWidth) {
    s.right = '100%'
    s.left = 'auto'
  }

  // vertical: keep submenu within viewport bottom
  const estimatedHeight = Math.min((item.children?.length || 0) * 32, 300)
  if (rect.top + estimatedHeight > window.innerHeight) {
    s.top = 'auto'
    s.bottom = '0'
  }

  submenuStyle.value = s
}

function onMenuLeave() {
  hoveredSubmenu.value = null
  submenuStyle.value = {}
}

function onItemHover() {
  hoveredSubmenu.value = null
  submenuStyle.value = {}
}

function onChildSelect(item: ContextMenuItem) {
  emit('select', item)
}
</script>

<style lang="less">
.yiz-context-menu {
  user-select: none;
  background: var(--yiz-color-bg-elevated);
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-pane-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  position: relative;
}

.yiz-context-menu.is-host {
  opacity: 0;
  transform: scale(0.96);
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}

.yiz-context-menu.is-host.is-visible {
  opacity: 1;
  transform: scale(1);
}

.yiz-context-menu-sub-enter-active,
.yiz-context-menu-sub-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}

.yiz-context-menu-sub-enter-from,
.yiz-context-menu-sub-leave-to {
  opacity: 0;
  transform: scale(0.94);
}

.yiz-context-menu-sub {
  position: absolute;
  left: 100%;
  top: 0;
}

.yiz-context-menu-item {
  display: flex;
  align-items: center;
  height: var(--yiz-control-height-small);
  border-radius: var(--yiz-pane-item-border-radius);
  margin: 4px;
  padding: 0 12px;
  font-size: 14px;
  color: var(--yiz-color-text-primary);
  cursor: pointer;
  transition: background 0.15s;
  white-space: nowrap;
  position: relative;

  &:hover {
    background: var(--yiz-color-hover-bg);
  }

  &.yiz-context-menu-item-hover {
    background: var(--yiz-color-hover-bg);
  }

  &.yiz-context-menu-item-disabled {
    color: var(--yiz-color-text-disabled);
    cursor: not-allowed;

    &:hover {
      background: transparent;
    }
  }
}

.yiz-context-menu-item-content {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  flex: 1;
}

.yiz-context-menu-item-icon {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}

.yiz-context-menu-item-check,
.yiz-context-menu-item-radio {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  flex-shrink: 0;
  color: var(--yiz-color-primary);
}

.yiz-context-menu-sub-arrow {
  margin-left: 12px;
  flex-shrink: 0;
  opacity: 0.5;
}

.yiz-context-menu-divider {
  margin: 4px 0;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
}
</style>
