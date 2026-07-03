<template>
  <button class="yiz-link-button" :class="vClass" :style="vStyle" @click="onClick" :disabled="$props.disabled">
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { TinyColor } from '@ctrl/tinycolor'

const props = withDefaults(
  defineProps<{
    color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | string
    disabled?: boolean
    underline?: boolean
  }>(),
  {
    color: 'primary',
    disabled: false,
    underline: false,
  },
)

const emit = defineEmits(['click'])

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (['default', 'primary', 'success', 'warning', 'error'].includes(props.color)) {
    c[`yiz-link-button-color-${props.color}`] = true
  }
  if (props.disabled) {
    c['yiz-link-button-disabled'] = true
  }
  if (props.underline) {
    c['yiz-link-button-underline'] = true
  }
  return c
})

const vStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.color && props.color.match(/^#[\da-fA-F]{6}$/g)) {
    const color = new TinyColor(props.color)
    s['--yiz-link-button-color'] = props.color
    s['--yiz-link-button-color-hover'] = color.tint(30).toString()
    s['--yiz-link-button-color-active'] = color.mix('#000000', 20).toString()
  }
  return s
})

function onClick(e: MouseEvent) {
  if (props.disabled) return
  emit('click', e)
}
</script>

<style lang="less">
.yiz-link-button {
  margin: 0;
  padding: 0;
  font-weight: 400;
  line-height: 1;
  font-family: inherit;
  font-size: 14px;
  white-space: nowrap;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  background: none;
  color: var(--yiz-link-button-color, var(--yiz-color-primary));

  &:hover {
    color: var(--yiz-link-button-color-hover, var(--yiz-color-primary-light2));
  }

  &:active {
    color: var(--yiz-link-button-color-active, var(--yiz-color-primary-heary));
  }

  &.yiz-link-button-disabled {
    cursor: not-allowed;
    color: var(--yiz-link-button-color-disabled, #c0c4cc);
  }
}

// underline
.yiz-link-button-underline {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &.yiz-link-button-disabled:hover {
    text-decoration: none;
  }
}

// color variants
.yiz-link-button-color-primary {
  --yiz-link-button-color: var(--yiz-color-primary);
  --yiz-link-button-color-hover: var(--yiz-color-primary-light2);
  --yiz-link-button-color-active: var(--yiz-color-primary-heary);
  --yiz-link-button-color-disabled: var(--yiz-color-primary-light5);
}

.yiz-link-button-color-default {
  --yiz-link-button-color: #333;
  --yiz-link-button-color-hover: var(--yiz-color-primary);
  --yiz-link-button-color-active: var(--yiz-color-primary-heary);
  --yiz-link-button-color-disabled: #c0c4cc;
}

.yiz-link-button-color-success {
  --yiz-link-button-color: var(--yiz-color-success);
  --yiz-link-button-color-hover: var(--yiz-color-success-light2);
  --yiz-link-button-color-active: var(--yiz-color-success-heary);
  --yiz-link-button-color-disabled: var(--yiz-color-success-light5);
}

.yiz-link-button-color-warning {
  --yiz-link-button-color: var(--yiz-color-warning);
  --yiz-link-button-color-hover: var(--yiz-color-warning-light2);
  --yiz-link-button-color-active: var(--yiz-color-warning-heary);
  --yiz-link-button-color-disabled: var(--yiz-color-warning-light5);
}

.yiz-link-button-color-error {
  --yiz-link-button-color: var(--yiz-color-error);
  --yiz-link-button-color-hover: var(--yiz-color-error-light2);
  --yiz-link-button-color-active: var(--yiz-color-error-heary);
  --yiz-link-button-color-disabled: var(--yiz-color-error-light5);
}
</style>
