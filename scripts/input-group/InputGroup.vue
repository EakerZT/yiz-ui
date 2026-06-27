<template>
  <div class="yiz-input-group" :class="vClass">
    <div v-if="$slots.beforeAddon || beforeAddon != null" class="yiz-input-group-addon yiz-input-group-before-addon">
      <slot name="beforeAddon">{{ beforeAddon }}</slot>
    </div>
    <slot />
    <div v-if="$slots.afterAddon || afterAddon != null" class="yiz-input-group-addon yiz-input-group-after-addon">
      <slot name="afterAddon">{{ afterAddon }}</slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    block?: boolean
    size?: 'small' | 'default' | 'large'
    beforeAddon?: string | number
    afterAddon?: string | number
  }>(),
  {
    block: false,
    size: 'default'
  }
)

defineSlots<{
  default?: any
  beforeAddon?: any
  afterAddon?: any
}>()

const vClass = computed(() => ({
  'yiz-input-group-block': props.block,
  'yiz-input-group-small': props.size === 'small',
  'yiz-input-group-default': props.size === 'default',
  'yiz-input-group-large': props.size === 'large'
}))
</script>

<style lang="less">
.yiz-input-group {
  --yiz-input-group-height: 32px;
  --yiz-input-group-inner-height: 30px;
  --yiz-input-group-font-size: 14px;
  --yiz-input-group-radius: 4px;

  display: inline-flex;
  align-items: stretch;
  vertical-align: middle;

  &.yiz-input-group-small {
    --yiz-input-group-height: 24px;
    --yiz-input-group-inner-height: 22px;
    --yiz-input-group-font-size: 13px;
  }

  &.yiz-input-group-large {
    --yiz-input-group-height: 40px;
    --yiz-input-group-inner-height: 38px;
    --yiz-input-group-font-size: 16px;
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

  > .focus,
  > .yiz-input-number-focus,
  > .yiz-select-open,
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
  > .yiz-input-number,
  > .yiz-select,
  > .yiz-button,
  > .yiz-color-picker,
  > .yiz-input-group-addon {
    height: var(--yiz-input-group-height);
    border-radius: var(--yiz-input-group-radius);
    box-sizing: border-box;
    font-size: var(--yiz-input-group-font-size);
  }

  > .yiz-input,
  > .yiz-input-number,
  > .yiz-select,
  > .yiz-color-picker {
    min-height: var(--yiz-input-group-height);
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
  > .yiz-input-number .yiz-input-number-input {
    height: var(--yiz-input-group-inner-height);
    line-height: var(--yiz-input-group-inner-height);
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
    background: #fafafa;
    color: #666;
    white-space: nowrap;
    user-select: none;
  }

  > .yiz-input:not(:first-child),
  > .yiz-input-number:not(:first-child),
  > .yiz-select:not(:first-child),
  > .yiz-button:not(:first-child),
  > .yiz-color-picker:not(:first-child),
  > .yiz-input-group-addon:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  > .yiz-input:not(:last-child),
  > .yiz-input-number:not(:last-child),
  > .yiz-select:not(:last-child),
  > .yiz-button:not(:last-child),
  > .yiz-color-picker:not(:last-child),
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
