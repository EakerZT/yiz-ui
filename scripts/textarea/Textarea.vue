<template>
  <div class="yiz-textarea" :class="vClass">
    <textarea
      ref="textareaRef"
      :value="modelValue"
      @input="onInput"
      @focus="isFocus = true"
      @blur="isFocus = false"
      @keydown="onKeydown"
      class="yiz-textarea-inner"
      :placeholder="props.placeholder"
      :rows="props.rows"
      :maxlength="props.maxlength"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :style="textareaStyle"
    />
    <div class="yiz-textarea-footer" v-if="props.showCount || (props.clearable && !props.disabled && !props.readonly)">
      <span v-if="props.showCount && props.maxlength" class="yiz-textarea-count">
        {{ String(modelValue ?? '').length }} / {{ props.maxlength }}
      </span>
      <div
        v-if="props.clearable && modelValue && !props.disabled && !props.readonly"
        class="yiz-textarea-clear"
        @click="onClearClick"
      >
        <Icon size="16" :icon="DismissCircle16Filled" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { DismissCircle16Filled } from '@vicons/fluent'
import { Icon } from '../icon'
import { useInputStyleMode } from '../input-style'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    rows?: number
    maxlength?: number
    showCount?: boolean
    clearable?: boolean
    disabled?: boolean
    readonly?: boolean
    resize?: 'none' | 'both' | 'horizontal' | 'vertical'
    styleMode?: 'outlined' | 'filled'
  }>(),
  {
    rows: 3,
    clearable: false,
    showCount: false,
    disabled: false,
    readonly: false,
    resize: 'vertical',
    styleMode: 'outlined',
  },
)

const modelValue = defineModel<string>('value')
const emit = defineEmits<{ pressEnter: [] }>()

const textareaRef = ref<HTMLTextAreaElement>()
const isFocus = ref(false)
const mergedStyleMode = useInputStyleMode(() => props.styleMode)

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  c[`yiz-textarea-${mergedStyleMode.value}`] = true
  if (isFocus.value) {
    c.focus = true
  }
  if (props.disabled) {
    c['yiz-textarea-disabled'] = true
  }
  if (props.readonly) {
    c['yiz-textarea-readonly'] = true
  }
  return c
})

const textareaStyle = computed(() => ({
  resize: props.disabled ? 'none' : props.resize,
}))

const onClearClick = () => {
  if (props.disabled || props.readonly) return
  modelValue.value = ''
}

function onInput(e: Event) {
  if (props.disabled || props.readonly) return
  modelValue.value = (e.target as HTMLTextAreaElement).value
}

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  if (e.key === 'Enter' && !e.shiftKey) {
    emit('pressEnter')
  }
}

defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
})
</script>

<style lang="less">
.yiz-textarea {
  display: inline-block;
  border-radius: var(--yiz-base-border-radius-default);
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  font-family: inherit;
  font-size: var(--yiz-font-size-default);
  background: var(--yiz-color-bg-container);
  padding: 4px 8px;
  width: 100%;
  box-sizing: border-box;

  &:not(.yiz-textarea-disabled):hover {
    border-color: var(--yiz-color-primary);
  }

  &.focus:not(.yiz-textarea-disabled) {
    border-color: var(--yiz-color-primary);
    box-shadow: var(--yiz-control-focus-shadow);
  }

  &.yiz-textarea-disabled {
    background: var(--yiz-color-bg-muted);
    color: var(--yiz-color-text-disabled);
    cursor: not-allowed;
  }

  &.yiz-textarea-readonly .yiz-textarea-inner {
    cursor: default;
  }

  .yiz-form-item-error-status &:not(.yiz-textarea-disabled) {
    border-color: var(--yiz-color-error);

    &:hover {
      border-color: var(--yiz-color-error);
    }

    &.focus {
      border-color: var(--yiz-color-error);
      box-shadow: var(--yiz-control-error-focus-shadow);
    }
  }
}

.yiz-textarea-inner {
  display: block;
  width: 100%;
  border: 0;
  outline: none;
  font-size: var(--yiz-font-size-default);
  font-family: inherit;
  line-height: 1.5;
  padding: 0;
  background: transparent;
  resize: vertical;

  &:disabled {
    color: var(--yiz-color-text-disabled);
    cursor: not-allowed;
  }
}

.yiz-textarea-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
}

.yiz-textarea-count {
  font-size: 12px;
  color: var(--yiz-color-text-tertiary);
  user-select: none;
}

.yiz-textarea-clear {
  display: inline-flex;
  align-items: center;
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
</style>
