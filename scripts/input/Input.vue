<template>
  <div class="yiz-input" :class="vClass">
    <div class="yiz-input_prefix" v-if="$props.prefix || $slots.prefix">
      <template v-if="$props.prefix">
        {{ $props.prefix }}
      </template>
      <slot v-else name="prefix" />
    </div>
    <div class="yiz-input_outer">
      <input
        ref="inputRef"
        :value="modelValue"
        @input="onInput"
        @focus="isFocus = true"
        @blur="isFocus = false"
        @keydown="onKeydown"
        class="yiz-input_inner"
        :placeholder="$props.placeholder"
        :disabled="props.disabled"
      />
    </div>
    <div class="yiz-input_clear" v-if="$props.clearable && modelValue && !props.disabled" @click="onClearClick">
      <Icon size="16" :icon="DismissCircle32Filled" />
    </div>
    <div class="yiz-input_suffix" v-if="$props.suffix || $slots.suffix">
      <template v-if="$props.suffix">
        {{ $props.suffix }}
      </template>
      <slot v-else name="suffix" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { DismissCircle32Filled } from '@vicons/fluent'
import { Icon } from '../icon'

defineSlots<{
  prefix: unknown
  suffix: unknown
}>()

const props = withDefaults(
  defineProps<{
    placeholder?: string
    prefix?: string
    suffix?: string
    clearable?: boolean
    disabled?: boolean
    size?: 'small' | 'default' | 'large'
  }>(),
  {
    clearable: false,
    disabled: false,
    size: 'default'
  }
)

const modelValue = defineModel('value')
const emit = defineEmits<{ pressEnter: [] }>()

const inputRef = ref<HTMLInputElement>()
const isFocus = ref(false)
const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (isFocus.value) {
    c.focus = true
  }
  if (props.disabled) {
    c['yiz-input-disabled'] = true
  }
  if (props.size === 'small') {
    c['yiz-input-small'] = true
  }
  if (props.size === 'large') {
    c['yiz-input-large'] = true
  }
  return c
})
const onClearClick = () => {
  if (props.disabled) return
  modelValue.value = ''
}

function onInput(e: Event) {
  if (props.disabled) return
  modelValue.value = (e.target as HTMLInputElement).value
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  if (e.key === 'Enter') {
    emit('pressEnter')
  }
}

defineExpose({
  focus: () => inputRef.value?.focus()
})
</script>

<style lang="less">
.yiz-input {
  box-sizing: border-box;
  border-radius: var(--yiz-base-border-radius-default);
  border: 1px solid var(--yiz-color-border);
  transition: 0.3s all;
  height: 32px;
  display: flex;
  align-items: center;
  padding: 0 4px;
  font-family: inherit;
  font-size: 14px;
  background: var(--yiz-color-bg);

  &:not(.yiz-input-disabled):hover {
    border: 1px solid var(--yiz-color-primary);
  }

  &.focus:not(.yiz-input-disabled) {
    border: 1px solid var(--yiz-color-primary);
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }

  &.yiz-input-disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    color: #c0c4cc;

    &:hover {
      border-color: var(--yiz-color-border);
    }
  }

  &.yiz-input-small {
    height: 24px;
    border-radius: var(--yiz-base-border-radius-small);
    font-size: 13px;

    .yiz-input_outer .yiz-input_inner {
      font-size: 13px;
    }
  }

  &.yiz-input-large {
    height: 40px;
    border-radius: var(--yiz-base-border-radius-large);
    font-size: 16px;

    .yiz-input_outer .yiz-input_inner {
      font-size: 16px;
    }
  }

  .yiz-form-item-error-status &:not(.yiz-input-disabled) {
    border-color: var(--yiz-color-error);

    &:hover {
      border-color: var(--yiz-color-error);
    }

    &.focus {
      border-color: var(--yiz-color-error);
      box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
    }
  }

  .yiz-input_prefix {
    display: inline-flex;
    align-items: center;
    margin-left: 4px;
    margin-right: 4px;
    user-select: none;
  }

  .yiz-input_clear {
    display: inline-flex;
    margin-left: 8px;
    margin-right: 4px;
    user-select: none;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.45);
    transition: 0.3s all;

    &:hover {
      color: rgba(0, 0, 0, 0.88);
    }
  }

  .yiz-input_suffix {
    display: inline-flex;
    align-items: center;
    margin-left: 8px;
    margin-right: 4px;
    user-select: none;
  }

  .yiz-input_outer {
    display: flex;
    flex: 1;
    height: 100%;
    min-width: 0;

    .yiz-input_inner {
      flex: 1;
      padding: 0 4px;
      height: 100%;
      line-height: normal;
      border: 0;
      outline: none;
      width: 100%;
      box-sizing: border-box;
      font-size: 14px;
      font-family: inherit;
      min-width: 0;

      &:disabled {
        cursor: not-allowed;
        color: #c0c4cc;
        background: transparent;
      }
    }
  }
}
</style>
