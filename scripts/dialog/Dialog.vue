<template>
  <Teleport to="body">
    <Transition name="yiz-dialog-mask-fade">
      <div v-if="visible && mask" class="yiz-dialog-mask" :style="{ zIndex: currentZIndex }" @click="onMaskClick" />
    </Transition>
    <Transition name="yiz-dialog-fade">
      <div v-if="visible" class="yiz-dialog-wrapper" :style="{ zIndex: currentZIndex + 1 }" @click.self="onWrapperClick">
        <div class="yiz-dialog" :style="{ width: props.width, ...dragStyle }">
          <div
            class="yiz-dialog-header"
            :class="{ 'yiz-dialog-header-draggable': drag }"
            @mousedown="onHeaderMouseDown"
          >
            <slot name="title">
              <span class="yiz-dialog-title">{{ title }}</span>
            </slot>
            <button v-if="closable" class="yiz-dialog-close" @click="close">
              <svg viewBox="0 0 16 16" width="16" height="16">
                <path
                  d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          <div class="yiz-dialog-body">
            <slot />
          </div>
          <div v-if="$slots.footer" class="yiz-dialog-footer">
            <slot name="footer" />
          </div>
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
    width?: string
    closable?: boolean
    mask?: boolean
    maskClosable?: boolean
    drag?: boolean
  }>(),
  {
    title: '',
    width: '420px',
    closable: true,
    mask: true,
    maskClosable: false,
    drag: false,
  }
)

defineSlots<{
  default?: any
  title?: any
  footer?: any
}>()

const emit = defineEmits(['close'])

const visible = defineModel<boolean>('modelValue', { default: false })

const dragPosition = ref({ x: 0, y: 0 })
const dragging = ref(false)
let dragStart = { x: 0, y: 0, posX: 0, posY: 0 }

watch(visible, (val) => {
  if (!val) {
    dragPosition.value = { x: 0, y: 0 }
  }
})

const dragStyle = computed(() => {
  if (dragPosition.value.x !== 0 || dragPosition.value.y !== 0) {
    return { transform: `translate(${dragPosition.value.x}px, ${dragPosition.value.y}px)` }
  }
  return {}
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

function onWrapperClick() {
  if (props.maskClosable) {
    close()
  }
}

// Escape key
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && visible.value) {
    close()
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => document.removeEventListener('keydown', onKeydown))

// header drag
function onHeaderMouseDown(e: MouseEvent) {
  if (!props.drag) return
  const target = e.target as HTMLElement
  if (target.closest('.yiz-dialog-close')) return
  e.preventDefault()
  dragging.value = true
  dragStart = {
    x: e.clientX,
    y: e.clientY,
    posX: dragPosition.value.x,
    posY: dragPosition.value.y,
  }
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
  document.body.style.userSelect = 'none'
}

function onDragMove(e: MouseEvent) {
  if (!dragging.value) return
  const dx = e.clientX - dragStart.x
  const dy = e.clientY - dragStart.y
  const el = document.querySelector('.yiz-dialog') as HTMLElement | null
  if (!el) return
  const dlgW = el.offsetWidth
  const dlgH = el.offsetHeight
  const vpW = window.innerWidth
  const vpH = window.innerHeight
  const maxX = Math.max(0, (vpW - dlgW) / 2)
  const maxY = Math.max(0, (vpH - dlgH) / 2)
  dragPosition.value = {
    x: Math.min(maxX, Math.max(-maxX, dragStart.posX + dx)),
    y: Math.min(maxY, Math.max(-maxY, dragStart.posY + dy)),
  }
}

function onDragEnd() {
  dragging.value = false
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  document.body.style.userSelect = ''
}

function clampPosition() {
  const el = document.querySelector('.yiz-dialog') as HTMLElement | null
  if (!el) return
  const dlgW = el.offsetWidth
  const dlgH = el.offsetHeight
  const vpW = window.innerWidth
  const vpH = window.innerHeight
  const maxX = Math.max(0, (vpW - dlgW) / 2)
  const maxY = Math.max(0, (vpH - dlgH) / 2)
  dragPosition.value = {
    x: Math.min(maxX, Math.max(-maxX, dragPosition.value.x)),
    y: Math.min(maxY, Math.max(-maxY, dragPosition.value.y)),
  }
}

function onViewportResize() {
  clampPosition()
}

onMounted(() => window.addEventListener('resize', onViewportResize))
onBeforeUnmount(() => window.removeEventListener('resize', onViewportResize))
</script>

<style lang="less">
.yiz-dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.45);
}

.yiz-dialog-wrapper {
  position: fixed;
  inset: 0;
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.yiz-dialog {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  pointer-events: auto;
}

.yiz-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  flex-shrink: 0;
}

.yiz-dialog-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.yiz-dialog-header-draggable {
  cursor: move;
  user-select: none;
}

.yiz-dialog-close {
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

.yiz-dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.yiz-dialog-footer {
  padding: 12px 24px;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
  flex-shrink: 0;
  text-align: right;
}

// mask fade
.yiz-dialog-mask-fade-enter-active,
.yiz-dialog-mask-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.yiz-dialog-mask-fade-enter-from,
.yiz-dialog-mask-fade-leave-to {
  opacity: 0;
}

// dialog fade + scale
.yiz-dialog-fade-enter-active,
.yiz-dialog-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.yiz-dialog-fade-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.yiz-dialog-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
