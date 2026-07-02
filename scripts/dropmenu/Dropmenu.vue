<template>
  <component :is="triggerNode" />

  <DropmenuPanel :visible="open" :options="allOptions" :position="popupStyle" @select="onSelect">
    <template #icon="scope"><slot name="icon" v-bind="scope" /></template>
    <template #item="scope"><slot name="item" v-bind="scope" /></template>
  </DropmenuPanel>
</template>

<script lang="ts" setup>
import { cloneVNode, computed, Fragment, h, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch, type VNode } from 'vue'
import { ChevronDown16Regular } from '@vicons/fluent'
import DropmenuItemComp from '../dropmenu-item/DropmenuItem.vue'
import { Icon } from '../icon'
import { nextZIndex } from '../zIndex'
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
    placement: 'bottom-start'
  }
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
function setTriggerRef(el: any) {
  if (el instanceof HTMLElement) {
    triggerRef.value = el
  } else if (el?.$el instanceof HTMLElement) {
    triggerRef.value = el.$el
  } else {
    triggerRef.value = undefined
  }
}
const popupStyle = ref<Record<string, string>>({})
const currentZIndex = ref(0)

const triggerNode = computed<VNode>(() => {
  const children = slots.trigger?.({ open: open.value }) ?? []
  const child = children[0] as VNode | undefined
  if (child) {
    return cloneVNode(
      child,
      {
        class: { 'yiz-dropmenu-disabled': props.disabled, 'yiz-dropmenu-open': open.value },
        onClick: onTriggerClick,
        ref: setTriggerRef
      },
      true
    )
  }
  return h(
    'button',
    {
      ref: setTriggerRef,
      type: 'button',
      class: ['yiz-dropmenu-trigger', { 'yiz-dropmenu-disabled': props.disabled, 'yiz-dropmenu-open': open.value }],
      disabled: props.disabled,
      onClick: onTriggerClick
    },
    [
      h('span', {}, props.label),
      h(Icon, {
        class: ['yiz-dropmenu-arrow', { 'yiz-dropmenu-arrow-open': open.value }],
        size: '16',
        icon: ChevronDown16Regular
      })
    ]
  )
})

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
          key: vnode.key ?? p.key ?? item.key
        })
      } else {
        options.push({
          label: p.label,
          key: vnode.key ?? p.key,
          type: p.type,
          children: p.children,
          icon: p.icon,
          disabled: p.disabled
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
  const gap = 4
  const margin = 8
  const width = toCssSize(props.width)
  const popupWidth = props.width == null ? Math.max(160, rect.width) : Number.parseFloat(String(props.width))
  const estimatedHeight = Math.min(allOptions.value.length * 32 + 8, 360)
  const placeTop = props.placement.startsWith('top')
  const alignEnd = props.placement.endsWith('end')
  const style: Record<string, string> = {
    position: 'fixed',
    zIndex: `${currentZIndex.value + 1}`,
    minWidth: `${Math.max(160, rect.width)}px`
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

  if (placeTop) {
    style.bottom = `${window.innerHeight - rect.top + gap}px`
  } else if (rect.bottom + gap + estimatedHeight > window.innerHeight - margin && rect.top > estimatedHeight) {
    style.bottom = `${window.innerHeight - rect.top + gap}px`
  } else {
    style.top = `${rect.bottom + gap}px`
  }

  popupStyle.value = style
}

function openMenu() {
  if (props.disabled) return
  currentZIndex.value = nextZIndex()
  open.value = true
  nextTick(updatePopupPosition)
}

function closeMenu() {
  open.value = false
}

function onTriggerClick() {
  if (props.disabled) return
  if (open.value) {
    closeMenu()
  } else {
    openMenu()
  }
}

function onSelect(item: DropmenuOption) {
  emit('select', item)
  closeMenu()
}

function onClickOutside(e: MouseEvent) {
  if (!open.value) return
  const target = e.target as HTMLElement
  if (triggerRef.value?.contains(target)) return
  if (target.closest('.yiz-dropmenu-panel')) return
  closeMenu()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closeMenu()
  }
}

function onReposition() {
  if (open.value) {
    updatePopupPosition()
  }
}

watch(allOptions, onReposition)

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
  height: 32px;
  padding: 0 12px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 4px;
  background: #fff;
  color: #333;
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
    background: #f5f5f5;
    color: #c0c4cc;
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
