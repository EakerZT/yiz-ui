<template>
  <div v-if="visible" class="yiz-info" :class="vClass" role="alert">
    <span v-if="showIcon" class="yiz-info-icon">
      <slot name="icon">
        <Icon :size="hasDescription ? 24 : 20" :icon="infoIcon" />
      </slot>
    </span>

    <div class="yiz-info-body">
      <div v-if="hasMessage" class="yiz-info-message">
        <slot name="message">{{ message }}</slot>
      </div>
      <div v-if="hasDescription" class="yiz-info-description">
        <slot>{{ description }}</slot>
      </div>
    </div>

    <div v-if="$slots.action" class="yiz-info-action">
      <slot name="action" />
    </div>

    <button v-if="closable" class="yiz-info-close" type="button" :aria-label="t('common.close')" @click="close">
      <span v-if="closeText" class="yiz-info-close-text">{{ closeText }}</span>
      <Icon v-else size="16" :icon="Dismiss16Regular" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import { computed, ref, useSlots } from 'vue'
import {
  CheckmarkCircle20Regular,
  Dismiss16Regular,
  DismissCircle20Regular,
  Info20Regular,
  Warning20Regular,
} from '@vicons/fluent'
import { Icon } from '../icon'
import { useLocale } from '../locale'

const t = useLocale()

export type InfoType = 'info' | 'success' | 'warning' | 'error'

const props = withDefaults(
  defineProps<{
    message?: string
    description?: string
    type?: InfoType
    showIcon?: boolean
    closable?: boolean
    closeText?: string
    icon?: Component
  }>(),
  {
    message: '',
    description: '',
    type: 'info',
    showIcon: true,
    closable: false,
    closeText: '',
  },
)

defineSlots<{
  default?: any
  message?: any
  icon?: any
  action?: any
}>()

const emit = defineEmits<{
  close: [event: MouseEvent]
}>()

const slots = useSlots()
const visible = ref(true)

const iconMap: Record<InfoType, Component> = {
  info: Info20Regular,
  success: CheckmarkCircle20Regular,
  warning: Warning20Regular,
  error: DismissCircle20Regular,
}

const hasMessage = computed(() => props.message !== '' || !!slots.message)
const hasDescription = computed(() => props.description !== '' || !!slots.default)
const infoIcon = computed(() => props.icon ?? iconMap[props.type])

const vClass = computed(() => ({
  [`yiz-info-${props.type}`]: true,
  'yiz-info-with-description': hasDescription.value,
  'yiz-info-with-action': !!slots.action,
  'yiz-info-closable': props.closable,
}))

function close(event: MouseEvent) {
  visible.value = false
  emit('close', event)
}
</script>

<style lang="less">
.yiz-info {
  display: flex;
  align-items: flex-start;
  gap: var(--yiz-space-2);
  box-sizing: border-box;
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--yiz-info-border-color);
  border-radius: var(--yiz-radius-large);
  background: var(--yiz-info-bg);
  color: var(--yiz-color-text-primary);
  font-size: var(--yiz-font-size-default);
  line-height: 22px;
}

.yiz-info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--yiz-info-color);
  line-height: 1;
}

.yiz-info-body {
  flex: 1;
  min-width: 0;
}

.yiz-info-message {
  color: var(--yiz-color-text-primary);
  font-weight: var(--yiz-font-weight-medium);
}

.yiz-info-description {
  color: var(--yiz-color-text-secondary);
}

.yiz-info-message + .yiz-info-description {
  margin-top: 4px;
}

.yiz-info-action {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  margin-left: 8px;
}

.yiz-info-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 16px;
  height: 22px;
  margin: 0 0 0 8px;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--yiz-color-text-tertiary);
  font: inherit;
  line-height: 1;
  cursor: pointer;
  transition: color var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard);

  &:hover {
    color: var(--yiz-color-text-secondary);
  }
}

.yiz-info-close-text {
  color: var(--yiz-info-color);
  font-size: 14px;
  line-height: 22px;
}

.yiz-info-with-description {
  padding: var(--yiz-space-3) var(--yiz-space-4);

  .yiz-info-message {
    font-size: 16px;
    line-height: 24px;
  }
}

.yiz-info-info {
  --yiz-info-color: var(--yiz-color-primary);
  --yiz-info-bg: var(--yiz-color-primary-bg);
  --yiz-info-border-color: var(--yiz-color-primary-bg-hover);
}

.yiz-info-success {
  --yiz-info-color: var(--yiz-color-success);
  --yiz-info-bg: var(--yiz-color-success-bg);
  --yiz-info-border-color: var(--yiz-color-success-bg-hover);
}

.yiz-info-warning {
  --yiz-info-color: var(--yiz-color-warning-text);
  --yiz-info-bg: var(--yiz-color-warning-bg);
  --yiz-info-border-color: var(--yiz-color-warning-bg-hover);
}

.yiz-info-error {
  --yiz-info-color: var(--yiz-color-error);
  --yiz-info-bg: var(--yiz-color-error-bg);
  --yiz-info-border-color: var(--yiz-color-error-bg-hover);
}
</style>
