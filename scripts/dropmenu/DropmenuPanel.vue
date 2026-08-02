<template>
  <Teleport to="body">
    <Transition name="yiz-dropmenu-panel-fade">
      <div
        v-if="visible"
        :id="id"
        ref="panelRef"
        class="yiz-dropmenu-panel"
        :style="position"
        role="menu"
        aria-orientation="vertical"
        @mouseenter="$emit('mouseenter')"
        @mouseleave="$emit('mouseleave', $event)"
      >
        <template v-for="(item, idx) in options" :key="item.key ?? idx">
          <div v-if="item.type === 'divider'" class="yiz-dropmenu-divider" role="separator" />
          <div
            v-else
            :ref="(element) => setItemRef(element, idx)"
            class="yiz-dropmenu-item"
            :class="{ 'yiz-dropmenu-item-disabled': item.disabled, 'yiz-dropmenu-item-hover': hoveredItem === item }"
            role="menuitem"
            tabindex="-1"
            :aria-disabled="item.disabled || undefined"
            :aria-haspopup="item.children?.length ? 'menu' : undefined"
            :aria-expanded="item.children?.length ? hoveredItem === item : undefined"
            @click="onItemClick(item)"
            @mouseenter="onItemMouseEnter(item, $event)"
            @mouseleave="onItemMouseLeave"
            @focus="onItemFocus(item)"
            @keydown="onItemKeydown(item, idx, $event)"
          >
            <span class="yiz-dropmenu-item-content">
              <span class="yiz-dropmenu-item-icon">
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
            <Icon v-if="item.children?.length" class="yiz-dropmenu-sub-arrow" size="16" :icon="ChevronRight16Regular" />
          </div>
        </template>

        <DropmenuPanel
          v-if="hoveredItem?.children?.length"
          ref="childPanelRef"
          submenu
          :visible="!!hoveredItem"
          :options="hoveredItem.children"
          :position="childStyle"
          @select="onChildSelect"
          @close="onChildClose"
          @mouseenter="onChildEnter"
          @mouseleave="onChildLeave"
        >
          <template #icon="scope"><slot name="icon" v-bind="scope" /></template>
          <template #item="scope"><slot name="item" v-bind="scope" /></template>
        </DropmenuPanel>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, ref, toRef, watch, type ComponentPublicInstance } from 'vue'
import { ChevronRight16Regular } from '@vicons/fluent'
import { Icon } from '../icon'
import IconRenderer from '../menu/IconRenderer.vue'
import { useOverlayElement } from '../overlay/overlayScope'
import type { DropmenuOption } from './types'

const props = withDefaults(
  defineProps<{
    id?: string
    options?: DropmenuOption[]
    visible?: boolean
    position?: Record<string, string>
    submenu?: boolean
  }>(),
  {
    id: undefined,
    options: () => [],
    visible: false,
    position: () => ({}),
    submenu: false,
  },
)

defineSlots<{
  item?: (props: { item: DropmenuOption; index: number }) => any
  icon?: (props: { icon: string; item: DropmenuOption }) => any
}>()

const emit = defineEmits<{
  select: [item: DropmenuOption]
  close: []
  mouseenter: []
  mouseleave: [e: MouseEvent]
}>()

const hoveredItem = ref<DropmenuOption | null>(null)
const hoveredItemElement = ref<HTMLElement>()
const childStyle = ref<Record<string, string>>({})
const panelRef = ref<HTMLElement>()
const itemRefs = ref<Array<HTMLElement | undefined>>([])
const childPanelRef = ref<{
  getElement: () => HTMLElement | undefined
  focusFirst: () => void
  updateOpenSubmenuPosition: () => void
}>()
useOverlayElement(panelRef, toRef(props, 'visible'))
let childTimer: ReturnType<typeof setTimeout> | null = null

const childZIndex = computed(() => {
  return String((Number.parseInt(props.position?.zIndex ?? '3000') || 3000) + 1)
})

function onItemClick(item: DropmenuOption) {
  if (item.disabled || item.children?.length) return
  emit('select', item)
}

function setItemRef(element: Element | ComponentPublicInstance | null, index: number) {
  itemRefs.value[index] = element instanceof HTMLElement ? element : undefined
}

function focusableIndexes() {
  return props.options.flatMap((item, index) => (item.type !== 'divider' && !item.disabled ? [index] : []))
}

function focusFirst() {
  const index = focusableIndexes()[0]
  if (index != null) itemRefs.value[index]?.focus()
}

function focusLast() {
  const indexes = focusableIndexes()
  const index = indexes[indexes.length - 1]
  if (index != null) itemRefs.value[index]?.focus()
}

function focusRelative(currentIndex: number, offset: number) {
  const indexes = focusableIndexes()
  if (!indexes.length) return
  const position = indexes.indexOf(currentIndex)
  const nextPosition = position < 0 ? 0 : (position + offset + indexes.length) % indexes.length
  itemRefs.value[indexes[nextPosition]]?.focus()
}

function clearChildTimer() {
  if (!childTimer) return
  clearTimeout(childTimer)
  childTimer = null
}

function resetSubmenu() {
  clearChildTimer()
  hoveredItem.value = null
  hoveredItemElement.value = undefined
  childStyle.value = {}
}

function updateOpenSubmenuPosition() {
  if (!hoveredItem.value?.children?.length || !hoveredItemElement.value) return
  const rect = hoveredItemElement.value.getBoundingClientRect()
  const childRect = childPanelRef.value?.getElement()?.getBoundingClientRect()
  const gap = 4
  const margin = 8
  const menuWidth = childRect?.width || 200
  const menuHeight = childRect?.height || Math.min(hoveredItem.value.children.length * 40, 360)
  const style: Record<string, string> = {
    position: 'fixed',
    zIndex: childZIndex.value,
    maxWidth: `calc(100vw - ${margin * 2}px)`,
    maxHeight: `calc(100vh - ${margin * 2}px)`,
  }

  const rightLeft = rect.right + gap
  const leftLeft = rect.left - menuWidth - gap
  style.left = `${rightLeft + menuWidth <= window.innerWidth - margin ? rightLeft : Math.max(margin, leftLeft)}px`
  style.top = `${Math.max(margin, Math.min(rect.top, window.innerHeight - menuHeight - margin))}px`
  childStyle.value = style
  nextTick(() => childPanelRef.value?.updateOpenSubmenuPosition())
}

function openSubmenu(item: DropmenuOption, element: HTMLElement) {
  clearChildTimer()
  if (!item.children?.length || item.disabled) {
    resetSubmenu()
    return
  }
  hoveredItem.value = item
  hoveredItemElement.value = element
  updateOpenSubmenuPosition()
  nextTick(updateOpenSubmenuPosition)
}

function onItemMouseEnter(item: DropmenuOption, e: MouseEvent) {
  openSubmenu(item, e.currentTarget as HTMLElement)
}

function onItemMouseLeave() {
  clearChildTimer()
  childTimer = setTimeout(() => {
    resetSubmenu()
  }, 100)
}

function onItemFocus(item: DropmenuOption) {
  if (hoveredItem.value !== item) resetSubmenu()
}

function onItemKeydown(item: DropmenuOption, index: number, e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    focusRelative(index, e.key === 'ArrowDown' ? 1 : -1)
    return
  }
  if (e.key === 'Home' || e.key === 'End') {
    e.preventDefault()
    if (e.key === 'Home') focusFirst()
    else focusLast()
    return
  }
  if (e.key === 'ArrowLeft' && props.submenu) {
    e.preventDefault()
    emit('close')
    return
  }
  if (e.key !== 'ArrowRight' && e.key !== 'Enter' && e.key !== ' ') return
  e.preventDefault()
  if (item.disabled) return
  if (item.children?.length) {
    openSubmenu(item, e.currentTarget as HTMLElement)
    nextTick(() => childPanelRef.value?.focusFirst())
    return
  }
  if (e.key !== 'ArrowRight') emit('select', item)
}

function onChildEnter() {
  clearChildTimer()
}

function onChildLeave(e: MouseEvent) {
  const related = e.relatedTarget as HTMLElement | null
  if (related?.closest('.yiz-dropmenu-panel')) return
  resetSubmenu()
}

function onChildClose() {
  const element = hoveredItemElement.value
  resetSubmenu()
  nextTick(() => element?.focus())
}

function onChildSelect(item: DropmenuOption) {
  emit('select', item)
}

function getElement() {
  return panelRef.value
}

watch(
  () => props.visible,
  (visible) => {
    if (!visible) resetSubmenu()
  },
)

onBeforeUnmount(resetSubmenu)

defineExpose({ getElement, focusFirst, focusLast, updateOpenSubmenuPosition })
</script>

<style lang="less">
.yiz-dropmenu-panel {
  z-index: 3000;
  min-width: 160px;
  max-height: 360px;
  overflow: auto;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-pane-border-radius);
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  box-sizing: border-box;
  user-select: none;
}

.yiz-dropmenu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  margin: 4px;
  padding: 0 8px;
  border-radius: var(--yiz-pane-item-border-radius);
  color: #333;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition:
    background 0.2s,
    color 0.2s;

  &:hover,
  &.yiz-dropmenu-item-hover,
  &:focus-visible {
    background: var(--yiz-color-hover-bg);
    outline: none;
  }
}

.yiz-dropmenu-item-disabled {
  color: #c0c4cc;
  cursor: not-allowed;

  &:hover,
  &.yiz-dropmenu-item-hover,
  &:focus-visible {
    background: transparent;
  }
}

.yiz-dropmenu-item-content {
  display: inline-flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.yiz-dropmenu-item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin-right: 8px;
}

.yiz-dropmenu-sub-arrow {
  flex-shrink: 0;
  margin-left: 12px;
  color: #999;
}

.yiz-dropmenu-divider {
  margin: 4px 0;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-dropmenu-panel-fade-enter-active,
.yiz-dropmenu-panel-fade-leave-active {
  transition:
    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-dropmenu-panel-fade-enter-from,
.yiz-dropmenu-panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
