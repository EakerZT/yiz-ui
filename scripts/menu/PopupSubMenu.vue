<template>
  <Teleport to="body">
    <div
      v-if="visible"
      ref="panelRef"
      :class="popupClass"
      :style="position"
      @mouseenter="$emit('mouseenter')"
      @mouseleave="$emit('mouseleave', $event)"
    >
      <div class="yiz-menu" :class="{ 'yiz-menu-dark': dark }">
        <template v-for="(item, idx) in items" :key="idx">
          <div
            class="yiz-menu-item"
            :class="{ 'yiz-menu-item-selected': isSelected(item), 'yiz-menu-item-ancestor': isAncestor(item) }"
            @click="onItemClick(item)"
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
            <Icon v-if="item.children?.length" class="yiz-menu-item-arrow" size="16" :icon="ChevronRight16Regular" />
          </div>
        </template>
      </div>
      <PopupSubMenu
        v-if="hoveredItem"
        :visible="!!hoveredItem"
        :items="hoveredItem?.children"
        :selected="selected"
        :position="childStyle"
        :dark="dark"
        popup-class="yiz-menu-popup-sub"
        @select="onChildSelect"
        @mouseenter="onChildEnter"
        @mouseleave="onChildLeave"
      >
        <template #icon="scope"><slot name="icon" v-bind="scope" /></template>
        <template #item="scope"><slot name="item" v-bind="scope" /></template>
      </PopupSubMenu>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, ref, toRef } from 'vue'
import { ChevronRight16Regular } from '@vicons/fluent'
import { Icon } from '../icon'
import { useOverlayElement } from '../overlay/overlayScope'
import type { MenuItem } from './Menu.vue'
import IconRenderer from './IconRenderer.vue'

const props = defineProps<{
  items?: MenuItem[]
  selected?: any
  visible?: boolean
  position?: Record<string, string>
  popupClass?: string
  dark?: boolean
}>()

defineSlots<{
  icon?: (props: { icon: string; item: MenuItem; selected: boolean }) => any
  item?: (props: { item: MenuItem; index: number }) => any
}>()

const emit = defineEmits<{
  select: [item: MenuItem]
  mouseenter: []
  mouseleave: [e: MouseEvent]
}>()

const hoveredItem = ref<MenuItem | null>(null)
const childStyle = ref<Record<string, string>>({})
const panelRef = ref<HTMLElement>()
useOverlayElement(panelRef, toRef(props, 'visible'))
let childTimer: ReturnType<typeof setTimeout> | null = null

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
  if (props.selected == null || !props.items) return new Set<any>()
  return findAncestors(props.items, props.selected) ?? new Set()
})

function isAncestor(item: MenuItem) {
  return ancestorKeys.value.has(item.key)
}

function isSelected(item: MenuItem) {
  return props.selected != null && item.key === props.selected
}

function onItemClick(item: MenuItem) {
  if (item.children?.length) return
  emit('select', item)
}

function onItemMouseEnter(item: MenuItem, e: MouseEvent) {
  if (childTimer) {
    clearTimeout(childTimer)
    childTimer = null
  }
  if (item.children?.length) {
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const menuW = 200
    const gap = 4
    const s: Record<string, string> = {
      position: 'fixed',
      left: `${rect.right}px`,
      top: `${rect.top}px`,
    }
    if (rect.right + menuW + gap > window.innerWidth) {
      s.left = `${rect.left - menuW - gap}px`
    }
    const estimatedHeight = Math.min((item.children?.length || 0) * 40 + 8, 400)
    if (rect.top + estimatedHeight > window.innerHeight) {
      s.top = 'auto'
      s.bottom = `${window.innerHeight - rect.bottom}px`
    }
    hoveredItem.value = item
    childStyle.value = s
  } else {
    hoveredItem.value = null
  }
}

function onItemMouseLeave(_item: MenuItem) {
  childTimer = setTimeout(() => {
    hoveredItem.value = null
  }, 100)
}

function onChildEnter() {
  if (childTimer) {
    clearTimeout(childTimer)
    childTimer = null
  }
}

function onChildLeave(e: MouseEvent) {
  const related = e.relatedTarget as HTMLElement | null
  if (related?.closest('.yiz-menu-popup-sub')) return
  hoveredItem.value = null
}

function onChildSelect(item: MenuItem) {
  emit('select', item)
}
</script>

<style lang="less">
.yiz-menu-popup {
  z-index: 3000;

  > .yiz-menu {
    border: 1px solid var(--yiz-color-border, #d9d9d9);
    border-radius: var(--yiz-pane-border-radius);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    padding: 0;
  }
}

.yiz-menu-popup-sub {
  z-index: 3100;

  > .yiz-menu {
    border: 1px solid var(--yiz-color-border, #d9d9d9);
    border-radius: var(--yiz-pane-border-radius);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    padding: 0;
  }
}
</style>
