<template>
  <div class="yiz-checkbox-group" :class="[`yiz-checkbox-group-${direction}`]">
    <template v-if="options">
      <Checkbox v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</Checkbox>
    </template>
    <slot v-else />
  </div>
</template>

<script lang="ts" setup>
import { provide, toRef } from 'vue'
import { Checkbox } from '../checkbox'

export interface CheckboxOption {
  label: string
  value: string | number
}

const props = withDefaults(
  defineProps<{
    options?: CheckboxOption[]
    direction?: 'horizontal' | 'vertical' | 'free'
    disabled?: boolean
  }>(),
  {
    direction: 'horizontal',
    disabled: false,
  },
)

defineSlots<{
  default?: any
}>()

const modelValue = defineModel<(string | number)[]>('value', { default: () => [] })

function toggleValue(val: string | number) {
  if (modelValue.value.includes(val)) {
    modelValue.value = modelValue.value.filter((v) => v !== val)
  } else {
    modelValue.value = [...modelValue.value, val]
  }
}

provide('yizCheckboxGroup', {
  modelValue,
  disabled: toRef(props, 'disabled'),
  toggleValue,
})
</script>

<style lang="less">
.yiz-checkbox-group {
  display: inline-flex;
  align-items: center;
}

.yiz-checkbox-group-horizontal {
  flex-wrap: wrap;

  .yiz-checkbox + .yiz-checkbox {
    margin-left: 16px;
  }
}

.yiz-checkbox-group-vertical {
  flex-direction: column;
  align-items: flex-start;

  .yiz-checkbox + .yiz-checkbox {
    margin-top: 8px;
  }
}

.yiz-checkbox-group-free {
  display: block;
  .yiz-checkbox + .yiz-checkbox {
    margin-left: 16px;
  }
}
</style>
