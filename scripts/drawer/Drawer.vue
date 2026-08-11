<template>
  <AppTeleport>
    <Transition name="yiz-drawer-mask-fade">
      <div v-if="visible && mask" class="yiz-drawer-mask" :style="{ zIndex: currentZIndex }" @click="onMaskClick" />
    </Transition>
    <Transition :name="transitionName">
      <div
        v-if="visible"
        ref="drawerRef"
        class="yiz-drawer"
        :class="`yiz-drawer-${placement}`"
        :style="panelStyle"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
      >
        <div class="yiz-drawer-header">
          <div :id="titleId" class="yiz-drawer-title-wrap">
            <slot name="title">
              <span class="yiz-drawer-title">{{ title || t('drawer.ariaLabel') }}</span>
            </slot>
          </div>
          <button v-if="closable" class="yiz-drawer-close" type="button" :aria-label="t('common.close')" @click="close">
            <Icon size="16" :icon="Dismiss16Regular" />
          </button>
        </div>
        <div class="yiz-drawer-body">
          <slot />
        </div>
        <div
          v-if="resize"
          class="yiz-drawer-resize"
          :class="{ 'yiz-drawer-resize-active': resizing }"
          @mousedown="onResizeStart"
        />
        <div v-if="!disabledFooter" class="yiz-drawer-footer">
          <slot name="footer">
            <div class="yiz-drawer-footer-actions">
              <Button @click="close">{{ t('common.close') }}</Button>
              <Button type="primary" @click="ok">{{ t('common.confirm') }}</Button>
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </AppTeleport>
</template>

<script lang="ts" setup>
import AppTeleport from '../app/AppTeleport.vue'
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { Dismiss16Regular } from '@vicons/fluent'
import { Button } from '../button'
import { Icon } from '../icon'
import { useLocale } from '../locale'
import { useOptionalModalLayer } from '../overlay/modalLayer'
import { useModalFocus } from '../overlay/useModalFocus'
import { useZIndexManager } from '../zIndex'

const t = useLocale()

const currentZIndex = ref(0)
const zIndexManager = useZIndexManager()

const props = withDefaults(
  defineProps<{
    title?: string
    placement?: 'left' | 'right' | 'top' | 'bottom'
    width?: string
    height?: string
    closable?: boolean
    mask?: boolean
    maskClosable?: boolean
    resize?: boolean
    resizeMin?: string
    resizeMax?: string
    disabledFooter?: boolean
  }>(),
  {
    title: '',
    placement: 'right',
    width: '30%',
    height: '30%',
    closable: true,
    mask: true,
    maskClosable: false,
    resize: false,
    resizeMin: '200px',
    resizeMax: '',
    disabledFooter: false,
  },
)

defineSlots<{
  default?: any
  title?: any
  footer?: any
}>()

const emit = defineEmits<{
  close: []
  ok: []
}>()

const visible = defineModel<boolean>('show', { default: false })
const modalLayer = useOptionalModalLayer()
const drawerRef = ref<HTMLElement>()
const titleId = `yiz-drawer-title-${useId()}`
const modalFocus = useModalFocus(visible, drawerRef)

const transitionName = computed(() => `yiz-drawer-slide-${props.placement}`)

const currentResizeSize = ref('')

watch(visible, (val) => {
  if (!val) {
    currentResizeSize.value = ''
  }
})

const panelStyle = computed(() => {
  const style: Record<string, string | number> = {
    zIndex: currentZIndex.value + 1,
  }
  if (props.placement === 'left' || props.placement === 'right') {
    style.width = currentResizeSize.value || props.width
  } else {
    style.height = currentResizeSize.value || props.height
  }
  return style
})

// body scroll lock
const originalOverflow = ref('')
watch(visible, (val) => {
  if (val) {
    currentZIndex.value = zIndexManager.next()
    originalOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    modalLayer.active()
  } else {
    document.body.style.overflow = originalOverflow.value
    modalLayer.inactive()
  }
})

onBeforeUnmount(() => {
  modalLayer.inactive()
  if (visible.value) {
    document.body.style.overflow = originalOverflow.value
  }
})

function close() {
  visible.value = false
  emit('close')
}

function ok() {
  emit('ok')
}

function onMaskClick() {
  if (props.maskClosable) {
    close()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || !visible.value || !modalFocus.isTopLayer.value) return
  e.stopPropagation()
  close()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

// resize
const resizing = ref(false)
let resizeStart = { x: 0, y: 0, size: 0 }

function onResizeStart(e: MouseEvent) {
  e.preventDefault()
  resizing.value = true
  resizeStart = {
    x: e.clientX,
    y: e.clientY,
    size: getCurrentSize(),
  }
  document.addEventListener('mousemove', onResizeMove)
  document.addEventListener('mouseup', onResizeEnd)
  document.body.style.userSelect = 'none'
}

function onResizeMove(e: MouseEvent) {
  if (!resizing.value) return
  const isHorizontal = props.placement === 'left' || props.placement === 'right'
  const refSize = isHorizontal ? window.innerWidth : window.innerHeight
  let newSize: number
  if (isHorizontal) {
    const dx = e.clientX - resizeStart.x
    const sign = props.placement === 'right' ? -1 : 1
    newSize = resizeStart.size + dx * sign
  } else {
    const dy = e.clientY - resizeStart.y
    const sign = props.placement === 'bottom' ? -1 : 1
    newSize = resizeStart.size + dy * sign
  }
  const minSize = parseSize(props.resizeMin, refSize)
  const maxSize = parseSize(props.resizeMax, refSize) || refSize
  newSize = Math.min(Math.max(newSize, minSize), maxSize)
  currentResizeSize.value = `${newSize}px`
}

function onResizeEnd() {
  resizing.value = false
  document.removeEventListener('mousemove', onResizeMove)
  document.removeEventListener('mouseup', onResizeEnd)
  document.body.style.userSelect = ''
}

function onViewportResize() {
  if (!currentResizeSize.value) return
  const isHorizontal = props.placement === 'left' || props.placement === 'right'
  const refSize = isHorizontal ? window.innerWidth : window.innerHeight
  const curSize = parseFloat(currentResizeSize.value)
  if (isNaN(curSize)) return
  const maxSize = parseSize(props.resizeMax, refSize) || refSize
  if (curSize > maxSize) {
    currentResizeSize.value = `${maxSize}px`
  }
}

onMounted(() => window.addEventListener('resize', onViewportResize))
onBeforeUnmount(() => window.removeEventListener('resize', onViewportResize))

function getCurrentSize(): number {
  const el = drawerRef.value
  if (!el) return 0
  const isHorizontal = props.placement === 'left' || props.placement === 'right'
  return isHorizontal ? el.offsetWidth : el.offsetHeight
}

function parseSize(val: string, refSize: number): number {
  if (!val) return 0
  if (val.endsWith('%')) {
    const pct = parseFloat(val) / 100
    return isNaN(pct) ? 0 : refSize * pct
  }
  const n = parseFloat(val)
  return isNaN(n) ? 0 : n
}
</script>

<style lang="less">
.yiz-drawer-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: var(--yiz-color-mask);
}

.yiz-drawer {
  position: fixed;
  z-index: 1001;
  background: var(--yiz-color-bg-elevated);
  display: flex;
  flex-direction: column;
  box-shadow: var(--yiz-shadow-drawer);
}

.yiz-drawer-right {
  top: 0;
  right: 0;
  bottom: 0;
}

.yiz-drawer-left {
  top: 0;
  left: 0;
  bottom: 0;
}

.yiz-drawer-top {
  top: 0;
  left: 0;
  right: 0;
}

.yiz-drawer-bottom {
  bottom: 0;
  left: 0;
  right: 0;
}

.yiz-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--yiz-space-4) var(--yiz-space-6);
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  flex-shrink: 0;
}

.yiz-drawer-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--yiz-color-text-primary);
}

.yiz-drawer-title-wrap {
  min-width: 0;
}

.yiz-drawer-close {
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  color: var(--yiz-color-text-tertiary);
  font-size: 18px;
  transition: color 0.2s;

  &:hover {
    color: var(--yiz-color-text-primary);
    background: var(--yiz-color-bg-muted);
  }
}

.yiz-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--yiz-space-6);
}

.yiz-drawer-resize {
  position: absolute;
  z-index: 10;

  &::after {
    content: '';
    position: absolute;
    background: transparent;
    transition: background 0.2s;
  }
}

.yiz-drawer-right .yiz-drawer-resize::after,
.yiz-drawer-left .yiz-drawer-resize::after {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  transform: translateX(-50%);
}

.yiz-drawer-top .yiz-drawer-resize::after,
.yiz-drawer-bottom .yiz-drawer-resize::after {
  left: 0;
  right: 0;
  top: 50%;
  height: 2px;
  transform: translateY(-50%);
}

.yiz-drawer-resize-active::after {
  background: var(--yiz-color-primary);
}

.yiz-drawer-right .yiz-drawer-resize-active::after,
.yiz-drawer-left .yiz-drawer-resize-active::after {
  width: 3px;
}

.yiz-drawer-top .yiz-drawer-resize-active::after,
.yiz-drawer-bottom .yiz-drawer-resize-active::after {
  height: 3px;
}

.yiz-drawer-right .yiz-drawer-resize,
.yiz-drawer-left .yiz-drawer-resize {
  top: 0;
  bottom: 0;
  width: 4px;
  cursor: col-resize;
}

.yiz-drawer-right .yiz-drawer-resize {
  left: 0;
}

.yiz-drawer-left .yiz-drawer-resize {
  right: 0;
}

.yiz-drawer-top .yiz-drawer-resize,
.yiz-drawer-bottom .yiz-drawer-resize {
  left: 0;
  right: 0;
  height: 4px;
  cursor: row-resize;
}

.yiz-drawer-top .yiz-drawer-resize {
  bottom: 0;
}

.yiz-drawer-bottom .yiz-drawer-resize {
  top: 0;
}

.yiz-drawer-footer {
  padding: var(--yiz-space-3) var(--yiz-space-6);
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
  flex-shrink: 0;
  text-align: right;
}

.yiz-drawer-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--yiz-space-3);
}

// mask fade transition
.yiz-drawer-mask-fade-enter-active,
.yiz-drawer-mask-fade-leave-active {
  transition: opacity var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
}
.yiz-drawer-mask-fade-enter-from,
.yiz-drawer-mask-fade-leave-to {
  opacity: 0;
}

// slide transitions per direction
.yiz-drawer-slide-right-enter-active,
.yiz-drawer-slide-right-leave-active {
  transition: transform var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
}
.yiz-drawer-slide-right-enter-from,
.yiz-drawer-slide-right-leave-to {
  transform: translateX(100%);
}

.yiz-drawer-slide-left-enter-active,
.yiz-drawer-slide-left-leave-active {
  transition: transform var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
}
.yiz-drawer-slide-left-enter-from,
.yiz-drawer-slide-left-leave-to {
  transform: translateX(-100%);
}

.yiz-drawer-slide-top-enter-active,
.yiz-drawer-slide-top-leave-active {
  transition: transform var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
}
.yiz-drawer-slide-top-enter-from,
.yiz-drawer-slide-top-leave-to {
  transform: translateY(-100%);
}

.yiz-drawer-slide-bottom-enter-active,
.yiz-drawer-slide-bottom-leave-active {
  transition: transform var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
}
.yiz-drawer-slide-bottom-enter-from,
.yiz-drawer-slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
