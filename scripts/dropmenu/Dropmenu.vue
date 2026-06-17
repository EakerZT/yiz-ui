<template>
  <span
    ref="triggerRef"
    class="yiz-dropmenu"
    :class="{ 'yiz-dropmenu-disabled': disabled, 'yiz-dropmenu-open': open }"
    @click="onTriggerClick"
  >
    <slot name="trigger" :open="open">
      <button type="button" class="yiz-dropmenu-trigger" :disabled="disabled">
        <span>{{ label }}</span>
        <svg
          class="yiz-dropmenu-arrow"
          :class="{ 'yiz-dropmenu-arrow-open': open }"
          viewBox="0 0 16 16"
          width="12"
          height="12"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            stroke-width="1.5"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </slot>
  </span>

  <DropmenuPanel :visible="open" :options="allOptions" :position="popupStyle" @select="onSelect">
    <template #icon="scope"><slot name="icon" v-bind="scope" /></template>
    <template #item="scope"><slot name="item" v-bind="scope" /></template>
  </DropmenuPanel>
  <div style="display: none"><slot /></div>
</template>

<script lang="ts" setup>
import { computed, Fragment, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import MenuOptionComp from '../menu-option/MenuOption.vue'
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
const popupStyle = ref<Record<string, string>>({})
const currentZIndex = ref(0)

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

const slotOptions = computed(() => {
  const nodes = collectOptionVNodes(slots.default?.() ?? [])
  const options: DropmenuOption[] = []
  for (const vnode of nodes) {
    if (vnode.props) {
      const p = vnode.props as Record<string, any>
      if (p.item) {
        options.push({ ...p.item, children: p.children ?? p.item.children, icon: p.icon ?? p.item.icon })
      } else {
        options.push({ label: p.label, key: vnode.key ?? p.key, children: p.children, icon: p.icon })
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
.yiz-dropmenu {
  display: inline-flex;
  vertical-align: middle;
}

.yiz-dropmenu-disabled {
  cursor: not-allowed;
}

.yiz-dropmenu-trigger {
  display: inline-flex;
  align-items: center;
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
}

.yiz-dropmenu-open .yiz-dropmenu-trigger {
  border-color: var(--yiz-color-primary);
  color: var(--yiz-color-primary);
  box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
}

.yiz-dropmenu-arrow {
  flex-shrink: 0;
  transition: transform 0.2s;
}

.yiz-dropmenu-arrow-open {
  transform: rotate(180deg);
}
</style>
