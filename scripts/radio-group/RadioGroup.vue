<template>
  <div
    ref="groupRef"
    class="yiz-radio-group"
    :class="[`yiz-radio-group-${direction}`, { 'yiz-radio-group-disabled': disabled }]"
  >
    <template v-if="options.length > 0">
      <Radio v-for="opt in options" :key="opt.value" :value="opt.value" :disabled="opt.disabled">
        {{ opt.label }}
      </Radio>
    </template>
    <slot v-else />
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, provide, ref, toRef } from 'vue'
import { Radio } from '../radio'

export interface RadioOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    options?: RadioOption[]
    direction?: 'horizontal' | 'vertical' | 'free'
    disabled?: boolean
    name?: string
  }>(),
  {
    options: () => [],
    direction: 'horizontal',
    disabled: false,
  },
)

defineSlots<{
  default?: any
}>()

const emit = defineEmits<{ change: [value: string | number] }>()
const modelValue = defineModel<string | number>('value')
const groupRef = ref<HTMLElement>()
const instanceId = getCurrentInstance()?.uid ?? 0
const groupName = computed(() => props.name ?? `yiz-radio-group-${instanceId}`)

function changeValue(value: string | number) {
  if (props.disabled) return
  modelValue.value = value
  emit('change', value)
}

provide('yizRadioGroup', {
  modelValue,
  disabled: toRef(props, 'disabled'),
  name: groupName,
  changeValue,
})

function focus() {
  if (props.disabled) return
  const checkedInput = groupRef.value?.querySelector<HTMLInputElement>('input[type="radio"]:checked:not(:disabled)')
  const input = checkedInput ?? groupRef.value?.querySelector<HTMLInputElement>('input[type="radio"]:not(:disabled)')
  input?.focus()
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
