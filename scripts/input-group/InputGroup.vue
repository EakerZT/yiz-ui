<template>
  <div ref="groupRef" class="yiz-input-group" :class="vClass">
    <InputAddon v-if="$slots.beforeAddon || beforeAddon != null" class="yiz-input-group-before-addon">
      <slot name="beforeAddon">{{ beforeAddon }}</slot>
    </InputAddon>
    <slot />
    <InputAddon v-if="$slots.afterAddon || afterAddon != null" class="yiz-input-group-after-addon">
      <slot name="afterAddon">{{ afterAddon }}</slot>
    </InputAddon>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, ref } from 'vue'
import { InputAddon } from '../input-addon'
import { inputGroupStyleKey } from '../input-style'
import { useThemeInputStyleMode, useThemeSize } from '../theme'

const props = withDefaults(
  defineProps<{
    block?: boolean
    size?: 'small' | 'default' | 'large'
    styleMode?: 'outlined' | 'filled'
    beforeAddon?: string | number
    afterAddon?: string | number
  }>(),
  {
    block: false,
  },
)

defineSlots<{
  default?: any
  beforeAddon?: any
  afterAddon?: any
}>()

const resolvedSize = useThemeSize(() => props.size)
const resolvedStyleMode = useThemeInputStyleMode(() => props.styleMode)
const vClass = computed(() => ({
  'yiz-input-group-block': props.block,
  'yiz-input-group-small': resolvedSize.value === 'small',
  'yiz-input-group-default': resolvedSize.value === 'default',
  'yiz-input-group-large': resolvedSize.value === 'large',
  [`yiz-input-group-${resolvedStyleMode.value}`]: true,
}))

const groupRef = ref<HTMLElement>()

provide(inputGroupStyleKey, {
  styleMode: resolvedStyleMode,
  size: resolvedSize,
})

function focus() {
  groupRef.value
    ?.querySelector<HTMLElement>(
      'input:not(:disabled), textarea:not(:disabled), button:not(:disabled), [tabindex]:not([tabindex="-1"])',
    )
    ?.focus()
}

function blur() {
  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement && groupRef.value?.contains(activeElement)) activeElement.blur()
}

defineExpose({
  focus,
  blur,
})
</script>

<style lang="less">
.yiz-input-group {
  --yiz-input-group-height: var(--yiz-control-height-default);
  --yiz-input-group-font-size: var(--yiz-font-size-default);
  --yiz-input-group-radius: var(--yiz-base-border-radius-default);

  display: inline-flex;
  align-items: stretch;
  vertical-align: middle;

  &.yiz-input-group-small {
    --yiz-input-group-height: var(--yiz-control-height-small);
    --yiz-input-group-font-size: var(--yiz-font-size-small);
    --yiz-input-group-radius: var(--yiz-base-border-radius-small);
  }

  &.yiz-input-group-large {
    --yiz-input-group-height: var(--yiz-control-height-large);
    --yiz-input-group-font-size: var(--yiz-font-size-large);
    --yiz-input-group-radius: var(--yiz-base-border-radius-large);
  }

  &.yiz-input-group-block {
    display: flex;
    width: 100%;
  }

  > * {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }

  > * + * {
    margin-left: -1px;
  }

  > *:hover {
    z-index: 2;
  }

  > *:focus-within {
    z-index: 3;
  }

  > .yiz-button-type-primary + .yiz-button-type-primary::before {
    content: '';
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 0;
    z-index: 2;
    width: 1px;
    background: rgba(255, 255, 255, 0.4);
    pointer-events: none;
  }

  > .focus,
  > .yiz-input-custom.focus,
  > .yiz-input-number-focus,
  > .yiz-select-open,
  > .yiz-checkbox-border.yiz-checkbox-checked,
  > .yiz-button:active,
  > .yiz-color-picker-open,
  > .yiz-date-picker-open,
  > .yiz-date-range-picker-open,
  > .yiz-time-picker-open,
  > .yiz-time-range-picker-open,
  > .yiz-datetime-picker-open,
  > .yiz-datetime-range-picker-open {
    z-index: 3;
  }

  > .yiz-input,
  > .yiz-input-custom,
  > .yiz-input-number,
  > .yiz-select,
  > .yiz-button,
  > .yiz-color-picker,
  > .yiz-checkbox-border,
  > .yiz-input-group-addon {
    height: var(--yiz-input-group-height);
    border-radius: var(--yiz-input-group-radius);
    box-sizing: border-box;
    font-size: var(--yiz-input-group-font-size);
  }

  > .yiz-input,
  > .yiz-input-custom,
  > .yiz-input-number,
  > .yiz-select,
  > .yiz-color-picker {
    min-height: var(--yiz-input-group-height);
  }

  > .yiz-checkbox-border {
    padding-top: 0;
    padding-bottom: 0;
  }

  > .yiz-button {
    min-height: var(--yiz-input-group-height);
    padding-top: 0;
    padding-bottom: 0;

    &.yiz-button-shape-circle {
      width: var(--yiz-input-group-height);
      padding-left: 0;
      padding-right: 0;
    }

    &.yiz-button-shape-round {
      border-radius: var(--yiz-input-group-radius);
    }
  }

  > .yiz-input .yiz-input_outer .yiz-input_inner,
  > .yiz-input-custom .yiz-input-custom-content,
  > .yiz-input-number .yiz-input-number-input {
    font-size: var(--yiz-input-group-font-size);
  }

  > .yiz-date-picker .yiz-date-picker-input,
  > .yiz-date-range-picker .yiz-date-range-picker-input,
  > .yiz-time-picker .yiz-time-picker-input,
  > .yiz-time-range-picker .yiz-time-range-picker-input,
  > .yiz-datetime-picker .yiz-datetime-picker-input,
  > .yiz-datetime-range-picker .yiz-datetime-range-picker-input {
    height: var(--yiz-input-group-height);
    border-radius: var(--yiz-input-group-radius);
    font-size: var(--yiz-input-group-font-size);
    box-sizing: border-box;
  }

  > .yiz-date-picker input,
  > .yiz-date-range-picker input,
  > .yiz-time-picker input,
  > .yiz-time-range-picker input,
  > .yiz-datetime-picker input,
  > .yiz-datetime-range-picker input {
    font-size: var(--yiz-input-group-font-size);
  }

  > .yiz-input-group-addon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: var(--yiz-input-group-height);
    padding: 0 11px;
    border: 1px solid var(--yiz-color-border, #d9d9d9);
    background: var(--yiz-color-bg-subtle);
    color: var(--yiz-color-text-secondary);
    line-height: 1;
    white-space: nowrap;
    user-select: none;
  }

  > .yiz-input:not(:first-child),
  > .yiz-input-custom:not(:first-child),
  > .yiz-input-number:not(:first-child),
  > .yiz-select:not(:first-child),
  > .yiz-button:not(:first-child),
  > .yiz-color-picker:not(:first-child),
  > .yiz-checkbox-border:not(:first-child),
  > .yiz-input-group-addon:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  > .yiz-input:not(:last-child),
  > .yiz-input-custom:not(:last-child),
  > .yiz-input-number:not(:last-child),
  > .yiz-select:not(:last-child),
  > .yiz-button:not(:last-child),
  > .yiz-color-picker:not(:last-child),
  > .yiz-checkbox-border:not(:last-child),
  > .yiz-input-group-addon:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  > .yiz-date-picker:not(:first-child) .yiz-date-picker-input,
  > .yiz-date-range-picker:not(:first-child) .yiz-date-range-picker-input,
  > .yiz-time-picker:not(:first-child) .yiz-time-picker-input,
  > .yiz-time-range-picker:not(:first-child) .yiz-time-range-picker-input,
  > .yiz-datetime-picker:not(:first-child) .yiz-datetime-picker-input,
  > .yiz-datetime-range-picker:not(:first-child) .yiz-datetime-range-picker-input {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  > .yiz-date-picker:not(:last-child) .yiz-date-picker-input,
  > .yiz-date-range-picker:not(:last-child) .yiz-date-range-picker-input,
  > .yiz-time-picker:not(:last-child) .yiz-time-picker-input,
  > .yiz-time-range-picker:not(:last-child) .yiz-time-range-picker-input,
  > .yiz-datetime-picker:not(:last-child) .yiz-datetime-picker-input,
  > .yiz-datetime-range-picker:not(:last-child) .yiz-datetime-range-picker-input {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  > .yiz-button:not(:first-child) > .yiz-wave {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  > .yiz-button:not(:last-child) > .yiz-wave {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}
</style>
