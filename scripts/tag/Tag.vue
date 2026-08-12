<template>
  <span
    class="yiz-tag"
    :class="vClass"
    :style="vStyle"
    :role="checkable ? 'checkbox' : undefined"
    :aria-checked="checkable ? checked : undefined"
    :aria-disabled="checkable ? disabled : undefined"
    :tabindex="checkable ? (disabled ? -1 : 0) : undefined"
    @click="onClick"
    @keydown="onKeydown"
  >
    <slot />
    <span v-if="closable && !checkable" class="yiz-tag-close" @click.stop="onClose">
      <Icon size="16" :icon="Dismiss16Regular" />
    </span>
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Dismiss16Regular } from '@vicons/fluent'
import { Icon } from '../icon'
import { deriveColorRoles, useTheme, useThemeSize } from '../theme'

export type TagMode = 'filled' | 'solid' | 'outlined'

const props = withDefaults(
  defineProps<{
    color?: 'default' | 'primary' | 'success' | 'warning' | 'error' | string
    /**
     * 自定义标签文字颜色，优先于自动计算的文字颜色。
     * @en Custom tag text color. Takes precedence over the automatically calculated text color.
     */
    textColor?: string
    mode?: TagMode
    closable?: boolean
    size?: 'default' | 'small' | 'large'
    checkable?: boolean
    disabled?: boolean
  }>(),
  {
    color: 'default',
    mode: 'outlined',
    closable: false,
    checkable: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  close: []
  change: [checked: boolean]
}>()

const checked = defineModel<boolean>('checked', { default: false })
const { theme } = useTheme()
const mergedSize = useThemeSize(() => props.size)

const checkableColorMap: Record<string, string> = {
  default: 'var(--yiz-color-primary)',
  primary: 'var(--yiz-color-primary)',
  success: 'var(--yiz-color-success)',
  warning: 'var(--yiz-color-warning)',
  error: 'var(--yiz-color-error)',
}

const vClass = computed(() => {
  const c: Record<string, boolean> = {
    [`yiz-tag-mode-${props.mode}`]: true,
  }
  if (['default', 'primary', 'success', 'warning', 'error'].includes(props.color)) {
    c[`yiz-tag-color-${props.color}`] = true
  }
  if (props.closable && !props.checkable) {
    c['yiz-tag-closable'] = true
  }
  if (props.checkable) {
    c['yiz-tag-checkable'] = true
    c['yiz-tag-checkable-checked'] = checked.value
    c['yiz-tag-checkable-disabled'] = props.disabled
  }
  if (mergedSize.value !== 'default') {
    c[`yiz-tag-size-${mergedSize.value}`] = true
  }
  return c
})

const vStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.color && props.color.match(/^#(?:[\da-fA-F]{3}|[\da-fA-F]{6})$/)) {
    const color = deriveColorRoles(props.color, theme.value)
    s['--yiz-tag-base-color'] = props.color
    s['--yiz-tag-filled-bg'] = color.bg
    s['--yiz-tag-solid-bg'] = props.color
    s['--yiz-tag-outlined-border'] = color.border
    s['--yiz-tag-close-hover-bg'] = color.bgHover
    s['--yiz-tag-solid-on-color'] = color.onColor
    s['--yiz-tag-checkable-on-color'] = color.onColor
    s['--yiz-tag-solid-close-hover-bg'] =
      color.onColor === '#ffffff' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.12)'
  }
  s['--yiz-tag-checkable-color'] = checkableColorMap[props.color] ?? props.color
  if (props.textColor) {
    s.color = props.textColor
  }
  return s
})

function onClose() {
  emit('close')
}

function toggleChecked() {
  const nextChecked = !checked.value
  checked.value = nextChecked
  emit('change', nextChecked)
}

function onClick() {
  if (!props.checkable || props.disabled) return
  toggleChecked()
}

function onKeydown(e: KeyboardEvent) {
  if (!props.checkable || props.disabled || (e.key !== 'Enter' && e.key !== ' ')) return
  e.preventDefault()
  toggleChecked()
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
  color: var(--yiz-tag-color, var(--yiz-tag-base-color, var(--yiz-color-text-primary)));
  background: var(--yiz-tag-bg, var(--yiz-color-bg-container));
  border: 1px solid var(--yiz-tag-border-color, transparent);
  transition: all var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard);
  cursor: default;

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
  color: currentColor;
  transition: all var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard);
  flex-shrink: 0;

  &:hover {
    background: var(--yiz-tag-close-hover-bg, rgba(0, 0, 0, 0.08));
    color: currentColor;
  }
}

// color variants
.yiz-tag-color-default {
  --yiz-tag-base-color: var(--yiz-color-text-primary);
  --yiz-tag-filled-bg: var(--yiz-color-bg-muted);
  --yiz-tag-solid-bg: #595959;
  --yiz-tag-outlined-border: #d9d9d9;
  --yiz-tag-close-hover-bg: rgba(0, 0, 0, 0.08);
  --yiz-tag-solid-on-color: #ffffff;
  --yiz-tag-checkable-on-color: var(--yiz-color-text-inverse);
  --yiz-tag-solid-close-hover-bg: rgba(255, 255, 255, 0.2);
}

.yiz-tag-color-primary {
  --yiz-tag-base-color: var(--yiz-color-primary);
  --yiz-tag-filled-bg: var(--yiz-color-primary-bg);
  --yiz-tag-solid-bg: var(--yiz-color-primary);
  --yiz-tag-outlined-border: var(--yiz-color-primary);
  --yiz-tag-close-hover-bg: var(--yiz-color-primary-bg-hover);
  --yiz-tag-solid-on-color: var(--yiz-color-text-inverse);
  --yiz-tag-checkable-on-color: var(--yiz-color-text-inverse);
}

.yiz-tag-color-success {
  --yiz-tag-base-color: var(--yiz-color-success);
  --yiz-tag-filled-bg: var(--yiz-color-success-bg);
  --yiz-tag-solid-bg: var(--yiz-color-success);
  --yiz-tag-outlined-border: var(--yiz-color-success);
  --yiz-tag-close-hover-bg: var(--yiz-color-success-bg-hover);
  --yiz-tag-solid-on-color: var(--yiz-color-text-inverse);
  --yiz-tag-checkable-on-color: var(--yiz-color-text-inverse);
}

.yiz-tag-color-warning {
  --yiz-tag-base-color: var(--yiz-color-warning-text);
  --yiz-tag-filled-bg: var(--yiz-color-warning-bg);
  --yiz-tag-solid-bg: var(--yiz-color-warning);
  --yiz-tag-outlined-border: var(--yiz-color-warning);
  --yiz-tag-close-hover-bg: var(--yiz-color-warning-bg-hover);
  --yiz-tag-solid-on-color: var(--yiz-color-text-inverse);
  --yiz-tag-checkable-on-color: var(--yiz-color-text-inverse);
}

.yiz-tag-color-error {
  --yiz-tag-base-color: var(--yiz-color-error);
  --yiz-tag-filled-bg: var(--yiz-color-error-bg);
  --yiz-tag-solid-bg: var(--yiz-color-error);
  --yiz-tag-outlined-border: var(--yiz-color-error);
  --yiz-tag-close-hover-bg: var(--yiz-color-error-bg-hover);
  --yiz-tag-solid-on-color: var(--yiz-color-text-inverse);
  --yiz-tag-checkable-on-color: var(--yiz-color-text-inverse);
}

// mode variants
.yiz-tag-mode-filled {
  --yiz-tag-color: var(--yiz-tag-base-color);
  --yiz-tag-bg: var(--yiz-tag-filled-bg);
  --yiz-tag-border-color: transparent;
}

.yiz-tag-mode-solid {
  --yiz-tag-color: var(--yiz-tag-solid-on-color, var(--yiz-color-text-inverse));
  --yiz-tag-bg: var(--yiz-tag-solid-bg);
  --yiz-tag-border-color: var(--yiz-tag-solid-bg);
  --yiz-tag-close-hover-bg: var(--yiz-tag-solid-close-hover-bg, rgba(255, 255, 255, 0.2));
}

.yiz-tag-mode-outlined {
  --yiz-tag-color: var(--yiz-tag-base-color);
  --yiz-tag-bg: var(--yiz-tag-filled-bg);
  --yiz-tag-border-color: var(--yiz-tag-outlined-border);
}

.yiz-tag.yiz-tag-checkable {
  color: var(--yiz-color-text-primary);
  background: var(--yiz-color-bg-container);
  border-color: transparent;
  cursor: pointer;
  user-select: none;

  &:hover {
    color: var(--yiz-tag-checkable-color, var(--yiz-color-primary));
    background: var(--yiz-color-hover-bg);
    border-color: transparent;
  }

  &:focus-visible {
    outline: 2px solid var(--yiz-color-primary-bg-hover);
    outline-offset: 2px;
  }
}

.yiz-tag.yiz-tag-checkable-checked,
.yiz-tag.yiz-tag-checkable-checked:hover {
  color: var(--yiz-tag-checkable-on-color, var(--yiz-color-on-primary));
  background: var(--yiz-tag-checkable-color, var(--yiz-color-primary));
  border-color: transparent;
}

.yiz-tag.yiz-tag-checkable-disabled,
.yiz-tag.yiz-tag-checkable-disabled:hover {
  color: var(--yiz-color-text-primary);
  background: var(--yiz-color-bg-container);
  border-color: transparent;
  cursor: not-allowed;
  opacity: 0.5;
}

.yiz-tag.yiz-tag-checkable-checked.yiz-tag-checkable-disabled,
.yiz-tag.yiz-tag-checkable-checked.yiz-tag-checkable-disabled:hover {
  color: var(--yiz-tag-checkable-on-color, var(--yiz-color-on-primary));
  background: var(--yiz-tag-checkable-color, var(--yiz-color-primary));
}
</style>
