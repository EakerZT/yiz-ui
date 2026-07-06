<template>
  <Transition name="yiz-message-move-up" appear @after-leave="emit('destroy')">
    <div v-if="visible" class="yiz-message" :class="messageClass" :style="messageStyle">
      <span v-if="showIcon && messageIcon" class="yiz-message-icon">
        <Icon size="20" :icon="messageIcon" />
      </span>
      <span v-if="hasContent" class="yiz-message-content">
        <slot>{{ content }}</slot>
      </span>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import { computed, onBeforeUnmount, ref, useSlots, watch } from 'vue'
import {
  CheckmarkCircle20Regular,
  DismissCircle20Regular,
  Info20Regular,
  SpinnerIos20Regular,
  Warning20Regular,
} from '@vicons/fluent'
import { Icon } from '../icon'
import { nextZIndex } from '../zIndex'

type MessageType = 'info' | 'success' | 'warning' | 'error' | 'loading'

const props = withDefaults(
  defineProps<{
    content?: string
    type?: MessageType
    duration?: number
    showIcon?: boolean
    icon?: Component
  }>(),
  {
    content: '',
    type: 'info',
    duration: 3000,
    showIcon: true,
  },
)

defineSlots<{
  default?: any
}>()

const emit = defineEmits<{
  close: []
  destroy: []
}>()

const visible = defineModel<boolean>('modelValue', { default: false })
const currentZIndex = ref(0)
const slots = useSlots()
let timer: ReturnType<typeof setTimeout> | null = null

const iconMap: Record<MessageType, Component> = {
  info: Info20Regular,
  success: CheckmarkCircle20Regular,
  warning: Warning20Regular,
  error: DismissCircle20Regular,
  loading: SpinnerIos20Regular,
}

const messageClass = computed(() => [`yiz-message-${props.type}`])

const messageStyle = computed(() => ({
  zIndex: currentZIndex.value,
}))

const messageIcon = computed(() => props.icon ?? iconMap[props.type])
const showIcon = computed(() => props.showIcon)
const hasContent = computed(() => props.content !== '' || !!slots.default)

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
  { immediate: true },
)

watch(
  () => props.duration,
  () => {
    if (visible.value) startTimer()
  },
)

onBeforeUnmount(clearTimer)
</script>

<style lang="less">
.yiz-message {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: min(560px, calc(100vw - 32px));
  min-height: 40px;
  padding: 9px 16px;
  border-radius: var(--yiz-pane-border-radius);
  background: #fff;
  box-shadow:
    0 6px 18px rgba(0, 0, 0, 0.14),
    0 0 0 1px rgba(0, 0, 0, 0.04);
  color: #333;
  font-size: 14px;
  line-height: 22px;
  box-sizing: border-box;
  pointer-events: auto;
}

.yiz-message-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.yiz-message-info .yiz-message-icon {
  color: var(--yiz-color-primary);
}

.yiz-message-success .yiz-message-icon {
  color: var(--yiz-color-success);
}

.yiz-message-warning .yiz-message-icon {
  color: var(--yiz-color-warning);
}

.yiz-message-error .yiz-message-icon {
  color: var(--yiz-color-error);
}

.yiz-message-loading .yiz-message-icon {
  color: var(--yiz-color-primary);
  animation: yiz-message-spin 1s linear infinite;
}

.yiz-message-content {
  min-width: 0;
  word-break: break-word;
}

.yiz-message-move-up-enter-active,
.yiz-message-move-up-leave-active {
  transition:
    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-message-move-up-enter-from,
.yiz-message-move-up-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@keyframes yiz-message-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
