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
          'yiz-context-menu-item-hover': hoveredSubmenu === item.value
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
        <svg viewBox="0 0 16 16" width="10" height="10" class="yiz-context-menu-sub-arrow">
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            stroke-width="1.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div
          v-if="hoveredSubmenu === item.value && item.children?.length"
          class="yiz-context-menu-sub"
          :style="submenuStyle"
        >
          <ContextMenu :items="item.children" @select="onChildSelect" />
        </div>
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
          <svg v-if="isChecked(item)" viewBox="0 0 16 16" width="14" height="14">
            <path
              d="M3 8l3 3 6-6"
              stroke="currentColor"
              stroke-width="2"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
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
          <svg v-if="isChecked(item)" viewBox="0 0 16 16" width="14" height="14">
            <circle cx="8" cy="8" r="4" fill="currentColor" />
          </svg>
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
import { computed, ref, useSlots } from 'vue'
import ContextMenuOptionComp from '../context-menu-option/ContextMenuOption.vue'
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
    width: 200
  }
)

const menuWidth = computed(() => {
  const w = props.width
  const num = typeof w === 'number' ? w : parseFloat(w as string)
  return `${num}px`
})

defineSlots<{
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

const slotItems = computed(() => {
  const nodes = slots.default?.() ?? []
  const items: ContextMenuItem[] = []
  for (const vnode of nodes) {
    if (vnode.type === ContextMenuOptionComp && vnode.props) {
      const p = vnode.props as Record<string, any>
      if (p.item) {
        items.push({
          ...p.item,
          type: p.type ?? p.item.type ?? 'item',
          disabled: p.disabled ?? p.item.disabled,
          checked: p.checked ?? p.item.checked,
          icon: p.icon ?? p.item.icon,
          children: p.children ?? p.item.children
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
          children: p.children
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
  const estimatedHeight = Math.min((item.children?.length || 0) * 36 + 8, 300)
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
  background: #fff;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  position: relative;
}

.yiz-context-menu-sub {
  position: absolute;
  left: 100%;
  top: 0;
}

.yiz-context-menu-item {
  display: flex;
  align-items: center;
  height: 24px;
  border-radius: 4px;
  margin: 4px;
  padding: 0 12px;
  font-size: 14px;
  color: #333;
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
    color: #c0c4cc;
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
