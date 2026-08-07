<template>
  <div class="yiz-input-number" :class="vClass">
    <button
      v-if="controls"
      type="button"
      class="yiz-input-number-btn yiz-input-number-decrease"
      :aria-label="$t('inputNumber.decrease')"
      :disabled="disabled || readonly || isMin"
      @click="decrease"
    >
      <Icon size="16" :icon="Subtract16Regular" />
    </button>
    <div class="yiz-input-number-prefix" v-if="$props.prefix || $slots.prefix">
      <template v-if="$props.prefix">{{ $props.prefix }}</template>
      <slot v-else name="prefix" />
    </div>
    <div class="yiz-input-number-input-wrap">
      <input
        ref="inputRef"
        class="yiz-input-number-input"
        :value="displayValue"
        :disabled="disabled"
        :readonly="readonly"
        :placeholder="placeholder"
        @input="onInput"
        @blur="onBlur"
        @focus="isFocus = true"
        @keydown="onInputKeydown"
        @keydown.up.prevent="increase"
        @keydown.down.prevent="decrease"
      />
    </div>
    <div class="yiz-input-number-suffix" v-if="$props.suffix || $slots.suffix">
      <template v-if="$props.suffix">{{ $props.suffix }}</template>
      <slot v-else name="suffix" />
    </div>
    <button
      v-if="controls"
      type="button"
      class="yiz-input-number-btn yiz-input-number-increase"
      :aria-label="$t('inputNumber.increase')"
      :disabled="disabled || readonly || isMax"
      @click="increase"
    >
      <Icon size="16" :icon="Add16Regular" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots } from 'vue'
import { Add16Regular, Subtract16Regular } from '@vicons/fluent'
import { Icon } from '../icon'
import { useInputStyleMode } from '../input-style'
import { $t } from '../locale'

const slots = useSlots()

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    precision?: number
    disabled?: boolean
    readonly?: boolean
    placeholder?: string
    size?: 'small' | 'default' | 'large'
    styleMode?: 'outlined' | 'filled'
    controls?: boolean
    align?: 'left' | 'center' | 'right'
    prefix?: string
    suffix?: string
  }>(),
  {
    step: 1,
    controls: true,
    align: 'left',
    disabled: false,
    readonly: false,
    placeholder: '',
    size: 'default',
    styleMode: 'outlined',
  },
)

defineSlots<{
  prefix?: any
  suffix?: any
}>()

const emit = defineEmits<{ pressEnter: [] }>()

const modelValue = defineModel<number | null>('value')

const inputRef = ref<HTMLInputElement>()
const isFocus = ref(false)
const mergedStyleMode = useInputStyleMode(() => props.styleMode)

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  c[`yiz-input-number-${mergedStyleMode.value}`] = true
  if (isFocus.value) c['yiz-input-number-focus'] = true
  if (props.disabled) c['yiz-input-number-disabled'] = true
  if (props.readonly) c['yiz-input-number-readonly'] = true
  if (props.size === 'small') c['yiz-input-number-small'] = true
  if (props.size === 'large') c['yiz-input-number-large'] = true
  c[`yiz-input-number-align-${props.align}`] = true
  if (props.prefix || slots.prefix) c['yiz-input-number-has-prefix'] = true
  if (props.suffix || slots.suffix) c['yiz-input-number-has-suffix'] = true
  return c
})

const displayValue = computed(() => {
  if (modelValue.value == null) return ''
  return String(modelValue.value)
})

const isMin = computed(() => {
  if (props.min == null || modelValue.value == null) return false
  return modelValue.value <= props.min
})

const isMax = computed(() => {
  if (props.max == null || modelValue.value == null) return false
  return modelValue.value >= props.max
})

function toPrecision(val: number): number {
  if (props.precision != null) {
    return parseFloat(val.toFixed(props.precision))
  }
  return val
}

function adjust(amount: number) {
  if (props.disabled || props.readonly) return
  const current = modelValue.value ?? props.min ?? 0
  let newVal = current + amount
  if (props.min != null) newVal = Math.max(newVal, props.min)
  if (props.max != null) newVal = Math.min(newVal, props.max)
  modelValue.value = toPrecision(newVal)
}

function increase() {
  adjust(props.step)
}

function decrease() {
  adjust(-props.step)
}

function onInput(e: Event) {
  if (props.disabled || props.readonly) return
  const raw = (e.target as HTMLInputElement).value
  if (raw === '' || raw === '-') {
    modelValue.value = null
    return
  }
  let num = parseFloat(raw)
  if (isNaN(num)) return
  if (props.min != null) num = Math.max(num, props.min)
  if (props.max != null) num = Math.min(num, props.max)
  modelValue.value = toPrecision(num)
}

function onInputKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  if (e.key === 'Enter') {
    emit('pressEnter')
  }
}

function onBlur() {
  isFocus.value = false
  if (props.readonly) return
  if (modelValue.value == null) return
  if (props.min != null && modelValue.value < props.min) {
    modelValue.value = props.min
  }
  if (props.max != null && modelValue.value > props.max) {
    modelValue.value = props.max
  }
  modelValue.value = toPrecision(modelValue.value)
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<style lang="less">
.yiz-input-number {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: var(--yiz-control-height-default);
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-base-border-radius-default);
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  background: var(--yiz-color-bg-container);
  overflow: hidden;

  &:hover {
    border-color: var(--yiz-color-primary);
  }

  &.yiz-input-number-focus {
    border-color: var(--yiz-color-primary);
    box-shadow: var(--yiz-control-focus-shadow);
  }

  &.yiz-input-number-disabled {
    background: var(--yiz-color-bg-muted);
    cursor: not-allowed;

    &:hover {
      border-color: var(--yiz-color-border, #d9d9d9);
    }
  }

  &.yiz-input-number-readonly .yiz-input-number-input {
    cursor: default;
  }

  &.yiz-input-number-small {
    height: var(--yiz-control-height-small);
    border-radius: var(--yiz-base-border-radius-small);
  }

  &.yiz-input-number-large {
    height: var(--yiz-control-height-large);
    border-radius: var(--yiz-base-border-radius-large);
  }

  .yiz-form-item-error-status &:not(.yiz-input-number-disabled) {
    border-color: var(--yiz-color-error);

    &:hover {
      border-color: var(--yiz-color-error);
    }

    &.yiz-input-number-focus {
      border-color: var(--yiz-color-error);
      box-shadow: var(--yiz-control-error-focus-shadow);
    }
  }
}

.yiz-input-number-prefix {
  margin: 0 var(--yiz-control-affix-gap-default) 0 var(--yiz-control-padding-inline-default);
  user-select: none;
  font-size: var(--yiz-font-size-default);
}

.yiz-input-number-suffix {
  margin: 0 var(--yiz-control-padding-inline-default) 0 var(--yiz-control-affix-gap-default);
  user-select: none;
  font-size: var(--yiz-font-size-default);
}

.yiz-input-number-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 100%;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--yiz-color-text-secondary);
  transition:
    color 0.2s,
    background 0.2s;
  flex-shrink: 0;
  border-radius: 0;

  &:hover:not(:disabled) {
    color: var(--yiz-color-primary);
    background: #f0f5ff;
  }

  &:disabled {
    color: var(--yiz-color-text-disabled);
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    background: #e6efff;
  }
}

.yiz-input-number-decrease {
  border-right: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-input-number-increase {
  border-left: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-input-number-input-wrap {
  display: flex;
  flex: 1;
  height: 100%;
  min-width: 0;
}

.yiz-input-number-input {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: var(--yiz-font-size-default);
  font-family: inherit;
  padding: 0 var(--yiz-control-content-padding-inline-default);
  background: transparent;
  box-sizing: border-box;
  min-width: 0;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:disabled {
    cursor: not-allowed;
    color: var(--yiz-color-text-disabled);
  }
}

.yiz-input-number-small {
  .yiz-input-number-prefix {
    margin: 0 var(--yiz-control-affix-gap-small) 0 var(--yiz-control-padding-inline-small);
    font-size: var(--yiz-font-size-small);
  }

  .yiz-input-number-suffix {
    margin: 0 var(--yiz-control-padding-inline-small) 0 var(--yiz-control-affix-gap-small);
    font-size: var(--yiz-font-size-small);
  }

  .yiz-input-number-input {
    padding: 0 var(--yiz-control-content-padding-inline-small);
    font-size: var(--yiz-font-size-small);
  }

  .yiz-input-number-btn {
    width: 24px;
  }
}

.yiz-input-number-large {
  .yiz-input-number-input,
  .yiz-input-number-prefix,
  .yiz-input-number-suffix {
    font-size: var(--yiz-font-size-large);
  }

  .yiz-input-number-prefix {
    margin: 0 var(--yiz-control-affix-gap-large) 0 var(--yiz-control-padding-inline-large);
  }

  .yiz-input-number-suffix {
    margin: 0 var(--yiz-control-padding-inline-large) 0 var(--yiz-control-affix-gap-large);
  }

  .yiz-input-number-input {
    padding: 0 var(--yiz-control-content-padding-inline-large);
  }

  .yiz-input-number-btn {
    width: 36px;
  }
}

.yiz-input-number-align-left .yiz-input-number-input {
  text-align: left;
}

.yiz-input-number-align-center .yiz-input-number-input {
  text-align: center;
}

.yiz-input-number-align-right .yiz-input-number-input {
  text-align: right;
}
</style>
