<template>
  <label class="yiz-radio-button" :class="vClass" :style="vStyle">
    <input
      ref="inputRef"
      class="yiz-radio-button-input"
      type="radio"
      :name="mergedName"
      :checked="checked"
      :disabled="mergedDisabled"
      :value="value"
      @change="onChange"
    />
    <span class="yiz-radio-button-content">
      <slot
        name="render"
        :label="label"
        :value="value"
        :checked="checked"
        :selected="checked"
        :disabled="mergedDisabled"
      >
        <slot>{{ label }}</slot>
      </slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import type { Ref, VNodeChild } from 'vue'

interface RadioButtonGroupContext {
  modelValue: Ref<string | number | boolean | undefined>
  disabled: Ref<boolean>
  name: Ref<string>
  size: Ref<'small' | 'default' | 'large'>
  textColor: Ref<string>
  fillColor: Ref<string>
  changeValue: (value: string | number | boolean) => void
}

const props = withDefaults(
  defineProps<{
    label?: string
    value?: string | number | boolean
    disabled?: boolean
    name?: string
    size?: 'small' | 'default' | 'large'
    textColor?: string
    fillColor?: string
  }>(),
  {
    label: '',
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

const emit = defineEmits<{ change: [value: string | number | boolean | undefined] }>()

const checkedModel = defineModel<boolean>('checked', { default: false })
const group = inject<RadioButtonGroupContext | null>('yizRadioButtonGroup', null)
const inputRef = ref<HTMLInputElement>()

const mergedDisabled = computed(() => props.disabled || (group?.disabled.value ?? false))
const mergedName = computed(() => props.name ?? group?.name.value)
const mergedSize = computed(() => group?.size.value ?? props.size)
const mergedTextColor = computed(() => props.textColor || group?.textColor.value || '')
const mergedFillColor = computed(() => props.fillColor || group?.fillColor.value || '')
const checked = computed(() => (group ? group.modelValue.value === props.value : checkedModel.value))

const vClass = computed(() => ({
  'yiz-radio-button-checked': checked.value,
  'yiz-radio-button-disabled': mergedDisabled.value,
  [`yiz-radio-button-${mergedSize.value}`]: true,
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
  if (mergedDisabled.value) return
  if (group) {
    if (props.value == null) return
    group.changeValue(props.value)
  } else {
    checkedModel.value = true
  }
  emit('change', props.value)
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<style lang="less">
.yiz-radio-button {
  --yiz-radio-button-checked-text-color: var(--yiz-color-text-inverse);
  --yiz-radio-button-checked-fill-color: var(--yiz-color-primary);
  --yiz-radio-button-checked-hover-fill-color: var(--yiz-color-primary-light2);
  --yiz-radio-button-min-width: 68px;
  --yiz-radio-button-padding-inline: var(--yiz-space-3);

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: var(--yiz-control-height-default);
  min-width: var(--yiz-radio-button-min-width);
  padding: 0 var(--yiz-radio-button-padding-inline);
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-base-border-radius-default);
  background: var(--yiz-color-bg-container);
  color: var(--yiz-color-text-primary);
  font-family: inherit;
  font-size: var(--yiz-font-size-default);
  line-height: normal;
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
  background: var(--yiz-color-bg-muted);
  color: #bfbfbf;
}

.yiz-radio-button-disabled .yiz-radio-button-input {
  cursor: not-allowed;
}

.yiz-radio-button-disabled.yiz-radio-button-checked {
  background: var(--yiz-color-primary-light8);
  border-color: var(--yiz-color-primary-light8);
  color: var(--yiz-color-text-inverse);
}

.yiz-radio-button-small {
  --yiz-radio-button-min-width: 56px;
  --yiz-radio-button-padding-inline: var(--yiz-space-2);

  height: var(--yiz-control-height-small);
  border-radius: var(--yiz-base-border-radius-small);
  font-size: var(--yiz-font-size-small);
}

.yiz-radio-button-large {
  --yiz-radio-button-min-width: 80px;
  --yiz-radio-button-padding-inline: var(--yiz-space-4);

  height: var(--yiz-control-height-large);
  border-radius: var(--yiz-base-border-radius-large);
  font-size: var(--yiz-font-size-large);
}
</style>
