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
      />
    </div>
    <div class="yiz-input_clear" v-if="$props.clearable && modelValue" @click="onClearClick">
      <Icon size="14" :icon="DismissCircle32Filled" />
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
  }>(),
  {
    clearable: false
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
  return c
})
const onClearClick = () => {
  modelValue.value = ''
}

function onInput(e: Event) {
  modelValue.value = (e.target as HTMLInputElement).value
}

function onKeydown(e: KeyboardEvent) {
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
  border-radius: 4px;
  border: 1px solid var(--yiz-color-border);
  transition: 0.3s all;
  height: 32px;
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  font-family: inherit;
  font-size: 14px;
  background: var(--yiz-color-bg);

  &:hover {
    border: 1px solid var(--yiz-color-primary);
  }

  &.focus {
    border: 1px solid var(--yiz-color-primary);
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
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
    .yiz-input_inner {
      padding: 0 4px;
      height: 30px;
      line-height: 30px;
      border: 0;
      outline: none;
      width: 100%;
      box-sizing: border-box;
      font-size: 14px;
      font-family: inherit;
    }
  }
}
</style>
