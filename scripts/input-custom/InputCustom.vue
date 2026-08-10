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
import { useInputStyle } from '../input-style'

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
    styleMode?: 'outlined' | 'filled'
  }>(),
  {
    disabled: false,
    active: false,
    size: 'default',
    styleMode: 'outlined',
  },
)

const rootRef = ref<HTMLElement>()
const isFocus = ref(false)
const { styleMode: mergedStyleMode, size: mergedSize } = useInputStyle(
  () => props.styleMode,
  () => props.size,
)

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  c[`yiz-input-custom-${mergedStyleMode.value}`] = true
  if (props.active || isFocus.value) {
    c.focus = true
  }
  if (props.disabled) {
    c['yiz-input-custom-disabled'] = true
  }
  if (mergedSize.value === 'small') {
    c['yiz-input-custom-small'] = true
  }
  if (mergedSize.value === 'large') {
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
  min-height: var(--yiz-control-height-default);
  display: inline-flex;
  align-items: center;
  padding: 0 var(--yiz-control-padding-inline-default);
  font-family: inherit;
  font-size: var(--yiz-font-size-default);
  line-height: 1;
  background: var(--yiz-color-bg);
  vertical-align: middle;
  outline: none;
  gap: var(--yiz-control-affix-gap-default);

  &:not(.yiz-input-custom-disabled):hover {
    border: 1px solid var(--yiz-color-primary);
  }

  &.focus:not(.yiz-input-custom-disabled) {
    border: 1px solid var(--yiz-color-primary);
    box-shadow: var(--yiz-control-focus-shadow);
  }

  &.yiz-input-custom-disabled {
    background: var(--yiz-color-bg-muted);
    cursor: not-allowed;
    color: var(--yiz-color-text-disabled);

    &:hover {
      border-color: var(--yiz-color-border);
    }
  }

  &.yiz-input-custom-small {
    min-height: var(--yiz-control-height-small);
    border-radius: var(--yiz-base-border-radius-small);
    font-size: var(--yiz-font-size-small);
    padding-right: var(--yiz-control-padding-inline-small);
    padding-left: var(--yiz-control-padding-inline-small);
    gap: var(--yiz-control-affix-gap-small);
  }

  &.yiz-input-custom-large {
    min-height: var(--yiz-control-height-large);
    border-radius: var(--yiz-base-border-radius-large);
    font-size: var(--yiz-font-size-large);
    padding-right: var(--yiz-control-padding-inline-large);
    padding-left: var(--yiz-control-padding-inline-large);
    gap: var(--yiz-control-affix-gap-large);
  }

  .yiz-form-item-error-status &:not(.yiz-input-custom-disabled) {
    border-color: var(--yiz-color-error);

    &:hover {
      border-color: var(--yiz-color-error);
    }

    &.focus {
      border-color: var(--yiz-color-error);
      box-shadow: var(--yiz-control-error-focus-shadow);
    }
  }

  .yiz-input-custom-prefix,
  .yiz-input-custom-suffix {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    color: var(--yiz-color-text-secondary);
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
