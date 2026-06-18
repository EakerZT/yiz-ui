<template>
  <Teleport to="body">
    <Transition name="yiz-dropmenu-panel-fade">
      <div
        v-if="visible"
        class="yiz-dropmenu-panel"
        :style="position"
        @mouseenter="$emit('mouseenter')"
        @mouseleave="$emit('mouseleave', $event)"
      >
        <template v-for="(item, idx) in options" :key="idx">
          <div v-if="item.type === 'divider'" class="yiz-dropmenu-divider" />
          <div
            v-else
            class="yiz-dropmenu-item"
            :class="{ 'yiz-dropmenu-item-disabled': item.disabled, 'yiz-dropmenu-item-hover': hoveredItem === item }"
            @click="onItemClick(item)"
            @mouseenter="onItemMouseEnter(item, $event)"
            @mouseleave="onItemMouseLeave"
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
            <svg v-if="item.children?.length" class="yiz-dropmenu-sub-arrow" viewBox="0 0 16 16" width="10" height="10">
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
        </template>

        <DropmenuPanel
          v-if="hoveredItem?.children?.length"
          :visible="!!hoveredItem"
          :options="hoveredItem.children"
          :position="childStyle"
          @select="onChildSelect"
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
import { computed, ref } from 'vue'
import IconRenderer from '../menu/IconRenderer.vue'
import type { DropmenuOption } from './types'

const props = withDefaults(
  defineProps<{
    options?: DropmenuOption[]
    visible?: boolean
    position?: Record<string, string>
  }>(),
  {
    options: () => [],
    visible: false,
    position: () => ({})
  }
)

defineSlots<{
  item?: (props: { item: DropmenuOption; index: number }) => any
  icon?: (props: { icon: string; item: DropmenuOption }) => any
}>()

const emit = defineEmits<{
  select: [item: DropmenuOption]
  mouseenter: []
  mouseleave: [e: MouseEvent]
}>()

const hoveredItem = ref<DropmenuOption | null>(null)
const childStyle = ref<Record<string, string>>({})
let childTimer: ReturnType<typeof setTimeout> | null = null

const childZIndex = computed(() => {
  return String((Number.parseInt(props.position?.zIndex ?? '3000') || 3000) + 1)
})

function onItemClick(item: DropmenuOption) {
  if (item.disabled || item.children?.length) return
  emit('select', item)
}

function onItemMouseEnter(item: DropmenuOption, e: MouseEvent) {
  if (childTimer) {
    clearTimeout(childTimer)
    childTimer = null
  }

  if (!item.children?.length || item.disabled) {
    hoveredItem.value = null
    return
  }

  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const menuWidth = 200
  const gap = 4
  const margin = 8
  const estimatedHeight = Math.min(item.children.length * 32 + 8, 360)
  const style: Record<string, string> = {
    position: 'fixed',
    zIndex: childZIndex.value,
    left: `${rect.right + gap}px`,
    top: `${rect.top}px`
  }

  if (rect.right + gap + menuWidth > window.innerWidth - margin) {
    style.left = `${Math.max(margin, rect.left - menuWidth - gap)}px`
  }
  if (rect.top + estimatedHeight > window.innerHeight - margin) {
    style.top = `${Math.max(margin, window.innerHeight - estimatedHeight - margin)}px`
  }

  hoveredItem.value = item
  childStyle.value = style
}

function onItemMouseLeave() {
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
  if (related?.closest('.yiz-dropmenu-panel')) return
  hoveredItem.value = null
}

function onChildSelect(item: DropmenuOption) {
  emit('select', item)
}
</script>

<style lang="less">
.yiz-dropmenu-panel {
  z-index: 3000;
  min-width: 160px;
  max-height: 360px;
  overflow: auto;
  padding: 4px 0;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 4px;
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
  margin: 2px 4px;
  padding: 0 8px;
  border-radius: 4px;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  transition:
    background 0.2s,
    color 0.2s;

  &:hover,
  &.yiz-dropmenu-item-hover {
    background: var(--yiz-color-hover-bg);
  }
}

.yiz-dropmenu-item-disabled {
  color: #c0c4cc;
  cursor: not-allowed;

  &:hover,
  &.yiz-dropmenu-item-hover {
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
  height: 1px;
  margin: 4px 8px;
  background: var(--yiz-color-border, #d9d9d9);
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
