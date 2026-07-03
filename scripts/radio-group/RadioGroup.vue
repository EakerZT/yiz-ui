<template>
  <div class="yiz-radio-group" :class="[`yiz-radio-group-${direction}`, { 'yiz-radio-group-disabled': disabled }]">
    <Radio
      v-for="opt in options"
      :key="opt.value"
      :label="opt.label"
      :value="opt.value"
      :disabled="disabled"
      :model-value="modelValue"
      @update:model-value="onUpdateValue"
    />
  </div>
</template>

<script lang="ts" setup>
import { Radio } from '../radio'

export interface RadioOption {
  label: string
  value: string | number
}

withDefaults(
  defineProps<{
    options: RadioOption[]
    direction?: 'horizontal' | 'vertical' | 'free'
    disabled?: boolean
  }>(),
  {
    direction: 'horizontal',
    disabled: false,
  },
)

const modelValue = defineModel<string | number>('value')

function onUpdateValue(val: string | number | undefined) {
  if (val !== undefined) {
    modelValue.value = val
  }
}
</script>

<style lang="less">
.yiz-radio-group {
  display: inline-flex;
  align-items: center;
}

.yiz-radio-group-horizontal {
  flex-wrap: wrap;
  gap: 8px 16px;
}

.yiz-radio-group-vertical {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.yiz-radio-group-free {
  gap: 8px 16px;
}
</style>
