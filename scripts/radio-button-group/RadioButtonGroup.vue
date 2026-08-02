<template>
  <div ref="groupRef" class="yiz-radio-button-group" :class="vClass">
    <template v-if="options.length > 0">
      <RadioButton
        v-for="option in options"
        :key="`${typeof option.value}:${String(option.value)}`"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      >
        <template v-if="$slots.render" #render="slotProps">
          <slot name="render" v-bind="slotProps" />
        </template>
      </RadioButton>
    </template>
    <slot v-else />
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, provide, ref } from 'vue'
import type { VNodeChild } from 'vue'
import RadioButton from '../radio-button/RadioButton.vue'

export interface RadioButtonOption {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    options?: RadioButtonOption[]
    disabled?: boolean
    name?: string
    size?: 'small' | 'default' | 'large'
    textColor?: string
    fillColor?: string
  }>(),
  {
    options: () => [],
    disabled: false,
    size: 'default',
    textColor: '',
    fillColor: '',
  },
)

defineSlots<{
  default?: () => VNodeChild
  render?: (props: {
    label: string
    value: string | number | boolean | undefined
    checked: boolean
    selected: boolean
    disabled: boolean
  }) => VNodeChild
}>()

const emit = defineEmits<{ change: [value: string | number | boolean] }>()
const modelValue = defineModel<string | number | boolean>('value')
const groupRef = ref<HTMLElement>()
const instanceId = getCurrentInstance()?.uid ?? 0
const groupName = computed(() => props.name ?? `yiz-radio-button-group-${instanceId}`)

const disabledValue = computed(() => props.disabled)
const sizeValue = computed(() => props.size)
const textColorValue = computed(() => props.textColor)
const fillColorValue = computed(() => props.fillColor)

const vClass = computed(() => ({
  'yiz-radio-button-group-disabled': props.disabled,
  [`yiz-radio-button-group-${props.size}`]: true,
}))

function changeValue(value: string | number | boolean) {
  if (props.disabled) return
  modelValue.value = value
  emit('change', value)
}

provide('yizRadioButtonGroup', {
  modelValue,
  disabled: disabledValue,
  name: groupName,
  size: sizeValue,
  textColor: textColorValue,
  fillColor: fillColorValue,
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
    border-top-left-radius: var(--yiz-base-border-radius-default);
    border-bottom-left-radius: var(--yiz-base-border-radius-default);
  }

  .yiz-radio-button:last-child {
    border-top-right-radius: var(--yiz-base-border-radius-default);
    border-bottom-right-radius: var(--yiz-base-border-radius-default);
  }
}

.yiz-radio-button-group-small {
  .yiz-radio-button:first-child {
    border-top-left-radius: var(--yiz-base-border-radius-small);
    border-bottom-left-radius: var(--yiz-base-border-radius-small);
  }

  .yiz-radio-button:last-child {
    border-top-right-radius: var(--yiz-base-border-radius-small);
    border-bottom-right-radius: var(--yiz-base-border-radius-small);
  }
}

.yiz-radio-button-group-large {
  .yiz-radio-button:first-child {
    border-top-left-radius: var(--yiz-base-border-radius-large);
    border-bottom-left-radius: var(--yiz-base-border-radius-large);
  }

  .yiz-radio-button:last-child {
    border-top-right-radius: var(--yiz-base-border-radius-large);
    border-bottom-right-radius: var(--yiz-base-border-radius-large);
  }
}

.yiz-radio-button-group-disabled {
  cursor: not-allowed;
}
</style>
