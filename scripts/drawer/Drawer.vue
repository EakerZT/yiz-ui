<template>
  <Teleport to="body">
    <Transition name="yiz-drawer-mask-fade">
      <div v-if="visible && mask" class="yiz-drawer-mask" :style="{ zIndex: currentZIndex }" @click="onMaskClick" />
    </Transition>
    <Transition :name="transitionName">
      <div v-if="visible" class="yiz-drawer" :class="`yiz-drawer-${placement}`" :style="panelStyle">
        <div class="yiz-drawer-header">
          <slot name="title">
            <span class="yiz-drawer-title">{{ title }}</span>
          </slot>
          <button v-if="closable" class="yiz-drawer-close" @click="close">
            <svg viewBox="0 0 16 16" width="16" height="16">
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div class="yiz-drawer-body">
          <slot />
        </div>
        <div v-if="resize" class="yiz-drawer-resize" :class="{ 'yiz-drawer-resize-active': resizing }" @mousedown="onResizeStart" />
        <div v-if="$slots.footer" class="yiz-drawer-footer">
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { nextZIndex } from '../zIndex'

const currentZIndex = ref(0)

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
  }
)

defineSlots<{
  default?: any
  title?: any
  footer?: any
}>()

const emit = defineEmits(['close'])

const visible = defineModel<boolean>('modelValue', { default: false })

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
    currentZIndex.value = nextZIndex()
    originalOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = originalOverflow.value
  }
})

onBeforeUnmount(() => {
  if (visible.value) {
    document.body.style.overflow = originalOverflow.value
  }
})

function close() {
  visible.value = false
  emit('close')
}

function onMaskClick() {
  if (props.maskClosable) {
    close()
  }
}

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
  const el = document.querySelector('.yiz-drawer') as HTMLElement | null
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
  background: rgba(0, 0, 0, 0.45);
}

.yiz-drawer {
  position: fixed;
  z-index: 1001;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
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
  padding: 16px 24px;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  flex-shrink: 0;
}

.yiz-drawer-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
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
  color: #999;
  font-size: 18px;
  transition: color 0.2s;

  &:hover {
    color: #333;
    background: #f5f5f5;
  }
}

.yiz-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
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
  padding: 12px 24px;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
  flex-shrink: 0;
  text-align: right;
}

// mask fade transition
.yiz-drawer-mask-fade-enter-active,
.yiz-drawer-mask-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.yiz-drawer-mask-fade-enter-from,
.yiz-drawer-mask-fade-leave-to {
  opacity: 0;
}

// slide transitions per direction
.yiz-drawer-slide-right-enter-active,
.yiz-drawer-slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.yiz-drawer-slide-right-enter-from,
.yiz-drawer-slide-right-leave-to {
  transform: translateX(100%);
}

.yiz-drawer-slide-left-enter-active,
.yiz-drawer-slide-left-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.yiz-drawer-slide-left-enter-from,
.yiz-drawer-slide-left-leave-to {
  transform: translateX(-100%);
}

.yiz-drawer-slide-top-enter-active,
.yiz-drawer-slide-top-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.yiz-drawer-slide-top-enter-from,
.yiz-drawer-slide-top-leave-to {
  transform: translateY(-100%);
}

.yiz-drawer-slide-bottom-enter-active,
.yiz-drawer-slide-bottom-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.yiz-drawer-slide-bottom-enter-from,
.yiz-drawer-slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
