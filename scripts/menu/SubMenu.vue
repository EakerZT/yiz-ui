<template>
  <Transition name="yiz-menu-sub-slide">
    <div v-if="visible" class="yiz-menu-sub">
      <template v-for="(item, idx) in items" :key="idx">
        <div
          class="yiz-menu-item"
          :class="{ 'yiz-menu-item-selected': isSelected(item), 'yiz-menu-item-ancestor': isAncestor(item) }"
          :style="itemStyle"
          @click="onItemClick(item)"
        >
          <span class="yiz-menu-item-icon">
            <template v-if="item.icon">
              <template v-if="typeof item.icon === 'string'">
                <slot name="icon" :icon="item.icon" :item="item" />
              </template>
              <IconRenderer v-else :content="item.icon" />
            </template>
          </span>
          <span class="yiz-menu-item-label">
            <slot name="item" :item="item" :index="idx">
              {{ item.label }}
            </slot>
          </span>
          <svg
            v-if="item.children?.length"
            class="yiz-menu-item-arrow"
            :class="{ 'yiz-menu-item-arrow-expanded': isExpanded(item) }"
            viewBox="0 0 16 16"
            width="12"
            height="12"
          >
            <path
              d="M6 4l4 4-4 4"
              stroke="currentColor"
              stroke-width="1.5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <SubMenu
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
import type { MenuItem } from './Menu.vue'
import IconRenderer from './IconRenderer.vue'

const props = withDefaults(
  defineProps<{
    items?: MenuItem[]
    selected?: any
    width?: number | string
    visible?: boolean
    depth?: number
  }>(),
  {
    depth: 1
  }
)

defineSlots<{
  icon?: (props: { icon: string; item: MenuItem }) => any
  item?: (props: { item: MenuItem; index: number }) => any
}>()

const emit = defineEmits<{
  select: [item: MenuItem]
}>()

const expandedKeys = ref<Set<any>>(new Set())

const itemStyle = computed(() => ({
  paddingLeft: `${12 + props.depth * 16}px`
}))

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

function isExpanded(item: MenuItem) {
  return expandedKeys.value.has(item.key)
}

function onItemClick(item: MenuItem) {
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

function onChildSelect(item: MenuItem) {
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
