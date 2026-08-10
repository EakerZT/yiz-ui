<template>
  <label class="yiz-checkbox" :class="vClass">
    <span class="yiz-checkbox-input">
      <input ref="inputRef" type="checkbox" :checked="isChecked" :disabled="mergedDisabled" @change="onChange" />
      <span class="yiz-checkbox-inner"></span>
      <span class="yiz-wave" v-if="isWave"></span>
    </span>
    <span v-if="$slots.default" class="yiz-checkbox-label">
      <slot />
    </span>
  </label>
</template>

<script lang="ts" setup>
import { computed, inject, nextTick, ref, type Ref } from 'vue'
import { useInputSize } from '../input-style'

interface CheckboxGroupContext {
  modelValue: Ref<(string | number)[]>
  disabled: Ref<boolean>
  border: Ref<boolean>
  size: Ref<'small' | 'default' | 'large'>
  toggleValue: (val: string | number) => void
}

const props = withDefaults(
  defineProps<{
    value?: string | number
    disabled?: boolean
    border?: boolean
    size?: 'small' | 'default' | 'large'
  }>(),
  {
    disabled: false,
    border: false,
  },
)

defineSlots<{
  default?: any
}>()

const emit = defineEmits<{ change: [checked: boolean] }>()

const modelValue = defineModel<boolean>('checked')

const group = inject<CheckboxGroupContext | null>('yizCheckboxGroup', null)

const isChecked = computed(() => {
  if (group) {
    return group.modelValue.value.includes(props.value!)
  }
  return modelValue.value ?? false
})

const mergedDisabled = computed(() => {
  return (group?.disabled.value ?? false) || props.disabled
})
const mergedBorder = computed(() => props.border || (group?.border.value ?? false))
const standaloneSize = computed(() => props.size ?? group?.size.value ?? 'default')
const mergedSize = useInputSize(() => standaloneSize.value)

const vClass = computed(() => {
  const c: Record<string, boolean> = {
    [`yiz-checkbox-${mergedSize.value}`]: true,
  }
  if (isChecked.value) {
    c['yiz-checkbox-checked'] = true
  }
  if (mergedDisabled.value) {
    c['yiz-checkbox-disabled'] = true
  }
  if (mergedBorder.value) {
    c['yiz-checkbox-border'] = true
    c[`yiz-checkbox-border-${mergedSize.value}`] = true
  }
  return c
})

const isWave = ref(false)
const inputRef = ref<HTMLInputElement>()
let waveTimerId: ReturnType<typeof setTimeout>

function onChange(e: Event) {
  const checked = (e.target as HTMLInputElement).checked
  if (mergedDisabled.value) return

  if (group) {
    group.toggleValue(props.value!)
  } else {
    modelValue.value = checked
  }

  emit('change', isChecked.value)

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
.yiz-checkbox {
  --yiz-checkbox-border-height: var(--yiz-control-height-default);
  --yiz-checkbox-border-padding-x: 12px;
  --yiz-checkbox-border-radius: var(--yiz-base-border-radius-default);
  --yiz-checkbox-border-font-size: var(--yiz-font-size-default);

  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: var(--yiz-font-size-default);
  color: var(--yiz-color-text-primary);
  user-select: none;
  vertical-align: middle;
  line-height: 1;

  &.yiz-checkbox-disabled {
    cursor: not-allowed;

    .yiz-checkbox-inner {
      background-color: var(--yiz-color-bg-muted);
      border-color: #d9d9d9;
    }
    .yiz-checkbox-label {
      color: var(--yiz-color-text-disabled);
    }

    &.yiz-checkbox-checked .yiz-checkbox-inner {
      background-color: var(--yiz-color-primary-light5);
      border-color: var(--yiz-color-primary-light5);
    }
  }
}

.yiz-checkbox-border {
  height: var(--yiz-checkbox-border-height);
  padding: 0 var(--yiz-checkbox-border-padding-x);
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-checkbox-border-radius);
  box-sizing: border-box;
  font-size: var(--yiz-checkbox-border-font-size);
  background: var(--yiz-color-bg-container);
  transition:
    color 0.2s,
    border-color 0.2s,
    background-color 0.2s;

  &:not(.yiz-checkbox-disabled):hover {
    border-color: var(--yiz-color-primary);
  }

  &.yiz-checkbox-checked {
    border-color: var(--yiz-color-primary);
    color: var(--yiz-color-primary);
  }

  &.yiz-checkbox-disabled {
    background: var(--yiz-color-bg-muted);
    border-color: #d9d9d9;
  }
}

.yiz-checkbox-border-small {
  --yiz-checkbox-border-height: var(--yiz-control-height-small);
  --yiz-checkbox-border-padding-x: 8px;
  --yiz-checkbox-border-radius: var(--yiz-base-border-radius-small);
  --yiz-checkbox-border-font-size: var(--yiz-font-size-small);
}

.yiz-checkbox-border-large {
  --yiz-checkbox-border-height: var(--yiz-control-height-large);
  --yiz-checkbox-border-padding-x: 16px;
  --yiz-checkbox-border-radius: var(--yiz-base-border-radius-large);
  --yiz-checkbox-border-font-size: var(--yiz-font-size-large);
}

.yiz-checkbox-small {
  font-size: var(--yiz-font-size-small);
}

.yiz-checkbox-large {
  font-size: var(--yiz-font-size-large);
}

.yiz-checkbox-input {
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

.yiz-checkbox-inner {
  width: 16px;
  height: 16px;
  border: 1px solid var(--yiz-color-border);
  border-radius: 4px;
  background-color: var(--yiz-color-bg-container);
  transition: all var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard);
  position: relative;
  box-sizing: border-box;

  &::after {
    box-sizing: border-box;
    content: '';
    position: absolute;
    top: 50%;
    inset-inline-start: 21.5%;
    width: 5.7142857142857135px;
    height: 9.142857142857142px;
    border: 2px solid var(--yiz-color-text-inverse);
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg) scale(0) translate(-50%, -50%);
    transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.yiz-checkbox:not(.yiz-checkbox-disabled):hover .yiz-checkbox-inner {
  border-color: var(--yiz-color-primary);
}

.yiz-checkbox-checked {
  .yiz-checkbox-inner {
    background-color: var(--yiz-color-primary);
    border-color: var(--yiz-color-primary);

    &::after {
      transform: rotate(45deg) scale(1) translate(-50%, -50%);
    }
  }

  &:not(.yiz-checkbox-disabled):hover .yiz-checkbox-inner {
    background-color: var(--yiz-color-primary-light2);
    border-color: var(--yiz-color-primary-light2);
  }
}

.yiz-checkbox-label {
  margin-left: 8px;
}

.yiz-checkbox-input .yiz-wave {
  --yiz-color-wave: var(--yiz-color-primary);
  position: absolute;
  pointer-events: none;
  z-index: 0;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border-radius: 2px;
  animation-duration: 0.6s;
  animation-name: yiz-wave-spread, yiz-wave-opacity;
  animation-timing-function: cubic-bezier(0, 0, 0.2, 1), cubic-bezier(0, 0, 0.2, 1);
}
</style>
