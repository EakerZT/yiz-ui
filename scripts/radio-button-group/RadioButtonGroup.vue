<template>
  <div class="yiz-radio-button-group" :class="vClass">
    <template v-if="options.length > 0">
      <RadioButton
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      />
    </template>
    <slot v-else />
  </div>
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue'
import RadioButton from '../radio-button/RadioButton.vue'

export interface RadioButtonOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    options?: RadioButtonOption[]
    disabled?: boolean
    size?: 'small' | 'default' | 'large'
    textColor?: string
    fillColor?: string
  }>(),
  {
    options: () => [],
    disabled: false,
    size: 'default',
    textColor: '',
    fillColor: ''
  }
)

defineSlots<{
  default?: any
}>()

const emit = defineEmits<{ change: [value: string | number] }>()
const modelValue = defineModel<string | number>('value')

const disabledValue = computed(() => props.disabled)
const sizeValue = computed(() => props.size)
const textColorValue = computed(() => props.textColor)
const fillColorValue = computed(() => props.fillColor)

const vClass = computed(() => ({
  'yiz-radio-button-group-disabled': props.disabled,
  [`yiz-radio-button-group-${props.size}`]: true
}))

function changeValue(value: string | number) {
  if (props.disabled) return
  modelValue.value = value
  emit('change', value)
}

provide('yizRadioButtonGroup', {
  modelValue,
  disabled: disabledValue,
  size: sizeValue,
  textColor: textColorValue,
  fillColor: fillColorValue,
  changeValue
})
</script>

<style lang="less">
.yiz-radio-button-group {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;

  .yiz-radio-button {
    border-radius: 0;
  }

  .yiz-radio-button + .yiz-radio-button {
    margin-left: -1px;
  }

  .yiz-radio-button:first-child {
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
  }

  .yiz-radio-button:last-child {
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }
}

.yiz-radio-button-group-disabled {
  cursor: not-allowed;
}
</style>
