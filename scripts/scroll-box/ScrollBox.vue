<template>
  <div
    class="yiz-scroll-box"
    ref="hostRef"
    :style="hostStyle"
    @pointerenter="onHostPointerEnter"
    @pointerleave="onHostPointerLeave"
    @pointermove="onHostPointerMove"
  >
    <div class="yiz-scroll-box-viewport" ref="viewportRef" @scroll="onScroll">
      <slot />
    </div>

    <div
      ref="trackVRef"
      class="yiz-scroll-box-track yiz-scroll-box-track-v"
      :class="trackVClasses"
      :style="trackVStyle"
      @pointerenter="onTrackPointerEnter"
      @pointerleave="onTrackPointerLeave"
      @pointerdown="onTrackPointerDown($event, 'v')"
      @wheel="onScrollbarWheel($event, 'v')"
    >
      <div
        class="yiz-scroll-box-thumb yiz-scroll-box-thumb-v"
        @pointerdown.stop="onThumbPointerDown($event, 'v')"
      />
    </div>

    <div
      ref="trackHRef"
      class="yiz-scroll-box-track yiz-scroll-box-track-h"
      :class="trackHClasses"
      :style="trackHStyle"
      @pointerenter="onTrackPointerEnter"
      @pointerleave="onTrackPointerLeave"
      @pointerdown="onTrackPointerDown($event, 'h')"
      @wheel="onScrollbarWheel($event, 'h')"
    >
      <div
        class="yiz-scroll-box-thumb yiz-scroll-box-thumb-h"
        @pointerdown.stop="onThumbPointerDown($event, 'h')"
      />
    </div>

    <div v-if="vVisible && hVisible" class="yiz-scroll-box-corner" />
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// ==================== Props ====================

const props = withDefaults(
  defineProps<{
    height?: number | string
    maxHeight?: number | string
    width?: number | string
    autoHide?: 'never' | 'scroll' | 'move' | 'leave'
    autoHideDelay?: number
    theme?: string | null
    overflowX?: 'hidden' | 'visible' | 'scroll' | 'auto'
    overflowY?: 'hidden' | 'visible' | 'scroll' | 'auto'
  }>(),
  {
    autoHide: 'never',
    autoHideDelay: 1300,
    theme: null,
    overflowX: 'auto',
    overflowY: 'auto'
  }
)

defineSlots<{
  default?: any
}>()

// ==================== Refs ====================

const hostRef = ref<HTMLElement>()
const viewportRef = ref<HTMLElement>()
const trackVRef = ref<HTMLElement>()
const trackHRef = ref<HTMLElement>()

const scrollTop = ref(0)
const scrollLeft = ref(0)
const contentHeight = ref(0)
const contentWidth = ref(0)
const viewportHeight = ref(0)
const viewportWidth = ref(0)
const vVisible = ref(false)
const hVisible = ref(false)
const isRTL = ref(false)

// auto-hide state
const autoHideVisible = ref(true)
const autoHideInteracting = ref(false)
const mouseInHost = ref(false)

// drag state
let dragState: {
  dir: 'v' | 'h'
  startClient: number
  startScroll: number
} | null = null

// ==================== Timers ====================

let autoHideTimer: ReturnType<typeof setTimeout> | null = null
let autoHideScrollTimer: ReturnType<typeof setTimeout> | null = null

function clearAutoHideTimers() {
  if (autoHideTimer !== null) {
    clearTimeout(autoHideTimer)
    autoHideTimer = null
  }
  if (autoHideScrollTimer !== null) {
    clearTimeout(autoHideScrollTimer)
    autoHideScrollTimer = null
  }
}

// ==================== Computed ====================

const scrollPercentV = computed(() => {
  const overflow = contentHeight.value - viewportHeight.value
  return overflow > 0 ? scrollTop.value / overflow : 0
})

const scrollPercentH = computed(() => {
  const overflow = contentWidth.value - viewportWidth.value
  return overflow > 0 ? scrollLeft.value / overflow : 0
})

const viewportPercentV = computed(() => {
  return contentHeight.value > 0 ? Math.min(1, viewportHeight.value / contentHeight.value) : 1
})

const viewportPercentH = computed(() => {
  return contentWidth.value > 0 ? Math.min(1, viewportWidth.value / contentWidth.value) : 1
})

const hostStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.height !== undefined) {
    s['--yiz-scroll-box-height'] = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  if (props.maxHeight !== undefined) {
    s['--yiz-scroll-box-max-height'] =
      typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight
  }
  if (props.width !== undefined) {
    s['--yiz-scroll-box-width'] = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  s['--yiz-viewport-overflow-x'] = props.overflowX
  s['--yiz-viewport-overflow-y'] = props.overflowY
  return s
})

const scrollbarShowV = computed(() => vVisible.value && (autoHideVisible.value || autoHideInteracting.value || props.autoHide === 'never'))
const scrollbarShowH = computed(() => hVisible.value && (autoHideVisible.value || autoHideInteracting.value || props.autoHide === 'never'))

const showCorner = computed(() => vVisible.value && hVisible.value)

const trackVClasses = computed(() => {
  const c: Record<string, boolean> = {}
  c['yiz-scroll-box-track--active'] = vVisible.value
  c['yiz-scroll-box-track--auto-hidden'] = vVisible.value && !scrollbarShowV.value
  c['yiz-scroll-box-track--interacting'] = autoHideInteracting.value
  c['yiz-scroll-box-track--corner'] = showCorner.value
  if (props.theme) c[props.theme] = true
  return c
})

const trackHClasses = computed(() => {
  const c: Record<string, boolean> = {}
  c['yiz-scroll-box-track--active'] = hVisible.value
  c['yiz-scroll-box-track--auto-hidden'] = hVisible.value && !scrollbarShowH.value
  c['yiz-scroll-box-track--interacting'] = autoHideInteracting.value
  c['yiz-scroll-box-track--rtl'] = isRTL.value
  c['yiz-scroll-box-track--corner'] = showCorner.value
  if (props.theme) c[props.theme] = true
  return c
})

const trackVStyle = computed(() => ({
  '--yiz-scroll-percent': scrollPercentV.value,
  '--yiz-viewport-percent': viewportPercentV.value,
  '--yiz-scroll-direction': '0'
}))

const trackHStyle = computed(() => ({
  '--yiz-scroll-percent': scrollPercentH.value,
  '--yiz-viewport-percent': viewportPercentH.value,
  '--yiz-scroll-direction': isRTL.value ? '1' : '0'
}))

// ==================== Sync ====================

function sync() {
  const vp = viewportRef.value
  if (!vp) return

  const st = vp.scrollTop
  const sl = vp.scrollLeft
  const sh = vp.scrollHeight
  const sw = vp.scrollWidth
  const ch = vp.clientHeight
  const cw = vp.clientWidth

  scrollTop.value = st
  scrollLeft.value = sl
  contentHeight.value = sh
  contentWidth.value = sw
  viewportHeight.value = ch
  viewportWidth.value = cw

  // +1 tolerance for sub-pixel rounding
  vVisible.value = sh > ch + 1
  hVisible.value = sw > cw + 1
}

// ==================== Scroll ====================

function onScroll() {
  sync()
  handleAutoHideOnScroll()
}

// ==================== Auto-hide ====================

function manageAutoHide(show: boolean, delayless?: boolean) {
  clearAutoHideTimers()

  if (props.autoHide === 'never') {
    autoHideVisible.value = true
    return
  }

  if (show) {
    autoHideVisible.value = true
    return
  }

  if (delayless || props.autoHideDelay <= 0) {
    autoHideVisible.value = props.autoHide === 'leave' ? mouseInHost.value : false
  } else {
    autoHideTimer = setTimeout(() => {
      autoHideVisible.value = props.autoHide === 'leave' ? mouseInHost.value : false
      autoHideTimer = null
    }, props.autoHideDelay)
  }
}

function handleAutoHideOnScroll() {
  if (props.autoHide === 'never') return
  if (autoHideInteracting.value) return

  autoHideVisible.value = true
  clearAutoHideTimers()

  if (props.autoHide === 'scroll') {
    autoHideScrollTimer = setTimeout(() => {
      manageAutoHide(false)
      autoHideScrollTimer = null
    }, props.autoHideDelay)
  }
}

function onHostPointerEnter() {
  mouseInHost.value = true
  if (props.autoHide === 'leave') {
    manageAutoHide(true)
  }
}

function onHostPointerLeave() {
  mouseInHost.value = false
  if (props.autoHide === 'leave') {
    manageAutoHide(false)
  }
}

function onHostPointerMove() {
  if (props.autoHide === 'move') {
    manageAutoHide(true)
    // re-schedule hide
    clearAutoHideTimers()
    if (props.autoHideDelay > 0) {
      autoHideTimer = setTimeout(() => {
        autoHideVisible.value = false
        autoHideTimer = null
      }, props.autoHideDelay)
    }
  }
}

function onTrackPointerEnter() {
  autoHideInteracting.value = true
}

function onTrackPointerLeave() {
  autoHideInteracting.value = false
  if (props.autoHide !== 'never') {
    manageAutoHide(false)
  }
}

// ==================== Pointer drag ====================

function onThumbPointerDown(e: PointerEvent, dir: 'v' | 'h') {
  if (e.button !== 0) return
  if (!viewportRef.value) return

  const vp = viewportRef.value
  const thumb = e.currentTarget as HTMLElement

  dragState = {
    dir,
    startClient: dir === 'v' ? e.clientY : e.clientX,
    startScroll: dir === 'v' ? vp.scrollTop : vp.scrollLeft
  }

  thumb.setPointerCapture(e.pointerId)
  thumb.addEventListener('pointermove', onThumbPointerMove)
  thumb.addEventListener('pointerup', onThumbPointerUp)
  thumb.addEventListener('lostpointercapture', onThumbPointerUp)

  document.body.style.userSelect = 'none'
  autoHideInteracting.value = true
}

function onThumbPointerMove(e: PointerEvent) {
  if (!dragState || !viewportRef.value) return

  const vp = viewportRef.value
  const currentClient = dragState.dir === 'v' ? e.clientY : e.clientX
  const diff = currentClient - dragState.startClient

  const viewportSize = dragState.dir === 'v' ? viewportHeight.value : viewportWidth.value
  const contentSize = dragState.dir === 'v' ? contentHeight.value : contentWidth.value

  // deltaScroll = deltaPointer * contentSize / viewportSize
  // Derived from: the full track (viewportSize) maps to the full content overflow
  if (viewportSize > 0) {
    const ratio = contentSize / viewportSize
    const delta = diff * ratio
    if (dragState.dir === 'v') {
      vp.scrollTop = dragState.startScroll + delta
    } else {
      vp.scrollLeft = dragState.startScroll + delta
    }
  }
}

function onThumbPointerUp(e: PointerEvent) {
  const thumb = e.currentTarget as HTMLElement
  thumb.removeEventListener('pointermove', onThumbPointerMove)
  thumb.removeEventListener('pointerup', onThumbPointerUp)
  thumb.removeEventListener('lostpointercapture', onThumbPointerUp)

  dragState = null
  document.body.style.userSelect = ''

  // if the pointer is still over a track after release, keep interacting state
  const elm = document.elementFromPoint(e.clientX, e.clientY)
  const overTrack =
    elm && (elm.classList.contains('yiz-scroll-box-track') || elm.closest('.yiz-scroll-box-track'))

  autoHideInteracting.value = !!overTrack

  if (!overTrack && props.autoHide !== 'never') {
    manageAutoHide(false)
  }
}

// ==================== Track click ====================

function onTrackPointerDown(e: PointerEvent, dir: 'v' | 'h') {
  if (e.button !== 0) return
  if (!viewportRef.value) return

  // thumb handles its own pointerdown (stopped propagation)
  const target = e.target as HTMLElement
  if (target.classList.contains('yiz-scroll-box-thumb')) return

  const vp = viewportRef.value
  const track = e.currentTarget as HTMLElement
  const rect = track.getBoundingClientRect()

  if (dir === 'v') {
    const clickOffset = e.clientY - rect.top
    const ratio = clickOffset / rect.height
    const overflow = contentHeight.value - viewportHeight.value
    vp.scrollTop = ratio * overflow
  } else {
    const clickOffset = e.clientX - rect.left
    const ratio = clickOffset / rect.width
    const overflow = contentWidth.value - viewportWidth.value
    vp.scrollLeft = ratio * overflow
  }
}

// ==================== Wheel forwarding ====================

function onScrollbarWheel(e: WheelEvent, _dir: 'v' | 'h') {
  const vp = viewportRef.value
  if (!vp) return

  e.preventDefault()
  vp.scrollTop += e.deltaY
  vp.scrollLeft += e.deltaX

  handleAutoHideOnScroll()
}

// ==================== Lifecycle ====================

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  sync()

  // observe viewport for size changes
  if (viewportRef.value) {
    resizeObserver = new ResizeObserver(() => {
      sync()
      handleAutoHideOnScroll()
    })
    resizeObserver.observe(viewportRef.value)
  }

  // detect RTL
  if (viewportRef.value) {
    const cs = getComputedStyle(viewportRef.value)
    isRTL.value = cs.direction === 'rtl'
  }

  // initial auto-hide state
  if (props.autoHide !== 'never') {
    autoHideVisible.value = props.autoHide !== 'leave'
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  clearAutoHideTimers()

  if (dragState) {
    document.body.style.userSelect = ''
    dragState = null
  }
})
</script>

<style lang="less">
/* ==================== CSS @property declarations ==================== */
@property --yiz-scroll-percent {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}
@property --yiz-viewport-percent {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}
@property --yiz-scroll-direction {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}

/* ==================== Host ==================== */
.yiz-scroll-box {
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  height: var(--yiz-scroll-box-height, auto);
  max-height: var(--yiz-scroll-box-max-height, none);
  width: var(--yiz-scroll-box-width, auto);
}

/* ==================== Viewport ==================== */
.yiz-scroll-box-viewport {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  overflow-x: var(--yiz-viewport-overflow-x, auto);
  overflow-y: var(--yiz-viewport-overflow-y, auto);
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

/* ==================== Track ==================== */
.yiz-scroll-box-track {
  position: absolute;
  z-index: 1;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s, visibility 0.15s;
  pointer-events: none;
  container-type: size;

  /* track sizing custom properties */
  --yiz-scroll-track-offset: 2px;
  --yiz-scroll-track-size: 8px;
  --yiz-scroll-thumb-min-size: 20px;

  /* theme custom properties (defaults) */
  --yiz-scroll-thumb-bg: rgba(0, 0, 0, 0.18);
  --yiz-scroll-thumb-bg-hover: rgba(0, 0, 0, 0.32);
  --yiz-scroll-thumb-bg-active: rgba(0, 0, 0, 0.45);
  --yiz-scroll-thumb-radius: 4px;
}

/* Show when overflow exists */
.yiz-scroll-box-track--active:not(.yiz-scroll-box-track--auto-hidden) {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

/* Interaction overrides auto-hide */
.yiz-scroll-box-track--active.yiz-scroll-box-track--interacting {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}

/* Vertical track */
.yiz-scroll-box-track-v {
  top: var(--yiz-scroll-track-offset);
  right: var(--yiz-scroll-track-offset);
  bottom: var(--yiz-scroll-track-offset);
  width: var(--yiz-scroll-track-size);
}

/* Horizontal track */
.yiz-scroll-box-track-h {
  left: var(--yiz-scroll-track-offset);
  right: var(--yiz-scroll-track-offset);
  bottom: var(--yiz-scroll-track-offset);
  height: var(--yiz-scroll-track-size);
}

/* When both tracks visible, shorten to make room for corner */
.yiz-scroll-box-track--corner.yiz-scroll-box-track-v {
  bottom: calc(var(--yiz-scroll-track-offset) + var(--yiz-scroll-track-size));
}
.yiz-scroll-box-track--corner.yiz-scroll-box-track-h {
  right: calc(var(--yiz-scroll-track-offset) + var(--yiz-scroll-track-size));
}

/* ==================== Thumb ==================== */
.yiz-scroll-box-thumb {
  position: absolute;
  border-radius: var(--yiz-scroll-thumb-radius);
  background: var(--yiz-scroll-thumb-bg);
  transition: background 0.15s;
  cursor: pointer;

  &:hover {
    background: var(--yiz-scroll-thumb-bg-hover);
  }

  &:active {
    background: var(--yiz-scroll-thumb-bg-active);
  }
}

/* Vertical thumb */
.yiz-scroll-box-thumb-v {
  left: 1px;
  right: 1px;
  top: calc(var(--yiz-scroll-percent) * 100%);
  transform: translateY(calc(var(--yiz-scroll-percent) * -100%));
  height: calc(var(--yiz-viewport-percent) * 100%);
  min-height: var(--yiz-scroll-thumb-min-size);
}

/* Horizontal thumb */
.yiz-scroll-box-thumb-h {
  top: 1px;
  bottom: 1px;
  /* --yiz-scroll-direction: 0 = LTR/default, 1 = RTL/reversed */
  --_yiz-scroll-percent-directional: calc(
    var(--yiz-scroll-percent) -
    (var(--yiz-scroll-percent) + (1 - var(--yiz-scroll-percent)) * -1) *
    var(--yiz-scroll-direction)
  );
  left: calc(var(--_yiz-scroll-percent-directional) * 100%);
  transform: translateX(calc(var(--_yiz-scroll-percent-directional) * -100%));
  width: calc(var(--yiz-viewport-percent) * 100%);
  min-width: var(--yiz-scroll-thumb-min-size);
}

/* Container query support: use cqw/cqh for more accurate sizing */
@supports (container-type: size) {
  .yiz-scroll-box-thumb-v {
    top: auto;
    transform: translateY(
      calc(
        (var(--yiz-scroll-percent) * 100cqh) +
        (var(--yiz-scroll-percent) * -100%)
      )
    );
  }

  .yiz-scroll-box-thumb-h {
    left: auto;
    transform: translateX(
      calc(
        (var(--_yiz-scroll-percent-directional) * 100cqw) +
        (var(--_yiz-scroll-percent-directional) * -100%)
      )
    );
  }

  .yiz-scroll-box-track--rtl .yiz-scroll-box-thumb-h {
    left: 0;
  }
}

/* ==================== Corner ==================== */
.yiz-scroll-box-corner {
  position: absolute;
  right: var(--yiz-scroll-track-offset);
  bottom: var(--yiz-scroll-track-offset);
  width: var(--yiz-scroll-track-size);
  height: var(--yiz-scroll-track-size);
  background: var(--yiz-scroll-thumb-bg);
  border-radius: 0 0 var(--yiz-scroll-thumb-radius) 0;
  z-index: 1;
}

/* ==================== Print ==================== */
@media print {
  .yiz-scroll-box-track {
    display: none !important;
  }
  .yiz-scroll-box-viewport {
    overflow: visible !important;
  }
}
</style>
