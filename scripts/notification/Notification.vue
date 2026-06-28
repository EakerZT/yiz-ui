<template>
  <component :is="inline ? 'div' : Teleport" to="body">
    <Transition :name="transitionName" appear @after-leave="emit('destroy')">
      <div v-if="visible" class="yiz-notification" :class="notificationClass" :style="notificationStyle">
        <div v-if="showIcon" class="yiz-notification-icon">
          <Icon v-if="type === 'success'" size="24" :icon="CheckmarkCircle24Regular" />
          <Icon v-else-if="type === 'warning'" size="24" :icon="Warning24Regular" />
          <Icon v-else-if="type === 'error'" size="24" :icon="DismissCircle24Regular" />
          <Icon v-else size="24" :icon="Info24Regular" />
        </div>
        <div class="yiz-notification-content">
          <div v-if="title || $slots.title" class="yiz-notification-title">
            <slot name="title">{{ title }}</slot>
          </div>
          <div v-if="content || $slots.default" class="yiz-notification-message">
            <slot>{{ content }}</slot>
          </div>
        </div>
        <button v-if="closable" class="yiz-notification-close" type="button" @click="close">
          <Icon size="16" :icon="Dismiss16Regular" />
        </button>
        <div v-if="duration > 0" class="yiz-notification-progress">
          <span class="yiz-notification-progress-bar" :style="progressStyle" />
        </div>
      </div>
    </Transition>
  </component>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, Teleport, watch } from 'vue'
import {
  CheckmarkCircle24Regular,
  Dismiss16Regular,
  DismissCircle24Regular,
  Info24Regular,
  Warning24Regular
} from '@vicons/fluent'
import { Icon } from '../icon'
import { nextZIndex } from '../zIndex'

type NotificationType = 'info' | 'success' | 'warning' | 'error'
type NotificationPlacement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

const props = withDefaults(
  defineProps<{
    title?: string
    content?: string
    type?: NotificationType
    placement?: NotificationPlacement
    duration?: number
    closable?: boolean
    showIcon?: boolean
    offset?: number
    width?: number | string
    inline?: boolean
  }>(),
  {
    title: '',
    content: '',
    type: 'info',
    placement: 'top-right',
    duration: 4500,
    closable: true,
    showIcon: true,
    offset: 24,
    width: 360,
    inline: false
  }
)

defineSlots<{
  default?: any
  title?: any
}>()

const emit = defineEmits<{
  close: []
  destroy: []
}>()

const visible = defineModel<boolean>('modelValue', { default: false })
const currentZIndex = ref(0)
let timer: ReturnType<typeof setTimeout> | null = null

const type = computed(() => props.type)
const showIcon = computed(() => props.showIcon)
const duration = computed(() => props.duration)
const inline = computed(() => props.inline)

const notificationClass = computed(() => [
  `yiz-notification-${props.type}`,
  `yiz-notification-${props.placement}`,
  props.inline ? 'yiz-notification-inline' : ''
])

const transitionName = computed(() =>
  props.placement.endsWith('left') ? 'yiz-notification-slide-left' : 'yiz-notification-slide-right'
)

const notificationStyle = computed(() => {
  const style: Record<string, string | number> = {
    zIndex: currentZIndex.value,
    width: typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  if (props.inline) return style
  const [vertical, horizontal] = props.placement.split('-')
  style[vertical] = `${props.offset}px`
  style[horizontal] = `${props.offset}px`
  return style
})

const progressStyle = computed(() => ({
  animationDuration: `${props.duration}ms`
}))

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

function startTimer() {
  clearTimer()
  if (props.duration > 0) {
    timer = setTimeout(() => {
      close()
    }, props.duration)
  }
}

function close() {
  visible.value = false
  clearTimer()
  emit('close')
}

watch(
  visible,
  (val) => {
    if (val) {
      currentZIndex.value = nextZIndex()
      startTimer()
    } else {
      clearTimer()
    }
  },
  { immediate: true }
)

watch(() => props.duration, () => {
  if (visible.value) startTimer()
})

onBeforeUnmount(clearTimer)
</script>

<style lang="less">
.yiz-notification {
  position: fixed;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-height: 72px;
  padding: 16px 40px 16px 16px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-pane-border-radius);
  background: #fff;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  color: #333;
  box-sizing: border-box;
  pointer-events: auto;
  overflow: hidden;
}

.yiz-notification-inline {
  position: relative;
  inset: auto;
}

.yiz-notification-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.yiz-notification-info .yiz-notification-icon {
  color: var(--yiz-color-primary);
}

.yiz-notification-success .yiz-notification-icon {
  color: var(--yiz-color-success);
}

.yiz-notification-warning .yiz-notification-icon {
  color: var(--yiz-color-warning);
}

.yiz-notification-error .yiz-notification-icon {
  color: var(--yiz-color-error);
}

.yiz-notification-content {
  flex: 1;
  min-width: 0;
}

.yiz-notification-title {
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  color: #333;
}

.yiz-notification-message {
  margin-top: 4px;
  font-size: 13px;
  line-height: 20px;
  color: #666;
  word-break: break-word;
}

.yiz-notification-close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #999;
  cursor: pointer;
  transition:
    color 0.2s,
    background 0.2s;

  &:hover {
    color: #333;
    background: var(--yiz-color-hover-bg);
  }
}

.yiz-notification-progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.06);
}

.yiz-notification-progress-bar {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--yiz-color-primary);
  transform-origin: left center;
  animation-name: yiz-notification-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

.yiz-notification-success .yiz-notification-progress-bar {
  background: var(--yiz-color-success);
}

.yiz-notification-warning .yiz-notification-progress-bar {
  background: var(--yiz-color-warning);
}

.yiz-notification-error .yiz-notification-progress-bar {
  background: var(--yiz-color-error);
}

@keyframes yiz-notification-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

.yiz-notification-slide-right-enter-active,
.yiz-notification-slide-right-leave-active,
.yiz-notification-slide-left-enter-active,
.yiz-notification-slide-left-leave-active {
  transition:
    opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-notification-slide-right-enter-from,
.yiz-notification-slide-right-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.yiz-notification-slide-left-enter-from,
.yiz-notification-slide-left-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
</style>
