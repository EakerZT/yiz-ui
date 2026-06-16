<template>
  <div class="yiz-input-number" :class="vClass">
    <div class="yiz-input-number-prefix" v-if="$props.prefix || $slots.prefix">
      <template v-if="$props.prefix">{{ $props.prefix }}</template>
      <slot v-else name="prefix" />
    </div>
    <button
      v-if="controls"
      class="yiz-input-number-btn yiz-input-number-decrease"
      :disabled="disabled || isMin"
      @click="decrease"
    >
      <svg viewBox="0 0 16 16" width="14" height="14">
        <path d="M3 8h10" stroke="currentColor" stroke-width="1.5" fill="none" />
      </svg>
    </button>
    <div class="yiz-input-number-input-wrap">
      <input
        ref="inputRef"
        class="yiz-input-number-input"
        :value="displayValue"
        :disabled="disabled"
        :placeholder="placeholder"
        @input="onInput"
        @blur="onBlur"
        @focus="isFocus = true"
        @keydown="onInputKeydown"
        @keydown.up.prevent="increase"
        @keydown.down.prevent="decrease"
      />
    </div>
    <button
      v-if="controls"
      class="yiz-input-number-btn yiz-input-number-increase"
      :disabled="disabled || isMax"
      @click="increase"
    >
      <svg viewBox="0 0 16 16" width="14" height="14">
        <path d="M3 8h10M8 3v10" stroke="currentColor" stroke-width="1.5" fill="none" />
      </svg>
    </button>
    <div class="yiz-input-number-suffix" v-if="$props.suffix || $slots.suffix">
      <template v-if="$props.suffix">{{ $props.suffix }}</template>
      <slot v-else name="suffix" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots } from 'vue'

const slots = useSlots()

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    precision?: number
    disabled?: boolean
    placeholder?: string
    size?: 'default' | 'small'
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
    placeholder: '',
    size: 'default'
  }
)

defineSlots<{
  prefix?: any
  suffix?: any
}>()

const emit = defineEmits<{ pressEnter: [] }>()

const modelValue = defineModel<number | null>('modelValue')

const inputRef = ref<HTMLInputElement>()
const isFocus = ref(false)

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (isFocus.value) c['yiz-input-number-focus'] = true
  if (props.disabled) c['yiz-input-number-disabled'] = true
  if (props.size === 'small') c['yiz-input-number-small'] = true
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
  if (props.disabled) return
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
  if (e.key === 'Enter') {
    emit('pressEnter')
  }
}

function onBlur() {
  isFocus.value = false
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
  focus: () => inputRef.value?.focus()
})
</script>

<style lang="less">
.yiz-input-number {
  display: inline-flex;
  align-items: center;
  height: 32px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 4px;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  background: #fff;
  overflow: hidden;

  &:hover {
    border-color: var(--yiz-color-primary);
  }

  &.yiz-input-number-focus {
    border-color: var(--yiz-color-primary);
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }

  &.yiz-input-number-disabled {
    background: #f5f5f5;
    cursor: not-allowed;

    &:hover {
      border-color: var(--yiz-color-border, #d9d9d9);
    }
  }

  &.yiz-input-number-small {
    height: 24px;
  }

  .yiz-form-item-error-status &:not(.yiz-input-number-disabled) {
    border-color: var(--yiz-color-error);

    &:hover {
      border-color: var(--yiz-color-error);
    }

    &.yiz-input-number-focus {
      border-color: var(--yiz-color-error);
      box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
    }
  }
}

.yiz-input-number-prefix {
  margin: 0 8px 0 12px;
  user-select: none;
  font-size: 14px;
}

.yiz-input-number-suffix {
  margin: 0 12px 0 8px;
  user-select: none;
  font-size: 14px;
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
  color: #666;
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
    color: #c0c4cc;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    background: #e6efff;
  }
}

.yiz-input-number-decrease {
  border-right: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-input-number-has-prefix .yiz-input-number-decrease {
  border-left: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-input-number-increase {
  border-left: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-input-number-has-suffix .yiz-input-number-increase {
  border-right: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-input-number-input-wrap {
  flex: 1;
  height: 100%;
}

.yiz-input-number-input {
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  padding: 0 8px;
  background: transparent;
  box-sizing: border-box;
  -moz-appearance: textfield;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:disabled {
    cursor: not-allowed;
    color: #c0c4cc;
  }
}

.yiz-input-number-small .yiz-input-number-input {
  font-size: 13px;
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
