<template>
  <label class="yiz-radio-button" :class="vClass">
    <input
      class="yiz-radio-button-input"
      type="radio"
      :checked="checked"
      :disabled="mergedDisabled"
      :value="value"
      @change="onChange"
    />
    <span class="yiz-radio-button-content">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { computed, inject, type Ref } from 'vue'

interface RadioButtonGroupContext {
  modelValue: Ref<string | number | undefined>
  disabled: Ref<boolean>
  size: Ref<'small' | 'default' | 'large'>
  changeValue: (value: string | number) => void
}

const props = withDefaults(
  defineProps<{
    label?: string
    value?: string | number
    disabled?: boolean
    size?: 'small' | 'default' | 'large'
  }>(),
  {
    label: '',
    disabled: false,
    size: 'default'
  }
)

defineSlots<{
  default?: any
}>()

const emit = defineEmits<{ change: [value: string | number] }>()

const modelValue = defineModel<string | number>()
const group = inject<RadioButtonGroupContext | null>('yizRadioButtonGroup', null)

const currentValue = computed(() => group?.modelValue.value ?? modelValue.value)
const mergedDisabled = computed(() => props.disabled || (group?.disabled.value ?? false))
const mergedSize = computed(() => group?.size.value ?? props.size)
const checked = computed(() => currentValue.value === props.value)

const vClass = computed(() => ({
  'yiz-radio-button-checked': checked.value,
  'yiz-radio-button-disabled': mergedDisabled.value,
  [`yiz-radio-button-${mergedSize.value}`]: true
}))

function onChange() {
  if (mergedDisabled.value || props.value == null) return
  if (group) {
    group.changeValue(props.value)
  } else {
    modelValue.value = props.value
  }
  emit('change', props.value)
}
</script>

<style lang="less">
.yiz-radio-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  height: 34px;
  padding: 0 14px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  background: #fff;
  color: #333;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  transition:
    color 0.2s,
    border-color 0.2s,
    background-color 0.2s,
    box-shadow 0.2s;
}

.yiz-radio-button-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.yiz-radio-button-content {
  position: relative;
  z-index: 1;
  white-space: nowrap;
}

.yiz-radio-button:not(.yiz-radio-button-disabled):hover {
  color: var(--yiz-color-primary);
  border-color: var(--yiz-color-primary);
  z-index: 1;
}

.yiz-radio-button-checked {
  background: var(--yiz-color-primary);
  border-color: var(--yiz-color-primary);
  color: #fff;
  z-index: 2;
}

.yiz-radio-button-checked:not(.yiz-radio-button-disabled):hover {
  background: var(--yiz-color-primary-light2);
  border-color: var(--yiz-color-primary-light2);
  color: #fff;
}

.yiz-radio-button-disabled {
  cursor: not-allowed;
  background: #f5f5f5;
  color: #bfbfbf;
}

.yiz-radio-button-disabled .yiz-radio-button-input {
  cursor: not-allowed;
}

.yiz-radio-button-disabled.yiz-radio-button-checked {
  background: var(--yiz-color-primary-light8);
  border-color: var(--yiz-color-primary-light8);
  color: #fff;
}

.yiz-radio-button-small {
  min-width: 56px;
  height: 28px;
  padding: 0 10px;
  font-size: 13px;
}

.yiz-radio-button-large {
  min-width: 84px;
  height: 40px;
  padding: 0 18px;
  font-size: 15px;
}
</style>
