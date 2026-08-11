<template>
  <div class="yiz-input yiz-input-password" :class="vClass">
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
        :type="passwordVisible ? 'text' : 'password'"
        :autocomplete="props.autocomplete"
        class="yiz-input_inner"
        :placeholder="$props.placeholder"
        :disabled="props.disabled"
        @input="onInput"
        @focus="isFocus = true"
        @blur="isFocus = false"
        @keydown="onKeydown"
      />
    </div>
    <div class="yiz-input_clear" v-if="$props.clearable && modelValue && !props.disabled" @click="onClearClick">
      <Icon size="16" :icon="DismissCircle16Filled" />
    </div>
    <div class="yiz-input_suffix" v-if="$props.suffix || $slots.suffix">
      <template v-if="$props.suffix">
        {{ $props.suffix }}
      </template>
      <slot v-else name="suffix" />
    </div>
    <button
      v-if="props.showToggle"
      type="button"
      class="yiz-input-password_toggle"
      :aria-label="passwordVisible ? t('inputPassword.hidePassword') : t('inputPassword.showPassword')"
      :aria-pressed="passwordVisible"
      :disabled="props.disabled"
      @mousedown.prevent
      @click="onTogglePassword"
    >
      <Icon size="16" :icon="passwordVisible ? EyeOff16Regular : Eye16Regular" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { DismissCircle16Filled, Eye16Regular, EyeOff16Regular } from '@vicons/fluent'
import { Icon } from '../icon'
import { useInputStyle } from '../input-style'
import { useLocale } from '../locale'

const t = useLocale()

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
    showToggle?: boolean
    autocomplete?: string
    size?: 'small' | 'default' | 'large'
    styleMode?: 'outlined' | 'filled'
  }>(),
  {
    clearable: false,
    disabled: false,
    showToggle: true,
    autocomplete: 'current-password',
  },
)

const modelValue = defineModel<string>('value')
const emit = defineEmits<{ pressEnter: [] }>()

const inputRef = ref<HTMLInputElement>()
const isFocus = ref(false)
const passwordVisible = ref(false)
const { styleMode: mergedStyleMode, size: mergedSize } = useInputStyle(
  () => props.styleMode,
  () => props.size,
)

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  c[`yiz-input-${mergedStyleMode.value}`] = true
  if (isFocus.value) {
    c.focus = true
  }
  if (props.disabled) {
    c['yiz-input-disabled'] = true
  }
  if (mergedSize.value === 'small') {
    c['yiz-input-small'] = true
  }
  if (mergedSize.value === 'large') {
    c['yiz-input-large'] = true
  }
  return c
})

const onClearClick = () => {
  if (props.disabled) return
  modelValue.value = ''
}

function onTogglePassword() {
  if (props.disabled) return
  passwordVisible.value = !passwordVisible.value
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
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<style lang="less">
.yiz-input-password {
  .yiz-input_outer {
    display: flex;
    flex: 1;
    min-width: 0;

    .yiz-input_inner {
      flex: 1;
      min-width: 0;
    }
  }

  .yiz-input-password_toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    margin-left: var(--yiz-control-affix-gap-default);
    padding: 0;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--yiz-color-text-tertiary);
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: var(--yiz-color-text-primary);
    }

    &:disabled {
      color: var(--yiz-color-text-disabled);
      cursor: not-allowed;
    }
  }

  &.yiz-input-small .yiz-input-password_toggle {
    margin-left: var(--yiz-control-affix-gap-small);
  }

  &.yiz-input-large .yiz-input-password_toggle {
    margin-left: var(--yiz-control-affix-gap-large);
  }
}
</style>
