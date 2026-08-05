<template>
  <div
    class="yiz-collapse-item"
    :class="{ 'yiz-collapse-item-active': active, 'yiz-collapse-item-disabled': disabled }"
  >
    <div
      class="yiz-collapse-header"
      role="button"
      :tabindex="disabled ? -1 : 0"
      :aria-expanded="active"
      :aria-disabled="disabled || undefined"
      @click="onHeaderClick"
      @keydown="onHeaderKeydown"
    >
      <Icon class="yiz-collapse-arrow" size="16" :icon="ChevronDown16Regular" />
      <span class="yiz-collapse-title">
        <slot name="title">{{ title }}</slot>
      </span>
      <span v-if="$slots.extra" class="yiz-collapse-extra" @click.stop>
        <slot name="extra" />
      </span>
    </div>
    <Transition
      name="yiz-collapse-content"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
      @after-leave="onAfterLeave"
    >
      <div v-show="active" class="yiz-collapse-content">
        <div class="yiz-collapse-content-inner">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { ChevronDown16Regular } from '@vicons/fluent'
import { Icon } from '../icon'
import type { CollapseKey } from './Collapse.vue'

interface CollapseContext {
  isActive: (key: CollapseKey) => boolean
  toggle: (key: CollapseKey) => void
}

const props = defineProps<{
  name: CollapseKey
  title?: string
  disabled?: boolean
}>()

defineSlots<{
  default?: any
  extra?: any
  title?: any
}>()

const collapse = inject<CollapseContext | null>('yizCollapse', null)
const active = computed(() => collapse?.isActive(props.name) ?? true)

function onHeaderClick() {
  if (props.disabled) return
  collapse?.toggle(props.name)
}

function onHeaderKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  onHeaderClick()
}

function onBeforeEnter(el: Element) {
  const element = el as HTMLElement
  element.style.height = '0px'
  element.style.opacity = '0'
}

function onEnter(el: Element) {
  const element = el as HTMLElement
  element.style.height = '0px'
  element.style.opacity = '0'
  forceReflow(element)
  element.style.height = `${element.scrollHeight}px`
  element.style.opacity = '1'
}

function onAfterEnter(el: Element) {
  resetMotionStyle(el)
}

function onBeforeLeave(el: Element) {
  const element = el as HTMLElement
  element.style.height = `${element.scrollHeight}px`
  element.style.opacity = '1'
  forceReflow(element)
}

function onLeave(el: Element) {
  const element = el as HTMLElement
  element.style.height = '0px'
  element.style.opacity = '0'
}

function onAfterLeave(el: Element) {
  resetMotionStyle(el)
}

function resetMotionStyle(el: Element) {
  const element = el as HTMLElement
  element.style.height = ''
  element.style.opacity = ''
}

function forceReflow(element: HTMLElement) {
  return element.offsetHeight
}
</script>

<style lang="less">
.yiz-collapse-item + .yiz-collapse-item {
  border-top: 1px solid var(--yiz-color-border);
}

.yiz-collapse-header {
  width: 100%;
  min-height: 44px;
  box-sizing: border-box;
  background: var(--yiz-color-bg-container);
  color: var(--yiz-color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  font: inherit;
  text-align: left;
  transition: background-color 0.2s;
}

.yiz-collapse-header:hover {
  background: var(--yiz-color-bg-subtle);
}

.yiz-collapse-item-disabled .yiz-collapse-header {
  color: #bfbfbf;
  cursor: not-allowed;
  background: var(--yiz-color-bg-container);
}

.yiz-collapse-arrow {
  color: var(--yiz-color-text-tertiary);
  transform: rotate(-90deg);
  transition: transform 0.2s;
  flex-shrink: 0;
}

.yiz-collapse-item-active .yiz-collapse-arrow {
  transform: rotate(0deg);
}

.yiz-collapse-title {
  min-width: 0;
  flex: 1;
}

.yiz-collapse-extra {
  flex-shrink: 0;
  margin-left: 12px;
}

.yiz-collapse-content {
  overflow: hidden;
  background: var(--yiz-color-bg-container);
  border-top: 1px solid var(--yiz-color-border);
}

.yiz-collapse-content-inner {
  padding: 0 16px 16px 31px;
  color: var(--yiz-color-text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.yiz-collapse-content-enter-active,
.yiz-collapse-content-leave-active {
  transition:
    height 0.2s cubic-bezier(0.645, 0.045, 0.355, 1),
    opacity 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
</style>
