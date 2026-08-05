<template>
  <div class="yiz-tab" :class="vClass" :style="flexStyle">
    <div class="yiz-tab-header">
      <div v-if="$slots.leftExtra" class="yiz-tab-header-left-extra">
        <slot name="leftExtra" />
      </div>

      <ScrollBox
        class="yiz-tab-header-scroll"
        :overflow-x="isVertical ? 'hidden' : 'auto'"
        :overflow-y="isVertical ? 'auto' : 'hidden'"
        auto-hide="move"
        :auto-hide-delay="600"
      >
        <div class="yiz-tab-header-inner" role="tablist" :aria-orientation="isVertical ? 'vertical' : 'horizontal'">
          <div
            v-for="(pane, idx) in panes"
            :key="pane.key ?? idx"
            :ref="(el: any) => setItemRef(el, idx)"
            class="yiz-tab-header-item"
            :class="{
              'yiz-tab-header-item-active': isActive(pane),
              'yiz-tab-header-item-disabled': pane.disabled,
              'yiz-tab-header-item-closable': props.type === 'card' && pane.closable,
            }"
            role="tab"
            :id="getTabId(idx)"
            :aria-controls="getPaneId(pane.key)"
            :aria-label="pane.label"
            :aria-selected="isActive(pane)"
            :aria-disabled="pane.disabled || undefined"
            :tabindex="isActive(pane) && !pane.disabled ? 0 : -1"
            @click="onTabClick(pane)"
            @keydown="onTabKeydown($event, pane, idx)"
          >
            <component v-if="pane.labelSlot" :is="getLabelComp(pane.labelSlot)" />
            <span v-else class="yiz-tab-header-item-label">{{ pane.label }}</span>
            <span
              v-if="props.type === 'card' && pane.closable"
              class="yiz-tab-header-item-close"
              role="button"
              tabindex="-1"
              :aria-label="$t('tab.close', { label: pane.label })"
              @click.stop="onClosePane(pane)"
            >
              <Icon size="16" :icon="Dismiss16Regular" />
            </span>
          </div>
          <div v-if="props.type !== 'card'" class="yiz-tab-header-bar" :style="barStyle" />
        </div>
      </ScrollBox>

      <div v-if="$slots.rightExtra" class="yiz-tab-header-right-extra">
        <slot name="rightExtra" />
      </div>
    </div>

    <div class="yiz-tab-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  Fragment,
  h,
  nextTick,
  provide,
  reactive,
  ref,
  useId,
  useSlots,
  watch,
  watchEffect,
  type CSSProperties,
} from 'vue'
import { Dismiss16Regular } from '@vicons/fluent'
import { Icon } from '../icon'
import TabPaneComp from './TabPane.vue'
import ScrollBox from '../scroll-box/ScrollBox.vue'
import { $t } from '../locale'

interface PaneData {
  label: string
  key: any
  disabled: boolean
  closable: boolean
  labelSlot: (() => any) | undefined
}

const props = withDefaults(
  defineProps<{
    direction?: 'top' | 'bottom' | 'left' | 'right'
    type?: 'default' | 'card'
    transitionType?: 'none' | 'fade' | 'slide'
    flex?: boolean
    overflow?: CSSProperties['overflow']
  }>(),
  {
    direction: 'top',
    type: 'default',
    transitionType: 'none',
    flex: false,
    overflow: 'hidden',
  },
)

defineSlots<{
  default?: any
  leftExtra?: any
  rightExtra?: any
}>()

const emit = defineEmits<{
  select: [key: any]
  close: [key: any]
}>()

const slots = useSlots()

const active = defineModel<any>('active')
const tabBaseId = `yiz-tab-${useId()}`

const closedKeys = reactive(new Set<any>())

// 递归展平 Fragment，确保 v-for 生成的 TabPane 能被正确提取
function collectPaneVNodes(nodes: any[]): any[] {
  const result: any[] = []
  for (const vnode of nodes) {
    if (vnode && (vnode as any).type === Fragment) {
      const children = (vnode as any).children as any[]
      if (children) {
        result.push(...collectPaneVNodes(children))
      }
    } else if (vnode && vnode.type === TabPaneComp) {
      result.push(vnode)
    }
  }
  return result
}

const allPanes = computed<PaneData[]>(() => {
  const nodes = slots.default?.() ?? []
  const paneVNodes = collectPaneVNodes(nodes)
  return paneVNodes.map((vnode, idx) => {
    const p = vnode.props as Record<string, any>
    return {
      label: p.label ?? `Tab ${idx + 1}`,
      key: vnode.key ?? p.key ?? idx,
      disabled: p.disabled != null && p.disabled !== false,
      closable: p.closable != null && p.closable !== false,
      labelSlot: (vnode as any).children?.label as (() => any) | undefined,
    }
  })
})

const panes = computed<PaneData[]>(() => allPanes.value.filter((pane) => !closedKeys.has(pane.key)))

// 父级真正移除页签后释放关闭记录，允许之后使用相同 key 重新挂载。
watch(
  () => allPanes.value.map((pane) => pane.key),
  (keys) => {
    for (const key of closedKeys) {
      if (!keys.some((paneKey) => paneKey === key)) closedKeys.delete(key)
    }
  },
  { flush: 'sync' },
)

const activeIndex = ref(0)

// 当前激活项消失时，优先保持原索引；删除末项时回退到新的最后一项
watchEffect(() => {
  const currentPanes = panes.value
  if (currentPanes.length === 0) return

  let nextActiveIndex = currentPanes.findIndex((pane) => pane.key === active.value)
  if (nextActiveIndex === -1) {
    nextActiveIndex = Math.max(0, Math.min(activeIndex.value, currentPanes.length - 1))
    active.value = currentPanes[nextActiveIndex]?.key
  }
  activeIndex.value = nextActiveIndex
})

function isActive(pane: PaneData) {
  return active.value != null && pane.key === active.value
}

function onTabClick(pane: PaneData) {
  if (pane.disabled) return
  active.value = pane.key
  emit('select', pane.key)
}

function onClosePane(pane: PaneData) {
  closedKeys.add(pane.key)
  emit('close', pane.key)
}

function getTabId(index: number) {
  return `${tabBaseId}-tab-${index}`
}

function getPaneId(key: any) {
  const index = panes.value.findIndex((pane) => pane.key === key)
  return `${tabBaseId}-panel-${Math.max(0, index)}`
}

function findEnabledTabIndex(startIndex: number, direction: 1 | -1) {
  const count = panes.value.length
  if (count === 0) return -1
  for (let offset = 1; offset <= count; offset += 1) {
    const index = (startIndex + offset * direction + count) % count
    if (!panes.value[index]?.disabled) return index
  }
  return -1
}

async function activateAndFocusTab(index: number) {
  const pane = panes.value[index]
  if (!pane || pane.disabled) return
  onTabClick(pane)
  await nextTick()
  itemRefs.value[index]?.focus()
}

function onTabKeydown(event: KeyboardEvent, pane: PaneData, index: number) {
  let targetIndex = -1
  if ((!isVertical.value && event.key === 'ArrowRight') || (isVertical.value && event.key === 'ArrowDown')) {
    targetIndex = findEnabledTabIndex(index, 1)
  } else if ((!isVertical.value && event.key === 'ArrowLeft') || (isVertical.value && event.key === 'ArrowUp')) {
    targetIndex = findEnabledTabIndex(index, -1)
  } else if (event.key === 'Home') {
    targetIndex = panes.value.findIndex((item) => !item.disabled)
  } else if (event.key === 'End') {
    targetIndex = panes.value.findLastIndex((item) => !item.disabled)
  } else if (event.key === 'Delete' && props.type === 'card' && pane.closable) {
    onClosePane(pane)
    event.preventDefault()
    nextTick(() => itemRefs.value[Math.min(index, panes.value.length - 1)]?.focus())
    return
  } else if (event.key === 'Enter' || event.key === ' ') {
    onTabClick(pane)
    event.preventDefault()
    return
  } else {
    return
  }

  if (targetIndex >= 0) void activateAndFocusTab(targetIndex)
  event.preventDefault()
}

const isVertical = computed(() => props.direction === 'left' || props.direction === 'right')

function getLabelComp(slotFn: (() => any) | undefined) {
  if (!slotFn) return null
  return {
    inheritAttrs: false,
    render: () => h('span', { class: 'yiz-tab-header-item-label' }, slotFn()),
  }
}

// DOM 测量 — bar 精确跟随当前激活 tab 的尺寸和位置
const itemRefs = ref<Record<number, HTMLElement>>({})

function setItemRef(el: HTMLElement | null, idx: number) {
  if (el) {
    itemRefs.value[idx] = el
  }
}

const barMeasure = ref({ width: 0, height: 0, left: 0, top: 0 })

function updateBarMeasure() {
  const idx = panes.value.findIndex((p) => p.key === active.value)
  if (idx < 0) {
    barMeasure.value = { width: 0, height: 0, left: 0, top: 0 }
    return
  }
  const el = itemRefs.value[idx]
  if (!el) return
  const parent = el.parentElement
  if (!parent) return
  barMeasure.value = {
    width: el.offsetWidth,
    height: el.offsetHeight,
    left: el.offsetLeft,
    top: el.offsetTop,
  }
}

watch(
  [active, panes, () => props.direction],
  () => {
    nextTick(updateBarMeasure)
  },
  { immediate: true },
)

const barStyle = computed(() => {
  if (panes.value.length === 0) return { display: 'none' }
  if (barMeasure.value.width === 0 && barMeasure.value.height === 0) return { display: 'none' }
  return isVertical.value
    ? { height: `${barMeasure.value.height}px`, top: `${barMeasure.value.top}px` }
    : { width: `${barMeasure.value.width}px`, left: `${barMeasure.value.left}px` }
})

const vClass = computed(() => ({
  [`yiz-tab-${props.direction}`]: true,
  [`yiz-tab-type-${props.type}`]: true,
  'yiz-tab-flex': props.flex,
}))

const flexStyle = computed(() => {
  if (!props.flex) return {}
  return { width: '100%', height: '100%' }
})

provide('yizTab', {
  active,
  transitionType: computed(() => props.transitionType),
  direction: computed(() => props.direction),
  flex: computed(() => props.flex),
  overflow: computed(() => props.overflow),
  getTabId: (key: any) =>
    getTabId(
      Math.max(
        0,
        panes.value.findIndex((pane) => pane.key === key),
      ),
    ),
  getPaneId,
})
</script>

<style lang="less">
// ========================= 基础布局 =========================

.yiz-tab {
  display: flex;
}

.yiz-tab-top {
  flex-direction: column;
}

.yiz-tab-bottom {
  flex-direction: column-reverse;
}

.yiz-tab-left {
  flex-direction: row;
}

.yiz-tab-right {
  flex-direction: row-reverse;
}

// ========================= Header =========================

.yiz-tab-header {
  display: flex;
  position: relative;
  background-color: var(--yiz-color-bg);
}

.yiz-tab-top .yiz-tab-header,
.yiz-tab-bottom .yiz-tab-header {
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  min-height: var(--yiz-control-height-large);
}

.yiz-tab-bottom .yiz-tab-header {
  border-bottom: none;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-tab-left .yiz-tab-header {
  flex-direction: column;
  border-right: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-tab-right .yiz-tab-header {
  flex-direction: column;
  border-left: 1px solid var(--yiz-color-border, #d9d9d9);
}

// ========================= Header extra 区域 =========================

.yiz-tab-header-left-extra,
.yiz-tab-header-right-extra {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 0 4px;
}

// ========================= Header ScrollBox =========================

.yiz-tab-header-scroll {
  flex: 1;
  min-width: 0;
}

.yiz-tab-left .yiz-tab-header-scroll,
.yiz-tab-right .yiz-tab-header-scroll {
  flex: 1;
  min-height: 0;
}

// ========================= Header inner（ScrollBox 内部） =========================

.yiz-tab-header-inner {
  display: flex;
  position: relative;
}

.yiz-tab-left .yiz-tab-header-inner,
.yiz-tab-right .yiz-tab-header-inner {
  flex-direction: column;
}

// ========================= Header item =========================

.yiz-tab-header-item {
  flex: none;
  height: var(--yiz-control-height-large);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--yiz-color-text-secondary);
  cursor: pointer;
  transition: color var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard);
  white-space: nowrap;
  padding: 0 12px;

  &:hover {
    color: var(--yiz-color-primary);
  }

  &.yiz-tab-header-item-active {
    color: var(--yiz-color-primary);
    font-weight: 500;
  }

  &.yiz-tab-header-item-disabled {
    color: #ccc;
    cursor: not-allowed;
  }
}

// 垂直方向 header item
.yiz-tab-left .yiz-tab-header-item,
.yiz-tab-right .yiz-tab-header-item {
  flex: none;
  height: auto;
  padding: var(--yiz-space-3) var(--yiz-space-4);
  justify-content: flex-start;
}

// ========================= Header bar =========================

.yiz-tab-header-bar {
  position: absolute;
  background: var(--yiz-color-primary);
}

// 水平 bar（top/bottom）
.yiz-tab-top .yiz-tab-header-bar {
  bottom: 0;
  height: 2px;
  transition:
    left var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard),
    width var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
}

.yiz-tab-bottom .yiz-tab-header-bar {
  top: 0;
  height: 2px;
  transition:
    left var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard),
    width var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
}

// 垂直 bar（left/right）
.yiz-tab-left .yiz-tab-header-bar {
  right: 0;
  width: 2px;
  transition:
    top var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard),
    height var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
}

.yiz-tab-right .yiz-tab-header-bar {
  left: 0;
  width: 2px;
  transition:
    top var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard),
    height var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
}

// ========================= Content =========================

.yiz-tab-content {
  padding-top: 12px;
}

.yiz-tab-bottom .yiz-tab-content {
  padding-top: 0;
  padding-bottom: 12px;
}

.yiz-tab-left .yiz-tab-content {
  padding-top: 0;
  padding-left: 12px;
}

.yiz-tab-right .yiz-tab-content {
  padding-top: 0;
  padding-right: 12px;
}

// ========================= Card type =========================

.yiz-tab-type-card {
  > .yiz-tab-header {
    border: none;

    &::after {
      content: '';
      position: absolute;
      pointer-events: none;
      z-index: 0;
    }
  }

  > .yiz-tab-header .yiz-tab-header-left-extra,
  > .yiz-tab-header .yiz-tab-header-right-extra,
  > .yiz-tab-header .yiz-tab-header-scroll {
    position: relative;
    z-index: 1;
  }

  > .yiz-tab-header .yiz-tab-header-item {
    border: 1px solid var(--yiz-color-border, #d9d9d9);
    border-bottom-color: var(--yiz-color-border, #d9d9d9);
    border-radius: 4px 4px 0 0;
    margin-right: 2px;
    background: var(--yiz-color-bg-subtle);

    &:hover {
      color: var(--yiz-color-primary);
    }

    &.yiz-tab-header-item-active {
      background: var(--yiz-color-bg-container);
      border-bottom-color: var(--yiz-color-bg-container);
    }

    &.yiz-tab-header-item-disabled {
      background: var(--yiz-color-bg-muted);
      color: #ccc;
    }
  }

  > .yiz-tab-content {
    border: none;
    padding: 12px;
  }

  // bar 在 card 模式下隐藏（边框自身形成视觉连接）
  > .yiz-tab-header .yiz-tab-header-bar {
    display: none;
  }
}

.yiz-tab-type-card.yiz-tab-top {
  > .yiz-tab-header::after {
    left: 0;
    right: 0;
    bottom: 0;
    border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  }
}

// card + bottom
.yiz-tab-type-card.yiz-tab-bottom {
  > .yiz-tab-header::after {
    left: 0;
    right: 0;
    top: 0;
    border-top: 1px solid var(--yiz-color-border, #d9d9d9);
  }

  > .yiz-tab-header .yiz-tab-header-item {
    border-radius: 0 0 4px 4px;
    border-top-color: var(--yiz-color-border, #d9d9d9);
    border-bottom-color: var(--yiz-color-border, #d9d9d9);

    &.yiz-tab-header-item-active {
      border-top-color: var(--yiz-color-bg-container);
    }
  }

  > .yiz-tab-content {
    border: none;
  }
}

// card + left
.yiz-tab-type-card.yiz-tab-left {
  > .yiz-tab-header::after {
    top: 0;
    right: 0;
    bottom: 0;
    border-right: 1px solid var(--yiz-color-border, #d9d9d9);
  }

  > .yiz-tab-header .yiz-tab-header-item {
    border-radius: 4px 0 0 4px;
    margin-right: 0;
    margin-bottom: 2px;
    border-right-color: var(--yiz-color-border, #d9d9d9);

    &.yiz-tab-header-item-active {
      border-right-color: var(--yiz-color-bg-container);
    }
  }

  > .yiz-tab-content {
    border: none;
  }
}

// card + right
.yiz-tab-type-card.yiz-tab-right {
  > .yiz-tab-header::after {
    top: 0;
    left: 0;
    bottom: 0;
    border-left: 1px solid var(--yiz-color-border, #d9d9d9);
  }

  > .yiz-tab-header .yiz-tab-header-item {
    border-radius: 0 4px 4px 0;
    margin-left: 0;
    margin-bottom: 2px;
    border-left-color: var(--yiz-color-border, #d9d9d9);

    &.yiz-tab-header-item-active {
      border-left-color: var(--yiz-color-bg-container);
    }
  }

  > .yiz-tab-content {
    border: none;
  }
}

// ========================= Close button =========================

.yiz-tab-header-item-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  margin-left: 6px;
  border-radius: 2px;
  color: var(--yiz-color-text-tertiary);
  transition:
    color 0.2s,
    background-color 0.2s;
  flex-shrink: 0;

  &:hover {
    color: var(--yiz-color-text-primary);
    background: rgba(0, 0, 0, 0.06);
  }

  svg {
    width: 10px;
    height: 10px;
  }
}

// 关闭按钮在 disabled 状态下不可见
.yiz-tab-header-item-disabled .yiz-tab-header-item-close {
  pointer-events: none;
  opacity: 0.4;
}

// ========================= Flex mode =========================

.yiz-tab-flex {
  width: 100%;
  height: 100%;

  > .yiz-tab-content {
    overflow: hidden;

    > .yiz-tab-pane {
      width: 100%;
      height: 100%;
    }
  }
}

.yiz-tab-flex.yiz-tab-top,
.yiz-tab-flex.yiz-tab-bottom {
  > .yiz-tab-header {
    flex-shrink: 0;
  }

  > .yiz-tab-content {
    flex: 1;
    min-height: 0;
  }
}

.yiz-tab-flex.yiz-tab-left,
.yiz-tab-flex.yiz-tab-right {
  > .yiz-tab-header {
    flex-shrink: 0;
  }

  > .yiz-tab-content {
    flex: 1;
    min-width: 0;
  }
}

// ========================= Pane transitions =========================

// Fade
.yiz-tab-fade-enter-active,
.yiz-tab-fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-tab-fade-enter-from,
.yiz-tab-fade-leave-to {
  opacity: 0;
}

// Slide - top
.yiz-tab-slide-top-enter-active,
.yiz-tab-slide-top-leave-active {
  transition:
    opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-tab-slide-top-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.yiz-tab-slide-top-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

// Slide - bottom
.yiz-tab-slide-bottom-enter-active,
.yiz-tab-slide-bottom-leave-active {
  transition:
    opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-tab-slide-bottom-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.yiz-tab-slide-bottom-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

// Slide - left
.yiz-tab-slide-left-enter-active,
.yiz-tab-slide-left-leave-active {
  transition:
    opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-tab-slide-left-enter-from {
  opacity: 0;
  transform: translateX(-8px);
}

.yiz-tab-slide-left-leave-to {
  opacity: 0;
  transform: translateX(8px);
}

// Slide - right
.yiz-tab-slide-right-enter-active,
.yiz-tab-slide-right-leave-active {
  transition:
    opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-tab-slide-right-enter-from {
  opacity: 0;
  transform: translateX(8px);
}

.yiz-tab-slide-right-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
