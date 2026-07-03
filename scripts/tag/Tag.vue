<template>
  <span class="yiz-tag" :class="vClass" :style="vStyle">
    <slot />
    <span v-if="closable" class="yiz-tag-close" @click.stop="onClose">
      <Icon size="16" :icon="Dismiss16Regular" />
    </span>
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { TinyColor } from '@ctrl/tinycolor'
import { Dismiss16Regular } from '@vicons/fluent'
import { Icon } from '../icon'

const props = withDefaults(
  defineProps<{
    color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | string
    closable?: boolean
    size?: 'default' | 'small' | 'large'
    bordered?: boolean
  }>(),
  {
    color: 'default',
    closable: false,
    size: 'default',
    bordered: true,
  }
)

const emit = defineEmits<{
  close: []
}>()

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (['default', 'primary', 'success', 'warning', 'error'].includes(props.color)) {
    c[`yiz-tag-color-${props.color}`] = true
  }
  if (props.closable) {
    c['yiz-tag-closable'] = true
  }
  if (props.size !== 'default') {
    c[`yiz-tag-size-${props.size}`] = true
  }
  if (props.bordered) {
    c['yiz-tag-bordered'] = true
  }
  return c
})

const vStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.color && props.color.match(/^#[\da-fA-F]{6}$/g)) {
    const color = new TinyColor(props.color)
    s['--yiz-tag-bg'] = color.setAlpha(0.1).toString()
    s['--yiz-tag-color'] = props.color
    s['--yiz-tag-border-color'] = color.setAlpha(0.3).toString()
    s['--yiz-tag-close-hover-bg'] = color.setAlpha(0.2).toString()
  }
  return s
})

function onClose() {
  emit('close')
}
</script>

<style lang="less">
.yiz-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
  line-height: 1;
  font-size: 12px;
  font-weight: 400;
  white-space: nowrap;
  border-radius: 4px;
  padding: 2px 8px;
  height: 22px;
  color: var(--yiz-tag-color, #333);
  background: var(--yiz-tag-bg, #f5f5f5);
  border: 1px solid var(--yiz-tag-border-color, transparent);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;

  &.yiz-tag-bordered {
    border-color: var(--yiz-tag-border-color, #d9d9d9);
  }

  &.yiz-tag-closable {
    padding-right: 4px;
  }
}

// size variants
.yiz-tag-size-small {
  height: 18px;
  padding: 0 6px;
  font-size: 10px;
  border-radius: 3px;

  &.yiz-tag-closable {
    padding-right: 2px;
  }
}

.yiz-tag-size-large {
  height: 28px;
  padding: 4px 12px;
  font-size: 14px;
  border-radius: 6px;

  &.yiz-tag-closable {
    padding-right: 8px;
  }
}

// close icon
.yiz-tag-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: pointer;
  color: var(--yiz-tag-color, #999);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;

  &:hover {
    background: var(--yiz-tag-close-hover-bg, rgba(0, 0, 0, 0.08));
    color: var(--yiz-tag-color, #333);
  }
}

// color variants
.yiz-tag-color-default {
  --yiz-tag-color: #333;
  --yiz-tag-bg: #f5f5f5;
  --yiz-tag-border-color: #d9d9d9;
  --yiz-tag-close-hover-bg: rgba(0, 0, 0, 0.08);
}

.yiz-tag-color-primary {
  --yiz-tag-color: var(--yiz-color-primary);
  --yiz-tag-bg: var(--yiz-color-primary-light9);
  --yiz-tag-border-color: var(--yiz-color-primary-light8);
  --yiz-tag-close-hover-bg: var(--yiz-color-primary-light8);
}

.yiz-tag-color-success {
  --yiz-tag-color: var(--yiz-color-success);
  --yiz-tag-bg: var(--yiz-color-success-light9);
  --yiz-tag-border-color: var(--yiz-color-success-light8);
  --yiz-tag-close-hover-bg: var(--yiz-color-success-light8);
}

.yiz-tag-color-warning {
  --yiz-tag-color: var(--yiz-color-warning-heary5);
  --yiz-tag-bg: var(--yiz-color-warning-light9);
  --yiz-tag-border-color: var(--yiz-color-warning-light8);
  --yiz-tag-close-hover-bg: var(--yiz-color-warning-light8);
}

.yiz-tag-color-error {
  --yiz-tag-color: var(--yiz-color-error);
  --yiz-tag-bg: var(--yiz-color-error-light9);
  --yiz-tag-border-color: var(--yiz-color-error-light8);
  --yiz-tag-close-hover-bg: var(--yiz-color-error-light8);
}
</style>
