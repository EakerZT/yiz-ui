<template>
  <Transition name="yiz-menu-sub-slide">
    <div v-if="visible" class="yiz-menu-sub">
      <template v-for="(item, idx) in items" :key="item.key ?? idx">
        <div
          v-if="item.type === 'divider'"
          class="yiz-menu-divider"
          :class="{ 'yiz-menu-divider-with-name': item.name }"
          :style="dividerStyle"
          role="separator"
        >
          <span v-if="item.name" class="yiz-menu-divider-name">{{ item.name }}</span>
        </div>
        <div
          v-else
          class="yiz-menu-item"
          :class="{ 'yiz-menu-item-selected': isSelected(item), 'yiz-menu-item-ancestor': isAncestor(item) }"
          :style="itemStyle"
          @click="onItemClick(item)"
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
            :size="16"
            :icon="ChevronRight16Regular"
          />
        </div>
        <SubMenu
          v-if="item.type !== 'divider'"
          :visible="!!(item.children?.length && isExpanded(item))"
          :items="item.children"
          :selected="selected"
          :width="width"
          :depth="depth + 1"
          @select="onChildSelect"
        >
          <template #icon="scope"><slot name="icon" v-bind="scope" /></template>
          <template #item="scope"><slot name="item" v-bind="scope" /></template>
        </SubMenu>
      </template>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { ChevronRight16Regular } from '@vicons/fluent'
import { Icon } from '../icon'
import { isMenuDivider, type MenuEntry, type MenuItemOption } from './types'
import IconRenderer from './IconRenderer.vue'

const props = withDefaults(
  defineProps<{
    items?: MenuEntry[]
    selected?: any
    width?: number | string
    visible?: boolean
    depth?: number
  }>(),
  {
    depth: 1,
  },
)

defineSlots<{
  icon?: (props: { icon: string; item: MenuItemOption; selected: boolean }) => any
  item?: (props: { item: MenuItemOption; index: number }) => any
}>()

const emit = defineEmits<{
  select: [item: MenuItemOption]
}>()

const expandedKeys = ref<Set<any>>(new Set())

const itemStyle = computed(() => ({
  paddingLeft: `${12 + props.depth * 16}px`,
}))

const dividerStyle = computed(() => ({
  marginLeft: `${20 + props.depth * 16}px`,
}))

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
  if (props.selected == null || !props.items) return new Set<any>()
  return findAncestors(props.items, props.selected) ?? new Set()
})

function isAncestor(item: MenuItemOption) {
  return ancestorKeys.value.has(item.key)
}

function isSelected(item: MenuItemOption) {
  return props.selected != null && item.key === props.selected
}

function isExpanded(item: MenuItemOption) {
  return expandedKeys.value.has(item.key)
}

function onItemClick(item: MenuItemOption) {
  if (item.children?.length) {
    const key = item.key
    if (expandedKeys.value.has(key)) {
      expandedKeys.value.delete(key)
    } else {
      expandedKeys.value.add(key)
    }
    expandedKeys.value = new Set(expandedKeys.value)
  } else {
    emit('select', item)
  }
}

function onChildSelect(item: MenuItemOption) {
  emit('select', item)
}
</script>

<style lang="less">
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
</style>
