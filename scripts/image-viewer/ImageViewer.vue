<template>
  <Transition name="yiz-image-viewer-fade" appear @after-leave="emit('afterLeave')">
    <div
      v-if="show"
      ref="viewerRef"
      class="yiz-image-viewer"
      :style="{ zIndex: currentZIndex }"
      role="dialog"
      aria-modal="true"
      :aria-label="t('imageViewer.ariaLabel')"
      tabindex="-1"
      @click.self="onMaskClick"
    >
      <button
        ref="closeButtonRef"
        class="yiz-image-viewer-action yiz-image-viewer-close"
        type="button"
        :aria-label="t('common.close')"
        :title="t('common.close')"
        @click="close"
      >
        <Icon :icon="Dismiss20Regular" size="20" />
      </button>

      <div class="yiz-image-viewer-stage" @click.self="onMaskClick">
        <div
          ref="stageRef"
          class="yiz-image-viewer-canvas"
          :style="safeAreaStyle"
          :class="{
            'yiz-image-viewer-canvas-movable': options.movable && !loadError,
            'yiz-image-viewer-canvas-dragging': dragging,
          }"
          @click.self="onMaskClick"
          @dblclick="onDoubleClick"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
          @wheel="onWheel"
        >
          <img
            :key="`${currentIndex}-${currentItem.url}`"
            ref="imageRef"
            class="yiz-image-viewer-image"
            :class="{ 'yiz-image-viewer-image-hidden': loading || loadError }"
            :src="currentItem.url"
            :alt="currentItem.filename"
            :style="imageStyle"
            draggable="false"
            @load="onImageLoad"
            @error="onImageError"
          />

          <div v-if="loading" class="yiz-image-viewer-status" role="status">
            <span class="yiz-image-viewer-spinner" />
            <span>{{ t('imageViewer.loading') }}</span>
          </div>
          <div v-else-if="loadError" class="yiz-image-viewer-status" role="alert">
            <Icon :icon="ImageOff24Regular" size="28" />
            <span>{{ t('imageViewer.loadError') }}</span>
          </div>
        </div>

        <button
          v-if="items.length > 1"
          ref="previousButtonRef"
          class="yiz-image-viewer-nav yiz-image-viewer-nav-prev"
          type="button"
          :disabled="previousDisabled"
          :aria-label="t('imageViewer.previous')"
          :title="t('imageViewer.previous')"
          @pointerdown.stop
          @dblclick.stop
          @click="previous"
        >
          <Icon :icon="ChevronLeft28Regular" size="28" />
        </button>

        <button
          v-if="items.length > 1"
          ref="nextButtonRef"
          class="yiz-image-viewer-nav yiz-image-viewer-nav-next"
          type="button"
          :disabled="nextDisabled"
          :aria-label="t('imageViewer.next')"
          :title="t('imageViewer.next')"
          @pointerdown.stop
          @dblclick.stop
          @click="next"
        >
          <Icon :icon="ChevronRight28Regular" size="28" />
        </button>
      </div>

      <div ref="footerRef" class="yiz-image-viewer-footer">
        <div class="yiz-image-viewer-meta yiz-image-viewer-footer-meta">
          <span class="yiz-image-viewer-filename" :title="currentItem.filename">{{ currentItem.filename }}</span>
          <span v-if="items.length > 1" class="yiz-image-viewer-counter">
            {{ t('imageViewer.counter', { current: currentIndex + 1, total: items.length }) }}
          </span>
        </div>

        <div
          v-if="options.navbar && items.length > 1"
          ref="navbarRef"
          class="yiz-image-viewer-navbar"
          :aria-label="t('imageViewer.navbar')"
        >
          <button
            v-for="(item, index) in items"
            :key="`${index}-${item.url}`"
            class="yiz-image-viewer-thumbnail"
            :class="{ 'yiz-image-viewer-thumbnail-active': index === currentIndex }"
            type="button"
            :data-index="index"
            :aria-current="index === currentIndex ? 'true' : undefined"
            :aria-label="t('imageViewer.goTo', { index: index + 1, filename: item.filename })"
            :title="item.filename"
            @click="goTo(index)"
          >
            <img :src="item.url" alt="" draggable="false" />
          </button>
        </div>

        <div
          v-if="options.toolbar || options.download"
          class="yiz-image-viewer-toolbar"
          :aria-label="t('imageViewer.toolbar')"
        >
          <template v-if="options.toolbar">
            <button
              class="yiz-image-viewer-tool"
              type="button"
              :disabled="!options.zoomable || scale <= options.minZoomRatio"
              :aria-label="t('imageViewer.zoomOut')"
              :title="t('imageViewer.zoomOut')"
              @click="zoomOut"
            >
              <Icon :icon="ZoomOut20Regular" size="20" />
            </button>
            <button
              class="yiz-image-viewer-ratio"
              type="button"
              :disabled="!options.zoomable"
              :aria-label="t('imageViewer.resetZoom')"
              :title="t('imageViewer.resetZoom')"
              @click="resetZoom"
            >
              {{ zoomPercentage }}%
            </button>
            <button
              class="yiz-image-viewer-tool"
              type="button"
              :disabled="!options.zoomable || scale >= options.maxZoomRatio"
              :aria-label="t('imageViewer.zoomIn')"
              :title="t('imageViewer.zoomIn')"
              @click="zoomIn"
            >
              <Icon :icon="ZoomIn20Regular" size="20" />
            </button>
            <span class="yiz-image-viewer-toolbar-divider" />
            <button
              class="yiz-image-viewer-tool"
              type="button"
              :disabled="!options.rotatable"
              :aria-label="t('imageViewer.rotateLeft')"
              :title="t('imageViewer.rotateLeft')"
              @click="rotateLeft"
            >
              <Icon :icon="ArrowRotateCounterclockwise20Regular" size="20" />
            </button>
            <button
              class="yiz-image-viewer-tool"
              type="button"
              :disabled="!options.rotatable"
              :aria-label="t('imageViewer.rotateRight')"
              :title="t('imageViewer.rotateRight')"
              @click="rotateRight"
            >
              <Icon :icon="ArrowRotateClockwise20Regular" size="20" />
            </button>
            <button
              class="yiz-image-viewer-tool"
              type="button"
              :aria-label="t('imageViewer.reset')"
              :title="t('imageViewer.reset')"
              @click="resetTransform"
            >
              <Icon :icon="ArrowReset20Regular" size="20" />
            </button>
          </template>
          <span v-if="options.toolbar && options.download" class="yiz-image-viewer-toolbar-divider" />
          <a
            v-if="options.download"
            class="yiz-image-viewer-tool"
            :href="currentItem.url"
            :download="currentItem.filename"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="t('imageViewer.download')"
            :title="t('imageViewer.download')"
          >
            <Icon :icon="ArrowDownload20Regular" size="20" />
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import {
  ArrowDownload20Regular,
  ArrowReset20Regular,
  ArrowRotateClockwise20Regular,
  ArrowRotateCounterclockwise20Regular,
  ChevronLeft28Regular,
  ChevronRight28Regular,
  Dismiss20Regular,
  ImageOff24Regular,
  ZoomIn20Regular,
  ZoomOut20Regular,
} from '@vicons/fluent'
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch, type CSSProperties } from 'vue'
import { Icon } from '../icon'
import { useLocale } from '../locale'
import { useOptionalModalLayer, type ModalLayerContext } from '../overlay/modalLayer'
import { useModalFocus } from '../overlay/useModalFocus'
import { useZIndexManager } from '../zIndex'
import type { ImageViewerItem, ResolvedImageViewerOptions } from './types'

const props = defineProps<{
  show: boolean
  items: ImageViewerItem[]
  options: ResolvedImageViewerOptions
  modalLayerParent?: ModalLayerContext | null
}>()

const emit = defineEmits<{
  close: []
  afterLeave: []
}>()

const t = useLocale()
const viewerRef = ref<HTMLElement>()
const stageRef = ref<HTMLElement>()
const imageRef = ref<HTMLImageElement>()
const navbarRef = ref<HTMLElement>()
const footerRef = ref<HTMLElement>()
const closeButtonRef = ref<HTMLElement>()
const previousButtonRef = ref<HTMLElement>()
const nextButtonRef = ref<HTMLElement>()
const currentIndex = ref(props.options.initialIndex)
const currentZIndex = ref(0)
const zIndexManager = useZIndexManager()
const visible = computed(() => props.show)
const modalLayer = useOptionalModalLayer(props.modalLayerParent)
const modalFocus = useModalFocus(visible, viewerRef)

const scale = ref(1)
const rotation = ref(0)
const offset = reactive({ x: 0, y: 0 })
const loading = ref(true)
const loadError = ref(false)
const dragging = ref(false)
const safeArea = reactive({ top: 16, right: 16, bottom: 16, left: 16 })
let activePointerId: number | null = null
let dragStart = { x: 0, y: 0, offsetX: 0, offsetY: 0 }
let dragMoved = false
let suppressMaskClick = false
let suppressMaskClickTimer: ReturnType<typeof setTimeout> | undefined

const currentItem = computed(() => props.items[currentIndex.value])
const zoomPercentage = computed(() => Math.round(scale.value * 100))
const previousDisabled = computed(() => !props.options.loop && currentIndex.value === 0)
const nextDisabled = computed(() => !props.options.loop && currentIndex.value === props.items.length - 1)
const imageStyle = computed<CSSProperties>(() => ({
  transform: `translate3d(${offset.x}px, ${offset.y}px, 0) rotate(${rotation.value}deg) scale(${scale.value})`,
}))
const safeAreaStyle = computed<CSSProperties>(() => ({
  '--yiz-image-viewer-safe-top': `${safeArea.top}px`,
  '--yiz-image-viewer-safe-right': `${safeArea.right}px`,
  '--yiz-image-viewer-safe-bottom': `${safeArea.bottom}px`,
  '--yiz-image-viewer-safe-left': `${safeArea.left}px`,
}))

let originalBodyOverflow = ''
let safeAreaObserver: ResizeObserver | undefined

function handleVisibleChange(value: boolean) {
  if (value) {
    currentZIndex.value = zIndexManager.next()
    originalBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    modalLayer.active()
  } else {
    document.body.style.overflow = originalBodyOverflow
    modalLayer.inactive()
  }
}

watch(visible, handleVisibleChange, { immediate: true })

watch(currentIndex, async (index) => {
  loading.value = true
  loadError.value = false
  resetTransform()
  props.options.onIndexChange?.(index, props.items[index])
  await nextTick()
  scrollCurrentThumbnail(index, 'smooth')
  updateSafeArea()
})

function updateSafeArea() {
  const stage = stageRef.value
  if (!stage) return

  const stageRect = stage.getBoundingClientRect()
  const closeRect = closeButtonRef.value?.getBoundingClientRect()
  const previousRect = previousButtonRef.value?.getBoundingClientRect()
  const nextRect = nextButtonRef.value?.getBoundingClientRect()
  const footerRect = footerRef.value?.getBoundingClientRect()
  const gap = 16

  safeArea.top = closeRect ? Math.max(gap, closeRect.bottom - stageRect.top + gap) : gap
  safeArea.left = previousRect ? Math.max(gap, previousRect.right - stageRect.left + gap) : gap
  safeArea.right = nextRect ? Math.max(gap, stageRect.right - nextRect.left + gap) : gap
  safeArea.bottom = footerRect ? Math.max(gap, stageRect.bottom - footerRect.top + gap) : gap
}

function scrollCurrentThumbnail(index: number, behavior: ScrollBehavior) {
  navbarRef.value
    ?.querySelector<HTMLElement>(`[data-index="${index}"]`)
    ?.scrollIntoView({ behavior, block: 'nearest', inline: 'center' })
}

function clampScale(value: number) {
  return Math.min(props.options.maxZoomRatio, Math.max(props.options.minZoomRatio, value))
}

function changeZoom(direction: 1 | -1) {
  if (!props.options.zoomable) return
  const factor = 1 + direction * props.options.zoomRatio
  scale.value = clampScale(Number((scale.value * factor).toFixed(4)))
}

function zoomIn() {
  changeZoom(1)
}

function zoomOut() {
  changeZoom(-1)
}

function resetZoom() {
  if (!props.options.zoomable) return
  scale.value = clampScale(1)
  offset.x = 0
  offset.y = 0
}

function rotateLeft() {
  if (props.options.rotatable) rotation.value -= 90
}

function rotateRight() {
  if (props.options.rotatable) rotation.value += 90
}

function resetTransform() {
  scale.value = clampScale(1)
  rotation.value = 0
  offset.x = 0
  offset.y = 0
}

function goTo(index: number) {
  if (index >= 0 && index < props.items.length) {
    currentIndex.value = index
    return
  }
  if (!props.options.loop) return
  currentIndex.value = index < 0 ? props.items.length - 1 : 0
}

function previous() {
  goTo(currentIndex.value - 1)
}

function next() {
  goTo(currentIndex.value + 1)
}

function close() {
  emit('close')
}

function onMaskClick() {
  if (suppressMaskClick) return
  if (props.options.maskClosable) close()
}

function onImageLoad() {
  loading.value = false
  loadError.value = false
}

function onImageError() {
  loading.value = false
  loadError.value = true
}

function onWheel(event: WheelEvent) {
  if (!props.options.zoomable || !props.options.zoomOnWheel) return
  event.preventDefault()
  changeZoom(event.deltaY < 0 ? 1 : -1)
}

function onDoubleClick(event: MouseEvent) {
  if (!props.options.zoomable || !props.options.toggleOnDblclick) return
  if (event.target !== imageRef.value) return
  scale.value = Math.abs(scale.value - 1) < 0.001 ? clampScale(2) : clampScale(1)
  offset.x = 0
  offset.y = 0
}

function onPointerDown(event: PointerEvent) {
  if (!props.options.movable || loadError.value || event.button !== 0 || event.target !== imageRef.value) return
  event.preventDefault()
  activePointerId = event.pointerId
  dragging.value = true
  dragMoved = false
  dragStart = {
    x: event.clientX,
    y: event.clientY,
    offsetX: offset.x,
    offsetY: offset.y,
  }
  stageRef.value?.setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value || activePointerId !== event.pointerId) return
  const deltaX = event.clientX - dragStart.x
  const deltaY = event.clientY - dragStart.y
  if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) dragMoved = true
  offset.x = dragStart.offsetX + deltaX
  offset.y = dragStart.offsetY + deltaY
}

function onPointerUp(event: PointerEvent) {
  if (activePointerId !== event.pointerId) return
  if (stageRef.value?.hasPointerCapture(event.pointerId)) stageRef.value.releasePointerCapture(event.pointerId)
  if (dragMoved) {
    suppressMaskClick = true
    if (suppressMaskClickTimer !== undefined) clearTimeout(suppressMaskClickTimer)
    suppressMaskClickTimer = setTimeout(() => {
      suppressMaskClick = false
      suppressMaskClickTimer = undefined
    }, 0)
  }
  activePointerId = null
  dragging.value = false
  dragMoved = false
}

function onKeydown(event: KeyboardEvent) {
  if (!props.show || !props.options.keyboard || !modalFocus.isTopLayer.value) return

  let handled = true
  if (event.key === 'Escape') close()
  else if (event.key === 'ArrowLeft') previous()
  else if (event.key === 'ArrowRight') next()
  else if (event.key === 'ArrowUp' || event.key === '+' || event.key === '=') zoomIn()
  else if (event.key === 'ArrowDown' || event.key === '-') zoomOut()
  else if ((event.ctrlKey || event.metaKey) && event.key === '0') resetTransform()
  else handled = false

  if (handled) {
    event.preventDefault()
    event.stopPropagation()
  }
}

onMounted(async () => {
  document.addEventListener('keydown', onKeydown)
  await nextTick()
  scrollCurrentThumbnail(currentIndex.value, 'auto')
  safeAreaObserver = new ResizeObserver(updateSafeArea)
  const observedElements = [viewerRef.value, stageRef.value, footerRef.value]
  observedElements.forEach((element) => {
    if (element) safeAreaObserver?.observe(element)
  })
  updateSafeArea()
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  safeAreaObserver?.disconnect()
  if (suppressMaskClickTimer !== undefined) clearTimeout(suppressMaskClickTimer)
  modalLayer.inactive()
  if (props.show) document.body.style.overflow = originalBodyOverflow
})
</script>

<style lang="less">
.yiz-image-viewer {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--yiz-image-viewer-color, #fff);
  background: var(--yiz-image-viewer-bg, rgba(0, 0, 0, 0.78));
  outline: none;
  user-select: none;
}

.yiz-image-viewer-meta {
  display: flex;
  align-items: baseline;
  min-width: 0;
  gap: 12px;
}

.yiz-image-viewer-filename {
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yiz-image-viewer-counter {
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
}

.yiz-image-viewer-action,
.yiz-image-viewer-tool,
.yiz-image-viewer-ratio,
.yiz-image-viewer-nav {
  border: 0;
  color: inherit;
  background: rgba(0, 0, 0, 0.32);
  cursor: pointer;
  transition:
    color var(--yiz-motion-duration-fast) var(--yiz-motion-easing-standard),
    background var(--yiz-motion-duration-fast) var(--yiz-motion-easing-standard),
    opacity var(--yiz-motion-duration-fast) var(--yiz-motion-easing-standard);

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.18);
  }

  &:focus-visible {
    outline: 2px solid var(--yiz-color-primary);
    outline-offset: 2px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.38;
  }
}

.yiz-image-viewer-action,
.yiz-image-viewer-tool {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: var(--yiz-radius-default);
  text-decoration: none;
}

.yiz-image-viewer-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 3;
}

.yiz-image-viewer-stage {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.yiz-image-viewer-canvas {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: var(--yiz-image-viewer-safe-top, 16px) var(--yiz-image-viewer-safe-right, 16px)
    var(--yiz-image-viewer-safe-bottom, 16px) var(--yiz-image-viewer-safe-left, 16px);
  overflow: hidden;
  touch-action: none;
}

.yiz-image-viewer-canvas-movable .yiz-image-viewer-image {
  cursor: grab;
}

.yiz-image-viewer-canvas-dragging .yiz-image-viewer-image {
  cursor: grabbing;
  transition: none;
}

.yiz-image-viewer-image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  pointer-events: auto;
  transition:
    transform var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard),
    opacity var(--yiz-motion-duration-fast) var(--yiz-motion-easing-standard);
  will-change: transform;
  -webkit-user-drag: none;
}

.yiz-image-viewer-image-hidden {
  opacity: 0;
  pointer-events: none;
}

.yiz-image-viewer-status {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 13px;
  pointer-events: none;
}

.yiz-image-viewer-spinner {
  width: 28px;
  height: 28px;
  border: 2px solid rgba(255, 255, 255, 0.24);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: yiz-image-viewer-spin 0.8s linear infinite;
}

.yiz-image-viewer-nav {
  position: absolute;
  top: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 64px;
  padding: 0;
  border-radius: var(--yiz-radius-default);
  transform: translateY(-50%);
}

.yiz-image-viewer-nav-prev {
  left: 16px;
}

.yiz-image-viewer-nav-next {
  right: 16px;
}

.yiz-image-viewer-footer {
  position: absolute;
  right: 16px;
  bottom: 32px;
  left: 16px;
  z-index: 2;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 8px;
  pointer-events: none;
}

.yiz-image-viewer-footer-meta {
  max-width: calc(100% - 32px);
  padding: 5px 10px;
  border-radius: var(--yiz-radius-large);
  background: rgba(0, 0, 0, 0.42);
  box-shadow: var(--yiz-shadow-popup);
  backdrop-filter: blur(10px);
}

.yiz-image-viewer-footer-meta .yiz-image-viewer-filename {
  max-width: min(60vw, 480px);
}

.yiz-image-viewer-toolbar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  align-self: center;
  gap: 2px;
  min-height: 48px;
  margin: 0;
  padding: 6px 8px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--yiz-radius-large);
  background: rgba(0, 0, 0, 0.5);
  box-shadow: var(--yiz-shadow-popup);
  backdrop-filter: blur(10px);
  pointer-events: auto;
}

.yiz-image-viewer-navbar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  align-self: center;
  max-width: calc(100% - 32px);
  min-height: 60px;
  gap: 8px;
  margin: 0;
  padding: 6px 8px;
  overflow-x: auto;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--yiz-radius-large);
  background: rgba(0, 0, 0, 0.42);
  scrollbar-color: rgba(255, 255, 255, 0.32) transparent;
  scrollbar-width: thin;
  backdrop-filter: blur(10px);
  pointer-events: auto;
}

.yiz-image-viewer-thumbnail {
  position: relative;
  flex: 0 0 68px;
  width: 68px;
  height: 48px;
  padding: 2px;
  overflow: hidden;
  border: 2px solid transparent;
  border-radius: var(--yiz-radius-default);
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  opacity: 0.62;
  transition:
    border-color var(--yiz-motion-duration-fast) var(--yiz-motion-easing-standard),
    opacity var(--yiz-motion-duration-fast) var(--yiz-motion-easing-standard),
    transform var(--yiz-motion-duration-fast) var(--yiz-motion-easing-standard);

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid var(--yiz-color-primary);
    outline-offset: 2px;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 1px;
    object-fit: cover;
    pointer-events: none;
  }
}

.yiz-image-viewer-thumbnail-active {
  border-color: var(--yiz-color-primary);
  opacity: 1;
}

.yiz-image-viewer-ratio {
  min-width: 58px;
  height: 36px;
  padding: 0 8px;
  border-radius: var(--yiz-radius-default);
  font: inherit;
  font-size: 12px;
}

.yiz-image-viewer-toolbar-divider {
  width: 1px;
  height: 20px;
  margin: 0 5px;
  background: rgba(255, 255, 255, 0.18);
}

.yiz-image-viewer-fade-enter-active,
.yiz-image-viewer-fade-leave-active {
  transition: opacity var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
}

.yiz-image-viewer-fade-enter-from,
.yiz-image-viewer-fade-leave-to {
  opacity: 0;
}

@keyframes yiz-image-viewer-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .yiz-image-viewer-close {
    top: 8px;
    right: 8px;
  }

  .yiz-image-viewer-nav {
    width: 40px;
    height: 44px;
  }

  .yiz-image-viewer-nav-prev {
    left: 4px;
  }

  .yiz-image-viewer-nav-next {
    right: 4px;
  }

  .yiz-image-viewer-footer {
    right: 8px;
    bottom: 20px;
    left: 8px;
  }

  .yiz-image-viewer-toolbar {
    margin-bottom: 12px;
  }

  .yiz-image-viewer-navbar {
    min-height: 52px;
    gap: 6px;
    margin-top: 6px;
  }

  .yiz-image-viewer-thumbnail {
    flex-basis: 56px;
    width: 56px;
    height: 40px;
  }
}
</style>
