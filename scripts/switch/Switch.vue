<template>
  <label class="yiz-switch" :class="vClass" :style="vStyle">
    <span class="yiz-switch-input">
      <input ref="inputRef" type="checkbox" :checked="isChecked" :disabled="disabled || loading" @change="onChange" />
    </span>
    <span class="yiz-switch-track">
      <span class="yiz-wave" v-if="isWave" />
      <span class="yiz-switch-thumb">
        <svg v-if="loading" class="yiz-switch-loading" viewBox="0 0 24 24" width="12" height="12">
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-dasharray="31.4 31.4"
            stroke-linecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 12 12"
              to="360 12 12"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </span>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'
import { deriveColorRoles, useTheme, useThemeSize } from '../theme'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    size?: 'small' | 'default' | 'large'
    color?: string
    loading?: boolean
    checkedValue?: any
    uncheckedValue?: any
  }>(),
  {
    disabled: false,
    loading: false,
    checkedValue: true,
    uncheckedValue: false,
  },
)

const emit = defineEmits<{
  change: [value: any]
}>()

const modelValue = defineModel<any>('value')
const isChecked = computed(() => Object.is(modelValue.value, props.checkedValue))
const { theme } = useTheme()
const mergedSize = useThemeSize(() => props.size)

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (isChecked.value) c['yiz-switch-checked'] = true
  if (props.disabled) c['yiz-switch-disabled'] = true
  if (mergedSize.value === 'small') c['yiz-switch-small'] = true
  if (mergedSize.value === 'large') c['yiz-switch-large'] = true
  if (props.loading) c['yiz-switch-loading-state'] = true
  return c
})

const vStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.color && props.color.match(/^#[\da-fA-F]{6}$/g)) {
    const color = deriveColorRoles(props.color, theme.value)
    s['--yiz-switch-checked-bg'] = props.color
    s['--yiz-switch-checked-hover'] = color.hover
    s['--yiz-color-wave'] = props.color
  } else {
    s['--yiz-color-wave'] = 'var(--yiz-color-primary)'
  }
  return s
})

const isWave = ref(false)
const inputRef = ref<HTMLInputElement>()
let waveTimerId: ReturnType<typeof setTimeout>

function onChange(e: Event) {
  if (props.disabled || props.loading) return
  const checked = (e.target as HTMLInputElement).checked
  const value = checked ? props.checkedValue : props.uncheckedValue
  modelValue.value = value
  emit('change', value)
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
.yiz-switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  line-height: 1;
}

.yiz-switch-input {
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;

  input {
    position: absolute;
    width: 0;
    height: 0;
  }
}

.yiz-switch-track {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 44px;
  height: 22px;
  border-radius: 11px;
  background: var(--yiz-color-text-disabled);
  transition: background var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
  box-sizing: border-box;

  .yiz-wave {
    position: absolute;
    pointer-events: none;
    z-index: 0;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 11px;
    animation-duration: 0.6s;
    animation-name: yiz-wave-spread, yiz-wave-opacity;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1), cubic-bezier(0, 0, 0.2, 1);
  }
}

.yiz-switch-thumb {
  position: absolute;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--yiz-color-bg-container);
  transition:
    transform var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard),
    box-shadow 0.3s;
  box-shadow: var(--yiz-shadow-thumb);
  display: flex;
  align-items: center;
  justify-content: center;
}

// checked
.yiz-switch-checked {
  .yiz-switch-track {
    background: var(--yiz-switch-checked-bg, var(--yiz-color-primary));
  }

  .yiz-switch-thumb {
    transform: translateX(22px);
  }
}

// hover
.yiz-switch:not(.yiz-switch-disabled):not(.yiz-switch-loading-state) {
  &:hover .yiz-switch-track {
    opacity: 0.9;
  }

  &.yiz-switch-checked:hover .yiz-switch-track {
    background: var(--yiz-switch-checked-hover, var(--yiz-color-primary-hover));
  }

  &:active .yiz-switch-thumb {
    transform: scale(1.1);
  }

  &.yiz-switch-checked:active .yiz-switch-thumb {
    transform: translateX(22px) scale(1.1);
  }
}

// disabled
.yiz-switch-disabled {
  cursor: not-allowed;

  .yiz-switch-track {
    opacity: 0.5;
    background: var(--yiz-color-text-disabled);
  }

  &.yiz-switch-checked .yiz-switch-track {
    background: var(--yiz-switch-checked-bg, var(--yiz-color-primary-disabled));
  }
}

// loading
.yiz-switch-loading-state {
  cursor: wait;

  .yiz-switch-track {
    opacity: 0.8;
  }
}

.yiz-switch-loading {
  color: var(--yiz-switch-checked-bg, var(--yiz-color-primary));
  animation: yiz-switch-spin 0.8s linear infinite;
}

@keyframes yiz-switch-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// small
.yiz-switch-small {
  .yiz-switch-track {
    width: 32px;
    height: 16px;
    border-radius: 8px;
  }

  .yiz-switch-thumb {
    width: 12px;
    height: 12px;
  }

  &.yiz-switch-checked .yiz-switch-thumb {
    transform: translateX(16px);
  }

  &:active .yiz-switch-thumb {
    transform: scale(1.1);
  }

  &.yiz-switch-checked:active .yiz-switch-thumb {
    transform: translateX(16px) scale(1.1);
  }
}

.yiz-switch-large {
  .yiz-switch-track {
    width: 56px;
    height: 28px;
    border-radius: 14px;
  }

  .yiz-switch-thumb {
    width: 24px;
    height: 24px;
  }

  &.yiz-switch-checked .yiz-switch-thumb {
    transform: translateX(28px);
  }

  &:active .yiz-switch-thumb {
    transform: scale(1.1);
  }

  &.yiz-switch-checked:active .yiz-switch-thumb {
    transform: translateX(28px) scale(1.1);
  }
}
</style>
