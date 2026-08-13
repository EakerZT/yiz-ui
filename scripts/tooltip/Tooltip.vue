<template>
  <component :is="renderTrigger()" />

  <AppTeleport>
    <transition name="yiz-tooltip-fade">
      <div
        v-if="visible"
        ref="popRef"
        class="yiz-tooltip-pop"
        :class="`yiz-tooltip-${effectivePlacement}`"
        :style="popStyle"
      >
        <div class="yiz-tooltip-content">
          <slot name="content">{{ content }}</slot>
        </div>
        <div class="yiz-tooltip-arrow" />
      </div>
    </transition>
  </AppTeleport>
</template>

<script lang="ts" setup>
import AppTeleport from '../app/AppTeleport.vue'
import { cloneVNode, h, nextTick, onBeforeUnmount, ref, useSlots, watch, type VNode } from 'vue'
import { findFirstTriggerVNode } from '../triggerVNode'

const props = withDefaults(
  defineProps<{
    content?: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    placement: 'top',
  },
)

defineSlots<{
  default?: () => any
  content?: any
}>()

const slots = useSlots()
const triggerRef = ref<HTMLElement>()
const popRef = ref<HTMLDivElement>()
const visible = ref(false)
const effectivePlacement = ref<'top' | 'bottom' | 'left' | 'right'>(props.placement)
const popStyle = ref<Record<string, string>>({})
let hideTimer: ReturnType<typeof setTimeout> | null = null

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
      onMouseenter: onMouseEnter,
      onMouseleave: onMouseLeave,
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

function clearHideTimer() {
  if (hideTimer !== null) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

function onMouseEnter() {
  clearHideTimer()
  effectivePlacement.value = props.placement
  visible.value = true
}

function onMouseLeave() {
  clearHideTimer()
  hideTimer = setTimeout(() => {
    visible.value = false
  }, 100)
}

function reposition() {
  const trigger = triggerRef.value
  const pop = popRef.value
  if (!trigger || !pop) return
  const tr = trigger.getBoundingClientRect()
  const pr = pop.getBoundingClientRect()
  const gap = 0
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

  left = Math.max(margin, Math.min(left, vw - pr.width - margin))
  top = Math.max(margin, Math.min(top, vh - pr.height - margin))

  popStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    zIndex: '9999',
  }
  effectivePlacement.value = placement
}

watch(visible, async (val) => {
  if (val) {
    await nextTick()
    reposition()
  }
})

function onWindowScroll() {
  if (visible.value) reposition()
}

function onWindowResize() {
  if (visible.value) reposition()
}

window.addEventListener('scroll', onWindowScroll, true)
window.addEventListener('resize', onWindowResize)

onBeforeUnmount(() => {
  clearHideTimer()
  window.removeEventListener('scroll', onWindowScroll, true)
  window.removeEventListener('resize', onWindowResize)
})
</script>

<style lang="less">
.yiz-tooltip-pop {
  position: fixed;
  white-space: nowrap;
  font-size: 13px;
  pointer-events: none;
}

.yiz-tooltip-content {
  color: var(--yiz-color-tooltip-text);
  background: var(--yiz-color-tooltip-bg);
  border-radius: var(--yiz-pane-border-radius);
  padding: 6px 12px;
  line-height: 1.4;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
}

.yiz-tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 5px solid transparent;
}

// top
.yiz-tooltip-top {
  padding-bottom: 8px;

  .yiz-tooltip-arrow {
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: var(--yiz-color-tooltip-bg);
  }
}

// bottom
.yiz-tooltip-bottom {
  padding-top: 8px;

  .yiz-tooltip-arrow {
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    border-bottom-color: var(--yiz-color-tooltip-bg);
  }
}

// left
.yiz-tooltip-left {
  padding-right: 8px;

  .yiz-tooltip-arrow {
    right: -2px;
    top: 50%;
    transform: translateY(-50%);
    border-left-color: var(--yiz-color-tooltip-bg);
  }
}

// right
.yiz-tooltip-right {
  padding-left: 8px;

  .yiz-tooltip-arrow {
    left: -2px;
    top: 50%;
    transform: translateY(-50%);
    border-right-color: var(--yiz-color-tooltip-bg);
  }
}

// transition
.yiz-tooltip-fade-enter-active,
.yiz-tooltip-fade-leave-active {
  transition: opacity 0.2s;
}

.yiz-tooltip-fade-enter-from,
.yiz-tooltip-fade-leave-to {
  opacity: 0;
}
</style>
