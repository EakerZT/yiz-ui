<template>
  <label class="yiz-radio" :class="vClass">
    <span class="yiz-radio-input">
      <input
        ref="inputRef"
        type="radio"
        :name="mergedName"
        :checked="checked"
        :disabled="mergedDisabled"
        :value="value"
        @change="onChange"
      />
      <span class="yiz-radio-inner"></span>
      <span class="yiz-wave" v-if="isWave"></span>
    </span>
    <span v-if="label || $slots.default" class="yiz-radio-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, nextTick, ref, type Ref } from 'vue'

interface RadioGroupContext {
  modelValue: Ref<string | number | undefined>
  disabled: Ref<boolean>
  name: Ref<string>
  changeValue: (value: string | number) => void
}

const props = withDefaults(
  defineProps<{
    label?: string
    value?: string | number
    modelValue?: string | number
    checked?: boolean
    disabled?: boolean
    name?: string
  }>(),
  {
    checked: false,
    disabled: false,
  },
)

defineSlots<{
  default?: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined]
  'update:checked': [checked: boolean]
  change: [value: string | number | undefined]
}>()

const group = inject<RadioGroupContext | null>('yizRadioGroup', null)
const instance = getCurrentInstance()

const hasValueModel = computed(() => {
  const vnodeProps = instance?.vnode.props ?? {}
  return 'modelValue' in vnodeProps || 'onUpdate:modelValue' in vnodeProps
})

const checked = computed(() => {
  if (group) return group.modelValue.value === props.value
  if (hasValueModel.value) return props.modelValue === props.value
  return props.checked
})
const mergedDisabled = computed(() => props.disabled || (group?.disabled.value ?? false))
const mergedName = computed(() => props.name ?? group?.name.value)

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (checked.value) {
    c['yiz-radio-checked'] = true
  }
  if (mergedDisabled.value) {
    c['yiz-radio-disabled'] = true
  }
  return c
})

const isWave = ref(false)
const inputRef = ref<HTMLInputElement>()
let waveTimerId: ReturnType<typeof setTimeout>

function onChange() {
  if (mergedDisabled.value) return
  if (group) {
    if (props.value == null) return
    group.changeValue(props.value)
  } else if (hasValueModel.value) {
    emit('update:modelValue', props.value)
  } else {
    emit('update:checked', true)
  }
  emit('change', props.value)
  if (isWave.value) {
    clearTimeout(waveTimerId)
    isWave.value = false
  }
  nextTick(() => {
    isWave.value = true
    waveTimerId = setTimeout(() => {
      isWave.value = false
    }, 600)
  })
}

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<style lang="less">
.yiz-radio {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--yiz-font-size-default);
  color: var(--yiz-color-text-primary);
  user-select: none;
  vertical-align: middle;
  line-height: 1;

  &.yiz-radio-disabled {
    cursor: not-allowed;

    .yiz-radio-inner {
      background-color: var(--yiz-color-bg-muted);
      border-color: var(--yiz-color-border);
    }
    .yiz-radio-label {
      color: var(--yiz-color-text-disabled);
    }

    &.yiz-radio-checked .yiz-radio-inner {
      border-color: var(--yiz-color-primary-disabled);

      &::after {
        background-color: var(--yiz-color-primary-disabled);
      }
    }
  }
}

.yiz-radio-input {
  position: relative;
  display: inline-flex;
  width: 16px;
  height: 16px;
  flex-shrink: 0;

  input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 1;

    &:disabled {
      cursor: not-allowed;
    }
  }
}

.yiz-radio-inner {
  width: 16px;
  height: 16px;
  border: 1px solid var(--yiz-color-border);
  border-radius: 50%;
  background-color: var(--yiz-color-bg-container);
  transition: all var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--yiz-color-on-primary);
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46);
  }
}

.yiz-radio:not(.yiz-radio-disabled):hover .yiz-radio-inner {
  border-color: var(--yiz-color-primary);
}

.yiz-radio-checked {
  .yiz-radio-inner {
    background-color: var(--yiz-color-primary);
    border-color: var(--yiz-color-primary);

    &::after {
      transform: translate(-50%, -50%) scale(1);
    }
  }

  &:not(.yiz-radio-disabled):hover .yiz-radio-inner {
    background-color: var(--yiz-color-primary-hover);
    border-color: var(--yiz-color-primary-hover);
  }
}

.yiz-radio-label {
  margin-left: 8px;
}

.yiz-radio-input .yiz-wave {
  --yiz-color-wave: var(--yiz-color-primary);
  position: absolute;
  pointer-events: none;
  z-index: 0;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 50%;
  animation-duration: 0.6s;
  animation-name: yiz-wave-spread, yiz-wave-opacity;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1), cubic-bezier(0, 0, 0.2, 1);
}
</style>
