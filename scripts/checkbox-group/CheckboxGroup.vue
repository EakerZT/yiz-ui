<template>
  <div class="yiz-checkbox-group" :class="[`yiz-checkbox-group-${direction}`, { 'yiz-checkbox-group-disabled': disabled }]">
    <Checkbox
      v-for="opt in options"
      :key="opt.value"
      :label="opt.label"
      :disabled="disabled"
      :value="isChecked(opt.value)"
      @update:value="(val: boolean) => onCheck(opt.value, val)"
    />
  </div>
</template>

<script lang="ts" setup>
import { Checkbox } from '../checkbox'

export interface CheckboxOption {
  label: string
  value: string | number
}

const props = withDefaults(
  defineProps<{
    options: CheckboxOption[]
    direction?: 'horizontal' | 'vertical' | 'free'
    disabled?: boolean
  }>(),
  {
    direction: 'horizontal',
    disabled: false,
  }
)

const modelValue = defineModel<(string | number)[]>('value', { default: () => [] })

function isChecked(val: string | number): boolean {
  return modelValue.value.includes(val)
}

function onCheck(val: string | number, checked: boolean) {
  if (checked) {
    modelValue.value = [...modelValue.value, val]
  } else {
    modelValue.value = modelValue.value.filter((v) => v !== val)
  }
}
</script>

<style lang="less">
.yiz-checkbox-group {
  display: inline-flex;
  align-items: center;
}

.yiz-checkbox-group-horizontal {
  flex-wrap: wrap;
  gap: 8px 16px;
}

.yiz-checkbox-group-vertical {
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.yiz-checkbox-group-free {
  gap: 8px 16px;
}
</style>
