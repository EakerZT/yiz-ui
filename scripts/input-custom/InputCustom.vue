<template>
  <div
    ref="rootRef"
    class="yiz-input-custom"
    :class="vClass"
    :tabindex="disabled ? undefined : 0"
    :aria-disabled="disabled || undefined"
    @focusin="isFocus = true"
    @focusout="isFocus = false"
  >
    <div class="yiz-input-custom-prefix" v-if="$props.prefix || $slots.prefix">
      <template v-if="$props.prefix">
        {{ $props.prefix }}
      </template>
      <slot v-else name="prefix" />
    </div>
    <div class="yiz-input-custom-content">
      <slot :disabled="disabled" />
    </div>
    <div class="yiz-input-custom-suffix" v-if="$props.suffix || $slots.suffix">
      <template v-if="$props.suffix">
        {{ $props.suffix }}
      </template>
      <slot v-else name="suffix" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

defineSlots<{
  default?: (props: { disabled: boolean }) => unknown
  prefix?: unknown
  suffix?: unknown
}>()

const props = withDefaults(
  defineProps<{
    prefix?: string
    suffix?: string
    disabled?: boolean
    active?: boolean
    size?: 'small' | 'default' | 'large'
  }>(),
  {
    disabled: false,
    active: false,
    size: 'default',
  },
)

const rootRef = ref<HTMLElement>()
const isFocus = ref(false)

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (props.active || isFocus.value) {
    c.focus = true
  }
  if (props.disabled) {
    c['yiz-input-custom-disabled'] = true
  }
  if (props.size === 'small') {
    c['yiz-input-custom-small'] = true
  }
  if (props.size === 'large') {
    c['yiz-input-custom-large'] = true
  }
  return c
})

function focus() {
  if (props.disabled) return
  const focusable = rootRef.value?.querySelector<HTMLElement>(
    'input, textarea, button, select, [tabindex]:not([tabindex="-1"])',
  )
  const target = focusable ?? rootRef.value
  target?.focus()
}

function blur() {
  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement && rootRef.value?.contains(activeElement)) {
    activeElement.blur()
    return
  }
  rootRef.value?.blur()
}

defineExpose({
  focus,
  blur,
})
</script>

<style lang="less">
.yiz-input-custom {
  box-sizing: border-box;
  border-radius: var(--yiz-base-border-radius-default);
  border: 1px solid var(--yiz-color-border);
  transition: 0.3s all;
  min-height: 32px;
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  font-family: inherit;
  font-size: var(--yiz-font-size-default);
  background: var(--yiz-color-bg);
  vertical-align: middle;
  outline: none;
  gap: 8px;

  &:not(.yiz-input-custom-disabled):hover {
    border: 1px solid var(--yiz-color-primary);
  }

  &.focus:not(.yiz-input-custom-disabled) {
    border: 1px solid var(--yiz-color-primary);
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }

  &.yiz-input-custom-disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    color: #c0c4cc;

    &:hover {
      border-color: var(--yiz-color-border);
    }
  }

  &.yiz-input-custom-small {
    min-height: 24px;
    border-radius: var(--yiz-base-border-radius-small);
    font-size: var(--yiz-font-size-small);
    padding-left: 7px;
    padding-right: 7px;
  }

  &.yiz-input-custom-large {
    min-height: 40px;
    border-radius: var(--yiz-base-border-radius-large);
    font-size: var(--yiz-font-size-large);
    padding-left: 11px;
    padding-right: 11px;
  }

  .yiz-form-item-error-status &:not(.yiz-input-custom-disabled) {
    border-color: var(--yiz-color-error);

    &:hover {
      border-color: var(--yiz-color-error);
    }

    &.focus {
      border-color: var(--yiz-color-error);
      box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
    }
  }

  .yiz-input-custom-prefix,
  .yiz-input-custom-suffix {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    color: #666;
    user-select: none;
  }

  .yiz-input-custom-content {
    display: inline-flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    height: 100%;
  }
}
</style>
