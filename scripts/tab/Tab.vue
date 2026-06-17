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
        <div class="yiz-tab-header-inner">
          <div
            v-for="(pane, idx) in panes"
            :key="pane.key ?? idx"
            :ref="(el: any) => setItemRef(el, idx)"
            class="yiz-tab-header-item"
            :class="{
              'yiz-tab-header-item-active': isActive(pane),
              'yiz-tab-header-item-disabled': pane.disabled,
              'yiz-tab-header-item-closable': props.type === 'card' && pane.closable
            }"
            @click="onTabClick(pane)"
          >
            <component
              v-if="pane.labelSlot"
              :is="getLabelComp(pane.labelSlot)"
              class="yiz-tab-header-item-label"
            />
            <span v-else class="yiz-tab-header-item-label">{{ pane.label }}</span>
            <span
              v-if="props.type === 'card' && pane.closable"
              class="yiz-tab-header-item-close"
              @click.stop="onClosePane(pane)"
            >
              <svg viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 5.293l4.146-4.147a.5.5 0 01.708.708L6.707 6l4.147 4.146a.5.5 0 01-.708.708L6 6.707l-4.146 4.147a.5.5 0 01-.708-.708L5.293 6 1.146 1.854a.5.5 0 11.708-.708L6 5.293z" />
              </svg>
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
import { computed, Fragment, h, nextTick, provide, reactive, ref, useSlots, watch, type CSSProperties } from 'vue'
import TabPaneComp from './TabPane.vue'
import ScrollBox from '../scroll-box/ScrollBox.vue'

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
    overflow: 'hidden'
  }
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

const panes = computed<PaneData[]>(() => {
  const nodes = slots.default?.() ?? []
  const paneVNodes = collectPaneVNodes(nodes)
  return paneVNodes
    .map((vnode, idx) => {
      const p = vnode.props as Record<string, any>
      return {
        label: p.label ?? `Tab ${idx + 1}`,
        key: vnode.key ?? p.key ?? idx,
        disabled: p.disabled != null && p.disabled !== false,
        closable: p.closable != null && p.closable !== false,
        labelSlot: (vnode as any).children?.label as (() => any) | undefined
      }
    })
    .filter((v) => !closedKeys.has(v.key))
})

if (active.value == null && panes.value.length > 0) {
  active.value = panes.value[0]?.key
}

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
  if (active.value === pane.key) {
    const remaining = panes.value.filter(p => p.key !== pane.key)
    if (remaining.length > 0) {
      active.value = remaining[0].key
    }
  }
}

const isVertical = computed(() => props.direction === 'left' || props.direction === 'right')

function getLabelComp(slotFn: (() => any) | undefined) {
  if (!slotFn) return null
  return { render: () => h(Fragment, slotFn()) }
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
    top: el.offsetTop
  }
}

watch([active, panes, () => props.direction], () => {
  nextTick(updateBarMeasure)
}, { immediate: true })

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
  'yiz-tab-flex': props.flex
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
  overflow: computed(() => props.overflow)
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
}

.yiz-tab-top .yiz-tab-header,
.yiz-tab-bottom .yiz-tab-header {
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  min-height: 40px;
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
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
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
  padding: 12px 16px;
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
    left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-tab-bottom .yiz-tab-header-bar {
  top: 0;
  height: 2px;
  transition:
    left 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

// 垂直 bar（left/right）
.yiz-tab-left .yiz-tab-header-bar {
  right: 0;
  width: 2px;
  transition:
    top 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-tab-right .yiz-tab-header-bar {
  left: 0;
  width: 2px;
  transition:
    top 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  .yiz-tab-header-scroll {
    // card 不需要底部/侧边 border，由 item 自己画
  }

  .yiz-tab-header-item {
    border: 1px solid var(--yiz-color-border, #d9d9d9);
    border-bottom-color: var(--yiz-color-border, #d9d9d9);
    border-radius: 4px 4px 0 0;
    margin-right: 2px;
    background: #fafafa;

    &:hover {
      color: var(--yiz-color-primary);
    }

    &.yiz-tab-header-item-active {
      background: var(--yiz-color-bg, #fff);
      border-bottom-color: var(--yiz-color-bg, #fff);
    }

    &.yiz-tab-header-item-disabled {
      background: #f5f5f5;
      color: #ccc;
    }
  }

  .yiz-tab-content {
    border: 1px solid var(--yiz-color-border, #d9d9d9);
    border-top: none;
    border-radius: 0 0 4px 4px;
    padding: 12px;
  }

  // bar 在 card 模式下隐藏（边框自身形成视觉连接）
  .yiz-tab-header-bar {
    display: none;
  }
}

// card + bottom
.yiz-tab-type-card.yiz-tab-bottom {
  .yiz-tab-header-item {
    border-radius: 0 0 4px 4px;
    border-top-color: var(--yiz-color-border, #d9d9d9);
    border-bottom-color: var(--yiz-color-border, #d9d9d9);

    &.yiz-tab-header-item-active {
      border-top-color: var(--yiz-color-bg, #fff);
    }
  }

  .yiz-tab-content {
    border: 1px solid var(--yiz-color-border, #d9d9d9);
    border-bottom: none;
    border-radius: 4px 4px 0 0;
  }
}

// card + left
.yiz-tab-type-card.yiz-tab-left {
  .yiz-tab-header-item {
    border-radius: 4px 0 0 4px;
    margin-right: 0;
    margin-bottom: 2px;
    border-right-color: var(--yiz-color-border, #d9d9d9);

    &.yiz-tab-header-item-active {
      border-right-color: var(--yiz-color-bg, #fff);
    }
  }

  .yiz-tab-content {
    border: 1px solid var(--yiz-color-border, #d9d9d9);
    border-left: none;
    border-radius: 0 4px 4px 0;
  }
}

// card + right
.yiz-tab-type-card.yiz-tab-right {
  .yiz-tab-header-item {
    border-radius: 0 4px 4px 0;
    margin-left: 0;
    margin-bottom: 2px;
    border-left-color: var(--yiz-color-border, #d9d9d9);

    &.yiz-tab-header-item-active {
      border-left-color: var(--yiz-color-bg, #fff);
    }
  }

  .yiz-tab-content {
    border: 1px solid var(--yiz-color-border, #d9d9d9);
    border-right: none;
    border-radius: 4px 0 0 4px;
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
  color: #999;
  transition:
    color 0.2s,
    background-color 0.2s;
  flex-shrink: 0;

  &:hover {
    color: #333;
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

  .yiz-tab-content {
    overflow: hidden;
  }

  .yiz-tab-pane {
    height: 100%;
  }
}

.yiz-tab-flex.yiz-tab-top,
.yiz-tab-flex.yiz-tab-bottom {
  .yiz-tab-header {
    flex-shrink: 0;
  }

  .yiz-tab-content {
    flex: 1;
    min-height: 0;
  }
}

.yiz-tab-flex.yiz-tab-left,
.yiz-tab-flex.yiz-tab-right {
  .yiz-tab-header {
    flex-shrink: 0;
  }

  .yiz-tab-content {
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
