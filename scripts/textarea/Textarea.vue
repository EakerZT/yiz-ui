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
      :style="textareaStyle"
    />
    <div class="yiz-textarea-footer" v-if="props.showCount || props.clearable">
      <span v-if="props.showCount && props.maxlength" class="yiz-textarea-count">
        {{ String(modelValue ?? '').length }} / {{ props.maxlength }}
      </span>
      <div
        v-if="props.clearable && modelValue"
        class="yiz-textarea-clear"
        @click="onClearClick"
      >
        <svg viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 5.293l4.146-4.147a.5.5 0 01.708.708L6.707 6l4.147 4.146a.5.5 0 01-.708.708L6 6.707l-4.146 4.147a.5.5 0 01-.708-.708L5.293 6 1.146 1.854a.5.5 0 11.708-.708L6 5.293z" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    rows?: number
    maxlength?: number
    showCount?: boolean
    clearable?: boolean
    resize?: 'none' | 'both' | 'horizontal' | 'vertical'
  }>(),
  {
    rows: 3,
    clearable: false,
    showCount: false,
    resize: 'vertical'
  }
)

const modelValue = defineModel<string>('value')
const emit = defineEmits<{ pressEnter: [] }>()

const textareaRef = ref<HTMLTextAreaElement>()
const isFocus = ref(false)

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (isFocus.value) {
    c.focus = true
  }
  return c
})

const textareaStyle = computed(() => ({
  resize: props.resize
}))

const onClearClick = () => {
  modelValue.value = ''
}

function onInput(e: Event) {
  modelValue.value = (e.target as HTMLTextAreaElement).value
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    emit('pressEnter')
  }
}

defineExpose({
  focus: () => textareaRef.value?.focus()
})
</script>

<style lang="less">
.yiz-textarea {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  transition: border-color 0.3s, box-shadow 0.3s;
  font-family: inherit;
  font-size: 14px;
  background: var(--yiz-color-bg, #fff);
  padding: 4px 8px;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    border-color: var(--yiz-color-primary);
  }

  &.focus {
    border-color: var(--yiz-color-primary);
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }

  .yiz-form-item-error-status & {
    border-color: var(--yiz-color-error);

    &:hover {
      border-color: var(--yiz-color-error);
    }

    &.focus {
      border-color: var(--yiz-color-error);
      box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
    }
  }
}

.yiz-textarea-inner {
  display: block;
  width: 100%;
  border: 0;
  outline: none;
  font-size: 14px;
  font-family: inherit;
  line-height: 1.5;
  padding: 0;
  background: transparent;
  resize: vertical;
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
  color: #999;
  user-select: none;
}

.yiz-textarea-clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.25);
  transition: color 0.3s;
  flex-shrink: 0;

  &:hover {
    color: rgba(0, 0, 0, 0.45);
  }

  svg {
    width: 12px;
    height: 12px;
  }
}
</style>
