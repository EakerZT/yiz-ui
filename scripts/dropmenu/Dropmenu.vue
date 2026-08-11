<template>
  <component :is="renderTrigger()" />

  <DropmenuPanel
    :id="menuId"
    ref="panelRef"
    :visible="open"
    :options="allOptions"
    :position="popupStyle"
    @select="onSelect"
  >
    <template #icon="scope"><slot name="icon" v-bind="scope" /></template>
    <template #item="scope"><slot name="item" v-bind="scope" /></template>
  </DropmenuPanel>
</template>

<script lang="ts" setup>
import {
  cloneVNode,
  computed,
  Fragment,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  useId,
  useSlots,
  watch,
  type VNode,
} from 'vue'
import { ChevronDown16Regular } from '@vicons/fluent'
import DropmenuItemComp from '../dropmenu-item/DropmenuItem.vue'
import { Icon } from '../icon'
import { findFirstTriggerVNode } from '../triggerVNode'
import { useZIndexManager } from '../zIndex'
import DropmenuPanel from './DropmenuPanel.vue'
import type { DropmenuOption } from './types'

const props = withDefaults(
  defineProps<{
    options?: DropmenuOption[]
    label?: string
    disabled?: boolean
    width?: number | string
    placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
  }>(),
  {
    options: () => [],
    label: '',
    disabled: false,
    width: undefined,
    placement: 'bottom-start',
  },
)

defineSlots<{
  default?: () => any
  trigger?: (props: { open: boolean }) => any
  item?: (props: { item: DropmenuOption; index: number }) => any
  icon?: (props: { icon: string; item: DropmenuOption }) => any
}>()

const emit = defineEmits<{
  select: [item: DropmenuOption]
}>()

const slots = useSlots()
const open = ref(false)
const triggerRef = ref<HTMLElement>()
const panelRef = ref<InstanceType<typeof DropmenuPanel>>()
const menuId = useId()
let pendingFocus: 'first' | 'last' | null = null

function updateTriggerElement(vnode: VNode) {
  triggerRef.value = vnode.el instanceof HTMLElement ? vnode.el : undefined
}

function clearTriggerElement(vnode: VNode) {
  if (triggerRef.value === vnode.el) {
    triggerRef.value = undefined
  }
}
const popupStyle = ref<Record<string, string>>({})
const currentZIndex = ref(0)
const zIndexManager = useZIndexManager()

function renderTrigger(): VNode {
  const children = slots.trigger?.({ open: open.value }) ?? []
  const child = findFirstTriggerVNode(children)
  if (child) {
    return cloneVNode(child, {
      class: { 'yiz-dropmenu-disabled': props.disabled, 'yiz-dropmenu-open': open.value },
      onClick: onTriggerClick,
      onKeydown: onTriggerKeydown,
      'aria-haspopup': 'menu',
      'aria-expanded': open.value,
      'aria-controls': menuId,
      'aria-disabled': props.disabled || undefined,
      onVnodeMounted: updateTriggerElement,
      onVnodeUpdated: updateTriggerElement,
      onVnodeBeforeUnmount: clearTriggerElement,
    })
  }
  return h(
    'button',
    {
      type: 'button',
      class: ['yiz-dropmenu-trigger', { 'yiz-dropmenu-disabled': props.disabled, 'yiz-dropmenu-open': open.value }],
      disabled: props.disabled,
      onClick: onTriggerClick,
      onKeydown: onTriggerKeydown,
      'aria-haspopup': 'menu',
      'aria-expanded': open.value,
      'aria-controls': menuId,
      onVnodeMounted: updateTriggerElement,
      onVnodeUpdated: updateTriggerElement,
      onVnodeBeforeUnmount: clearTriggerElement,
    },
    [
      h('span', {}, props.label),
      h(Icon, {
        class: ['yiz-dropmenu-arrow', { 'yiz-dropmenu-arrow-open': open.value }],
        size: '16',
        icon: ChevronDown16Regular,
      }),
    ],
  )
}

function collectOptionVNodes(nodes: any[]): any[] {
  const result: any[] = []
  for (const vnode of nodes) {
    if (vnode && (vnode as any).type === Fragment) {
      const children = (vnode as any).children as any[]
      if (children) {
        result.push(...collectOptionVNodes(children))
      }
    } else if (vnode && vnode.type === DropmenuItemComp) {
      result.push(vnode)
    }
  }
  return result
}

const slotOptions = computed(() => {
  const nodes = collectOptionVNodes(slots.default?.() ?? [])
  const options: DropmenuOption[] = []
  for (const vnode of nodes) {
    if (vnode.props) {
      const p = vnode.props as Record<string, any>
      if (p.item) {
        const item = p.item as DropmenuOption
        options.push({
          ...item,
          type: p.type ?? item.type,
          children: p.children ?? item.children,
          icon: p.icon ?? item.icon,
          disabled: p.disabled ?? item.disabled,
          key: vnode.key ?? p.key ?? item.key,
        })
      } else {
        options.push({
          label: p.label,
          key: vnode.key ?? p.key,
          type: p.type,
          children: p.children,
          icon: p.icon,
          disabled: p.disabled,
        })
      }
    }
  }
  return options
})

const allOptions = computed(() => {
  return slotOptions.value.length > 0 ? slotOptions.value : props.options
})

function toCssSize(value: number | string | undefined) {
  if (value == null || value === '') return undefined
  return typeof value === 'number' ? `${value}px` : value
}

function updatePopupPosition() {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  const panelRect = panelRef.value?.getElement()?.getBoundingClientRect()
  const gap = 4
  const margin = 8
  const width = toCssSize(props.width)
  const popupWidth = panelRect?.width || Math.max(160, rect.width)
  const popupHeight = panelRect?.height || Math.min(allOptions.value.length * 40, 360)
  const preferTop = props.placement.startsWith('top')
  const alignEnd = props.placement.endsWith('end')
  const style: Record<string, string> = {
    position: 'fixed',
    zIndex: `${currentZIndex.value + 1}`,
    minWidth: `${Math.max(160, rect.width)}px`,
    maxWidth: `calc(100vw - ${margin * 2}px)`,
    maxHeight: `calc(100vh - ${margin * 2}px)`,
  }

  if (width) {
    style.width = width
  }

  let left = alignEnd ? rect.right - popupWidth : rect.left
  if (left + popupWidth > window.innerWidth - margin) {
    left = window.innerWidth - popupWidth - margin
  }
  if (left < margin) {
    left = margin
  }
  style.left = `${left}px`

  const roomAbove = rect.top - gap - margin
  const roomBelow = window.innerHeight - rect.bottom - gap - margin
  const placeTop = preferTop
    ? roomAbove >= popupHeight || roomAbove > roomBelow
    : roomBelow < popupHeight && roomAbove > roomBelow
  const desiredTop = placeTop ? rect.top - gap - popupHeight : rect.bottom + gap
  const top = Math.max(margin, Math.min(desiredTop, window.innerHeight - popupHeight - margin))
  style.top = `${top}px`

  popupStyle.value = style
}

async function openMenu(focus: 'first' | 'last' | null = null) {
  if (props.disabled) return
  currentZIndex.value = zIndexManager.next()
  pendingFocus = focus
  open.value = true
  await nextTick()
  updatePopupPosition()
  await nextTick()
  updatePopupPosition()
  panelRef.value?.updateOpenSubmenuPosition()
  if (pendingFocus === 'last') {
    panelRef.value?.focusLast()
  } else if (pendingFocus === 'first') {
    panelRef.value?.focusFirst()
  }
  pendingFocus = null
}

function closeMenu(restoreFocus = false) {
  open.value = false
  pendingFocus = null
  if (restoreFocus) {
    nextTick(() => triggerRef.value?.focus())
  }
}

function onTriggerClick(e: MouseEvent) {
  if (props.disabled) return
  if (open.value) {
    closeMenu()
  } else {
    openMenu(e.detail === 0 ? 'first' : null)
  }
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (props.disabled || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return
  e.preventDefault()
  if (open.value) {
    if (e.key === 'ArrowUp') {
      panelRef.value?.focusLast()
    } else {
      panelRef.value?.focusFirst()
    }
    return
  }
  openMenu(e.key === 'ArrowUp' ? 'last' : 'first')
}

function onSelect(item: DropmenuOption) {
  emit('select', item)
  closeMenu(true)
}

function onClickOutside(e: MouseEvent) {
  if (!open.value) return
  const target = e.target as HTMLElement
  if (triggerRef.value?.contains(target)) return
  if (target.closest('.yiz-dropmenu-panel')) return
  closeMenu()
}

function onKeydown(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') {
    closeMenu(true)
  } else if (e.key === 'Tab') {
    closeMenu()
    triggerRef.value?.focus()
  }
}

function onReposition() {
  if (open.value) {
    updatePopupPosition()
    nextTick(() => panelRef.value?.updateOpenSubmenuPosition())
  }
}

watch([allOptions, () => props.width, () => props.placement], onReposition, { deep: true })
watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) closeMenu()
  },
)

onMounted(() => {
  document.addEventListener('click', onClickOutside, true)
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onReposition, true)
  window.addEventListener('resize', onReposition)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside, true)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onReposition, true)
  window.removeEventListener('resize', onReposition)
})
</script>

<style lang="less">
.yiz-dropmenu-disabled {
  cursor: not-allowed;
}

.yiz-dropmenu-trigger {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  gap: 6px;
  height: var(--yiz-control-height-default);
  padding: 0 12px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 4px;
  background: var(--yiz-color-bg-container);
  color: var(--yiz-color-text-primary);
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition:
    border-color 0.3s,
    color 0.3s,
    box-shadow 0.3s;

  &:hover:not(:disabled) {
    border-color: var(--yiz-color-primary);
    color: var(--yiz-color-primary);
  }

  &:disabled {
    background: var(--yiz-color-bg-muted);
    color: var(--yiz-color-text-disabled);
    cursor: not-allowed;
  }

  &.yiz-dropmenu-open {
    border-color: var(--yiz-color-primary);
    color: var(--yiz-color-primary);
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }
}

.yiz-dropmenu-arrow {
  flex-shrink: 0;
  transition: transform 0.2s;
}

.yiz-dropmenu-arrow-open {
  transform: rotate(180deg);
}
</style>
