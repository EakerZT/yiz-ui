<template>
  <Teleport to="body">
    <Transition name="yiz-dialog-mask-fade" appear>
      <div v-if="visible && mask" class="yiz-dialog-mask" :style="{ zIndex: currentZIndex }" @click="onMaskClick" />
    </Transition>
    <Transition name="yiz-dialog-fade" appear @after-leave="onAfterLeave">
      <div
        v-if="visible"
        class="yiz-dialog-wrapper"
        :style="{ zIndex: currentZIndex + 1 }"
        @click.self="onWrapperClick"
      >
        <div
          ref="dialogRef"
          class="yiz-dialog"
          :class="{ 'yiz-dialog-standalone-close': disabledHeader && closable }"
          :style="{ width: props.width, height: props.height, ...dragStyle }"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="!disabledHeader && (title || $slots.title) ? titleId : undefined"
          :aria-label="disabledHeader || (!title && !$slots.title) ? title || $t('dialog.ariaLabel') : undefined"
          tabindex="-1"
        >
          <button
            v-if="disabledHeader && closable"
            class="yiz-dialog-close yiz-dialog-close-standalone"
            type="button"
            :aria-label="$t('common.close')"
            @click="close"
          >
            <Icon size="16" :icon="Dismiss16Regular" />
          </button>
          <div
            v-if="!disabledHeader"
            class="yiz-dialog-header"
            :class="{ 'yiz-dialog-header-draggable': drag }"
            @mousedown="onHeaderMouseDown"
          >
            <div :id="titleId" class="yiz-dialog-title-wrap">
              <slot name="title">
                <span class="yiz-dialog-title">{{ title }}</span>
              </slot>
            </div>
            <button
              v-if="closable"
              class="yiz-dialog-close"
              type="button"
              :aria-label="$t('common.close')"
              @click="close"
            >
              <Icon size="16" :icon="Dismiss16Regular" />
            </button>
          </div>
          <div class="yiz-dialog-body">
            <slot />
          </div>
          <div v-if="!disabledFooter" class="yiz-dialog-footer">
            <slot name="footer">
              <div class="yiz-dialog-footer-actions">
                <Button @click="close">{{ $t('common.close') }}</Button>
                <Button type="primary" @click="ok">{{ $t('common.confirm') }}</Button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { Dismiss16Regular } from '@vicons/fluent'
import { Button } from '../button'
import { Icon } from '../icon'
import { $t } from '../locale'
import { useOptionalModalLayer, type ModalLayerContext } from '../overlay/modalLayer'
import { useModalFocus } from '../overlay/useModalFocus'
import { nextZIndex } from '../zIndex'

const currentZIndex = ref(0)

const props = withDefaults(
  defineProps<{
    /**
     * 对话框标题。
     * @en Dialog title.
     */
    title?: string
    /**
     * 对话框宽度。
     * @en Width of the dialog.
     */
    width?: string
    /**
     * 对话框高度，支持任意合法的 CSS 高度值。
     * @en Dialog height. Any valid CSS height value is supported.
     */
    height?: string
    /**
     * 是否显示关闭按钮。
     * @en Whether to show the close button.
     */
    closable?: boolean
    /**
     * 是否显示遮罩层。
     * @en Whether to show the mask.
     */
    mask?: boolean
    /**
     * 点击遮罩时是否关闭。
     * @en Whether clicking the mask closes the dialog.
     */
    maskClosable?: boolean
    /**
     * 是否允许拖动标题栏移动对话框。
     * @en Whether the dialog can be moved by dragging its header.
     */
    drag?: boolean
    /**
     * 是否隐藏头部区域。
     * @en Whether to hide the header.
     */
    disabledHeader?: boolean
    /**
     * 是否隐藏默认页脚。
     * @en Whether to hide the default footer.
     */
    disabledFooter?: boolean
    /**
     * 指定父级模态层上下文，用于嵌套弹层。
     * @en Parent modal layer context for nested overlays.
     */
    modalLayerParent?: ModalLayerContext | null
  }>(),
  {
    title: '',
    width: '420px',
    closable: true,
    mask: true,
    maskClosable: false,
    drag: false,
    disabledHeader: false,
    disabledFooter: false,
    modalLayerParent: null,
  },
)

defineSlots<{
  /**
   * 对话框主体内容。
   * @en Dialog body content.
   */
  default?: any
  /**
   * 自定义标题内容。
   * @en Custom title content.
   */
  title?: any
  /**
   * 自定义页脚内容。
   * @en Custom footer content.
   */
  footer?: any
}>()

const emit = defineEmits<{
  /**
   * 对话框请求关闭时触发。
   * @en Emitted when the dialog requests to close.
   */
  close: []
  /**
   * 点击默认确定按钮时触发。
   * @en Emitted when the default confirm button is clicked.
   */
  ok: []
  /**
   * 关闭过渡结束后触发。
   * @en Emitted after the leave transition finishes.
   */
  afterLeave: []
}>()

/**
 * 对话框是否显示。
 * @en Whether the dialog is visible.
 */
const visible = defineModel<boolean>('show', { default: false })
const modalLayer = useOptionalModalLayer(props.modalLayerParent)
const dialogRef = ref<HTMLElement>()
const titleId = `yiz-dialog-title-${useId()}`
const modalFocus = useModalFocus(visible, dialogRef)

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
function handleVisibleChange(val: boolean) {
  if (val) {
    currentZIndex.value = nextZIndex()
    originalOverflow.value = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    modalLayer.active()
  } else {
    document.body.style.overflow = originalOverflow.value
    modalLayer.inactive()
  }
}

watch(visible, handleVisibleChange)

if (visible.value) {
  handleVisibleChange(true)
}

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

function onAfterLeave() {
  emit('afterLeave')
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
  if (e.key === 'Escape' && visible.value && modalFocus.isTopLayer.value) {
    e.stopPropagation()
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
  const el = dialogRef.value
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
  const el = dialogRef.value
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
  background: var(--yiz-color-mask);
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
  position: relative;
  background: var(--yiz-color-bg-elevated);
  border-radius: var(--yiz-pane-border-radius);
  box-shadow: var(--yiz-shadow-modal);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  pointer-events: auto;
}

.yiz-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--yiz-space-4) var(--yiz-space-6);
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  flex-shrink: 0;
}

.yiz-dialog-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--yiz-color-text-primary);
}

.yiz-dialog-title-wrap {
  min-width: 0;
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
  color: var(--yiz-color-text-tertiary);
  font-size: 18px;
  transition: color 0.2s;

  &:hover {
    color: var(--yiz-color-text-primary);
    background: var(--yiz-color-bg-muted);
  }
}

.yiz-dialog-close-standalone {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
}

.yiz-dialog-standalone-close .yiz-dialog-body {
  padding-right: 56px;
}

.yiz-dialog-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--yiz-space-6);
}

.yiz-dialog-footer {
  padding: var(--yiz-space-3) var(--yiz-space-6);
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
  flex-shrink: 0;
  text-align: right;
}

.yiz-dialog-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--yiz-space-3);
}

// mask fade
.yiz-dialog-mask-fade-enter-active,
.yiz-dialog-mask-fade-leave-active {
  transition: opacity var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
}
.yiz-dialog-mask-fade-enter-from,
.yiz-dialog-mask-fade-leave-to {
  opacity: 0;
}

// dialog fade + scale
.yiz-dialog-fade-enter-active,
.yiz-dialog-fade-leave-active {
  transition:
    opacity var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard),
    transform var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
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
