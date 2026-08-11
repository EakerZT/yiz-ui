<template>
  <component :is="renderTrigger()" />

  <AppTeleport>
    <transition :name="transitionName">
      <div
        v-if="visible"
        ref="popRef"
        class="yiz-popover-pop"
        :class="`yiz-popover-${effectivePlacement}`"
        :style="popStyle"
        @mouseenter="onPopupMouseEnter"
        @mouseleave="onPopupMouseLeave"
      >
        <div class="yiz-popover-content">
          <div v-if="title || $slots.title" class="yiz-popover-title">
            <slot name="title">{{ title }}</slot>
          </div>
          <div v-if="content || $slots.content" class="yiz-popover-body">
            <slot name="content">{{ content }}</slot>
          </div>
        </div>
        <div v-if="showArrow" class="yiz-popover-arrow" :style="arrowPosition" />
      </div>
    </transition>
  </AppTeleport>
</template>

<script lang="ts" setup>
import AppTeleport from '../app/AppTeleport.vue'
import { cloneVNode, computed, h, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch, type VNode } from 'vue'
import { useZIndexManager } from '../zIndex'
import { findFirstTriggerVNode } from '../triggerVNode'
import {
  createOverlayScope,
  disposeOverlayScope,
  injectOverlayScope,
  isInOverlayScope,
  provideOverlayScope,
  registerOverlayElement,
} from '../overlay/overlayScope'

type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right'
type PopoverTrigger = 'click' | 'hover' | 'focus'

const props = withDefaults(
  defineProps<{
    title?: string
    content?: string
    placement?: PopoverPlacement
    trigger?: PopoverTrigger
    disabled?: boolean
    width?: number | string
    showArrow?: boolean
  }>(),
  {
    title: '',
    content: '',
    placement: 'top',
    trigger: 'click',
    disabled: false,
    width: 260,
    showArrow: true,
  },
)

defineSlots<{
  default?: () => any
  title?: any
  content?: any
}>()

const emit = defineEmits<{
  openChange: [open: boolean]
}>()

const parentOverlayScope = injectOverlayScope()
const overlayScope = createOverlayScope(parentOverlayScope)
provideOverlayScope(overlayScope)

const openModel = defineModel<boolean>('open')
const slots = useSlots()
const triggerRef = ref<HTMLElement>()
const popRef = ref<HTMLDivElement>()
const innerOpen = ref(false)
const effectivePlacement = ref<PopoverPlacement>(props.placement)
const popPosition = ref<Record<string, string>>({})
const arrowPosition = ref<Record<string, string>>({})
const positioned = ref(false)
const currentZIndex = ref(0)
const zIndexManager = useZIndexManager()
let closeTimer: ReturnType<typeof setTimeout> | null = null
let unregisterParentOverlay: (() => void) | null = null

const visible = computed({
  get: () => openModel.value ?? innerOpen.value,
  set: (value: boolean) => {
    innerOpen.value = value
    openModel.value = value
    emit('openChange', value)
  },
})

const popStyle = computed(() => {
  const style: Record<string, string> = {
    ...popPosition.value,
    zIndex: String(currentZIndex.value),
    visibility: positioned.value ? 'visible' : 'hidden',
  }
  const width = toCssSize(props.width)
  if (width) {
    style.width = width
  }
  return style
})

const transitionName = computed(() => `yiz-popover-${effectivePlacement.value}`)

function updateTriggerElement(vnode: VNode) {
  triggerRef.value = vnode.el instanceof HTMLElement ? vnode.el : undefined
}

function clearTriggerElement(vnode: VNode) {
  if (triggerRef.value === vnode.el) {
    triggerRef.value = undefined
  }
}

function renderTrigger(): VNode {
  const child = findFirstTriggerVNode(slots.default?.() ?? [])
  if (child) {
    return cloneVNode(child, {
      class: { 'yiz-popover-trigger-open': visible.value },
      onClick: onTriggerClick,
      onMouseenter: onTriggerMouseEnter,
      onMouseleave: onTriggerMouseLeave,
      onFocus: onTriggerFocus,
      onBlur: onTriggerBlur,
      onVnodeMounted: updateTriggerElement,
      onVnodeUpdated: updateTriggerElement,
      onVnodeBeforeUnmount: clearTriggerElement,
    })
  }
  return h('span', {
    onVnodeMounted: updateTriggerElement,
    onVnodeUpdated: updateTriggerElement,
    onVnodeBeforeUnmount: clearTriggerElement,
  })
}

function toCssSize(value: number | string | undefined) {
  if (value == null || value === '') return undefined
  return typeof value === 'number' ? `${value}px` : value
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max))
}

function clearCloseTimer() {
  if (closeTimer !== null) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

function openPopover() {
  if (props.disabled) return
  clearCloseTimer()
  visible.value = true
}

function closePopover() {
  clearCloseTimer()
  visible.value = false
}

function delayClose() {
  clearCloseTimer()
  closeTimer = setTimeout(() => {
    closePopover()
  }, 120)
}

function onTriggerClick() {
  if (props.trigger !== 'click') return
  if (visible.value) {
    closePopover()
  } else {
    openPopover()
  }
}

function onTriggerMouseEnter() {
  if (props.trigger === 'hover') openPopover()
}

function onTriggerMouseLeave() {
  if (props.trigger === 'hover') delayClose()
}

function onTriggerFocus() {
  if (props.trigger === 'focus') openPopover()
}

function onTriggerBlur() {
  if (props.trigger === 'focus') delayClose()
}

function onPopupMouseEnter() {
  if (props.trigger === 'hover') clearCloseTimer()
}

function onPopupMouseLeave() {
  if (props.trigger === 'hover') delayClose()
}

function reposition() {
  const trigger = triggerRef.value
  const pop = popRef.value
  if (!trigger || !pop) return

  const tr = trigger.getBoundingClientRect()
  const pr = pop.getBoundingClientRect()
  const gap = props.showArrow ? 10 : 6
  const margin = 8
  const vw = window.innerWidth
  const vh = window.innerHeight

  let placement = props.placement
  if (placement === 'top' && tr.top - pr.height - gap < margin) placement = 'bottom'
  else if (placement === 'bottom' && tr.bottom + pr.height + gap > vh - margin) placement = 'top'
  else if (placement === 'left' && tr.left - pr.width - gap < margin) placement = 'right'
  else if (placement === 'right' && tr.right + pr.width + gap > vw - margin) placement = 'left'

  let left: number
  let top: number
  if (placement === 'top') {
    left = tr.left + tr.width / 2 - pr.width / 2
    top = tr.top - pr.height - gap
  } else if (placement === 'bottom') {
    left = tr.left + tr.width / 2 - pr.width / 2
    top = tr.bottom + gap
  } else if (placement === 'left') {
    left = tr.left - pr.width - gap
    top = tr.top + tr.height / 2 - pr.height / 2
  } else {
    left = tr.right + gap
    top = tr.top + tr.height / 2 - pr.height / 2
  }

  left = clamp(left, margin, vw - pr.width - margin)
  top = clamp(top, margin, vh - pr.height - margin)

  popPosition.value = {
    left: `${left}px`,
    top: `${top}px`,
  }
  if (placement === 'top' || placement === 'bottom') {
    arrowPosition.value = {
      left: `${clamp(tr.left + tr.width / 2 - left, 12, pr.width - 12)}px`,
    }
  } else {
    arrowPosition.value = {
      top: `${clamp(tr.top + tr.height / 2 - top, 12, pr.height - 12)}px`,
    }
  }
  effectivePlacement.value = placement
}

function onClickOutside(e: MouseEvent) {
  if (!visible.value || props.trigger !== 'click') return
  const target = e.target as HTMLElement
  if (triggerRef.value?.contains(target)) return
  if (popRef.value?.contains(target)) return
  if (isInOverlayScope(overlayScope, target)) return
  closePopover()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closePopover()
  }
}

function onReposition() {
  if (!visible.value) return
  reposition()
  positioned.value = true
}

watch(visible, async (open) => {
  if (open) {
    currentZIndex.value = zIndexManager.next()
    effectivePlacement.value = props.placement
    popPosition.value = {}
    arrowPosition.value = {}
    positioned.value = false
    await nextTick()
    if (!visible.value) return
    reposition()
    if (parentOverlayScope && popRef.value) {
      unregisterParentOverlay?.()
      unregisterParentOverlay = registerOverlayElement(parentOverlayScope, popRef.value)
    }
    positioned.value = true
  } else {
    arrowPosition.value = {}
    positioned.value = false
    unregisterParentOverlay?.()
    unregisterParentOverlay = null
  }
})

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) closePopover()
  },
)

watch(
  () => [props.placement, props.width, props.showArrow],
  () => {
    nextTick(onReposition)
  },
)

onMounted(() => {
  document.addEventListener('click', onClickOutside, true)
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onReposition, true)
  window.addEventListener('resize', onReposition)
})

onBeforeUnmount(() => {
  clearCloseTimer()
  unregisterParentOverlay?.()
  disposeOverlayScope(overlayScope)
  document.removeEventListener('click', onClickOutside, true)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onReposition, true)
  window.removeEventListener('resize', onReposition)
})
</script>

<style lang="less">
.yiz-popover-pop {
  position: fixed;
  font-size: var(--yiz-font-size-default);
  color: var(--yiz-color-text-primary);
  box-sizing: border-box;
}

.yiz-popover-content {
  background: var(--yiz-color-bg-elevated);
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-pane-border-radius);
  box-shadow: var(--yiz-shadow-elevated);
  overflow: hidden;
}

.yiz-popover-title {
  padding: 10px 12px;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  font-weight: var(--yiz-font-weight-semibold);
  line-height: 20px;
}

.yiz-popover-body {
  padding: 12px;
  line-height: var(--yiz-line-height-default);
  color: var(--yiz-color-text-secondary);
  word-break: break-word;
}

.yiz-popover-arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--yiz-color-bg-elevated);
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  transform: rotate(45deg);
}

.yiz-popover-top .yiz-popover-arrow {
  left: 50%;
  bottom: 3px;
  border-left: 0;
  border-top: 0;
}

.yiz-popover-bottom .yiz-popover-arrow {
  left: 50%;
  top: 3px;
  border-right: 0;
  border-bottom: 0;
}

.yiz-popover-left .yiz-popover-arrow {
  right: 3px;
  top: 50%;
  border-left: 0;
  border-bottom: 0;
}

.yiz-popover-right .yiz-popover-arrow {
  left: 3px;
  top: 50%;
  border-right: 0;
  border-top: 0;
}

.yiz-popover-top {
  padding-bottom: 8px;

  .yiz-popover-arrow {
    transform: translateX(-50%) rotate(45deg);
  }
}

.yiz-popover-bottom {
  padding-top: 8px;

  .yiz-popover-arrow {
    transform: translateX(-50%) rotate(45deg);
  }
}

.yiz-popover-left {
  padding-right: 8px;

  .yiz-popover-arrow {
    transform: translateY(-50%) rotate(45deg);
  }
}

.yiz-popover-right {
  padding-left: 8px;

  .yiz-popover-arrow {
    transform: translateY(-50%) rotate(45deg);
  }
}

.yiz-popover-top-enter-active,
.yiz-popover-top-leave-active,
.yiz-popover-bottom-enter-active,
.yiz-popover-bottom-leave-active,
.yiz-popover-left-enter-active,
.yiz-popover-left-leave-active,
.yiz-popover-right-enter-active,
.yiz-popover-right-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.yiz-popover-top-enter-from,
.yiz-popover-top-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.yiz-popover-bottom-enter-from,
.yiz-popover-bottom-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.yiz-popover-left-enter-from,
.yiz-popover-left-leave-to {
  opacity: 0;
  transform: translateX(-4px);
}

.yiz-popover-right-enter-from,
.yiz-popover-right-leave-to {
  opacity: 0;
  transform: translateX(4px);
}
</style>
