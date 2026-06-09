<template>
  <label class="yiz-checkbox" :class="vClass">
    <span class="yiz-checkbox-input">
      <input type="checkbox" :checked="modelValue" :disabled="disabled" @change="onChange" />
      <span class="yiz-checkbox-inner"></span>
      <span class="yiz-wave" v-if="isWave"></span>
    </span>
    <span v-if="label || $slots.default" class="yiz-checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
  }>(),
  {
    disabled: false
  }
)

defineSlots<{
  default?: any
}>()

const modelValue = defineModel<boolean>('value')

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (modelValue.value) {
    c['yiz-checkbox-checked'] = true
  }
  if (props.disabled) {
    c['yiz-checkbox-disabled'] = true
  }
  return c
})

const isWave = ref(false)
let waveTimerId: ReturnType<typeof setTimeout>

function onChange(e: Event) {
  if (props.disabled) return
  modelValue.value = (e.target as HTMLInputElement).checked
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
</script>

<style lang="less">
.yiz-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  user-select: none;
  vertical-align: middle;
  line-height: 1;

  &.yiz-checkbox-disabled {
    cursor: not-allowed;

    .yiz-checkbox-inner {
      background-color: #f5f5f5;
      border-color: #d9d9d9;
    }
    .yiz-checkbox-label {
      color: #c0c4cc;
    }

    &.yiz-checkbox-checked .yiz-checkbox-inner {
      background-color: var(--yiz-color-primary-light5);
      border-color: var(--yiz-color-primary-light5);
    }
  }
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
  background-color: #fff;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 5.7142857142857135px;
    height: 9.142857142857142px;
    inset-inline-start: 21%;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg) scale(1) translate(-50%, -50%);
    transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
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
