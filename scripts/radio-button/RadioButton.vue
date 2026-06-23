<template>
  <label class="yiz-radio-button" :class="vClass" :style="vStyle">
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
  textColor: Ref<string>
  fillColor: Ref<string>
  changeValue: (value: string | number) => void
}

const props = withDefaults(
  defineProps<{
    label?: string
    value?: string | number
    disabled?: boolean
    size?: 'small' | 'default' | 'large'
    textColor?: string
    fillColor?: string
  }>(),
  {
    label: '',
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

const modelValue = defineModel<string | number>()
const group = inject<RadioButtonGroupContext | null>('yizRadioButtonGroup', null)

const currentValue = computed(() => group?.modelValue.value ?? modelValue.value)
const mergedDisabled = computed(() => props.disabled || (group?.disabled.value ?? false))
const mergedSize = computed(() => group?.size.value ?? props.size)
const mergedTextColor = computed(() => props.textColor || group?.textColor.value || '')
const mergedFillColor = computed(() => props.fillColor || group?.fillColor.value || '')
const checked = computed(() => currentValue.value === props.value)

const vClass = computed(() => ({
  'yiz-radio-button-checked': checked.value,
  'yiz-radio-button-disabled': mergedDisabled.value,
  [`yiz-radio-button-${mergedSize.value}`]: true
}))

const vStyle = computed(() => {
  const style: Record<string, string> = {}
  if (mergedTextColor.value) {
    style['--yiz-radio-button-checked-text-color'] = mergedTextColor.value
  }
  if (mergedFillColor.value) {
    style['--yiz-radio-button-checked-fill-color'] = mergedFillColor.value
    style['--yiz-radio-button-checked-hover-fill-color'] = mergedFillColor.value
  }
  return style
})

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
  --yiz-radio-button-checked-text-color: #fff;
  --yiz-radio-button-checked-fill-color: var(--yiz-color-primary);
  --yiz-radio-button-checked-hover-fill-color: var(--yiz-color-primary-light2);

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 72px;
  padding: 6px 14px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  background: #fff;
  color: #333;
  font-size: 14px;
  line-height: 20px;
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
  background: var(--yiz-radio-button-checked-fill-color);
  border-color: var(--yiz-radio-button-checked-fill-color);
  color: var(--yiz-radio-button-checked-text-color);
  z-index: 2;
}

.yiz-radio-button-checked:not(.yiz-radio-button-disabled):hover {
  background: var(--yiz-radio-button-checked-hover-fill-color);
  border-color: var(--yiz-radio-button-checked-hover-fill-color);
  color: var(--yiz-radio-button-checked-text-color);
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
  padding: 4px 10px;
  font-size: 13px;
  line-height: 18px;
}

.yiz-radio-button-large {
  min-width: 84px;
  padding: 8px 18px;
  font-size: 15px;
  line-height: 22px;
}
</style>
