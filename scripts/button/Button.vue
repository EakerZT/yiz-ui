<template>
  <button ref="buttonRef" class="yiz-button" :class="vClass" :style="vStyle" @click="onClick" :disabled="isDisabled">
    <component v-for="i in c" :key="i" :is="i" />
    <span v-if="props.loading" class="yiz-button-loading-icon" aria-hidden="true">
      <svg viewBox="0 0 50 50" width="16px" height="16px" class="yiz-button-loading-ring">
        <circle cx="25" cy="25" r="20" fill="none" />
      </svg>
    </span>
    <div v-if="isWave && hasWave" class="yiz-wave" />
  </button>
</template>

<script lang="ts" setup>
import { Comment, computed, Fragment, h, isVNode, nextTick, ref, Text, type VNode } from 'vue'
import { TinyColor } from '@ctrl/tinycolor'
import Icon from '../icon/Icon.vue'
import { useInputSize } from '../input-style'

export type ButtonType = 'outlined' | 'primary' | 'plain' | 'dash' | 'filled' | 'text'

const slots = defineSlots<{
  /**
   * 按钮内容。
   * @en Button content.
   */
  default?: () => any[]
}>()

function normalizeSlotNodes(nodes: any[]): VNode[] {
  const result: VNode[] = []
  for (const node of nodes) {
    if (!isVNode(node)) continue
    if (node.type === Comment) continue
    if (node.type === Fragment) {
      result.push(...normalizeSlotNodes(Array.isArray(node.children) ? node.children : []))
      continue
    }
    if (node.type === Text) {
      const text = String(node.children ?? '')
      if (text.trim()) result.push(h('span', {}, text))
      continue
    }
    result.push(node)
  }
  return result
}

const c = computed(() => normalizeSlotNodes(slots.default?.() ?? []))

const props = withDefaults(
  defineProps<{
    /**
     * 按钮视觉类型。
     * @en Visual style of the button.
     */
    type?: ButtonType
    /**
     * 预设语义色或自定义 HEX 颜色。
     * @en Preset semantic color or a custom HEX color.
     */
    color?: 'default' | 'success' | 'warning' | 'error' | string
    /**
     * 按钮形状。
     * @en Shape of the button.
     */
    shape?: 'default' | 'round' | 'circle'
    /**
     * 按钮尺寸。
     * @en Size of the button.
     */
    size?: 'small' | 'default' | 'large'
    /**
     * 是否禁用按钮。
     * @en Whether the button is disabled.
     */
    disabled?: boolean
    /**
     * 是否显示加载状态，加载时按钮不可点击。
     * @en Whether to show the loading state. The button cannot be clicked while loading.
     */
    loading?: boolean
  }>(),
  {
    type: 'outlined',
    color: 'default',
    shape: 'default',
    size: 'default',
    disabled: false,
    loading: false,
  },
)

const isDisabled = computed(() => props.disabled || props.loading)
const hasWave = computed(() => props.type !== 'filled' && props.type !== 'text')
const buttonRef = ref<HTMLButtonElement>()
const mergedSize = useInputSize(() => props.size)

const vClass = computed(() => {
  const classes: Record<string, boolean> = {
    [`yiz-button-type-${props.type}`]: true,
    [`yiz-button-shape-${props.shape}`]: true,
    [`yiz-button-size-${mergedSize.value}`]: true,
  }
  if (['success', 'default', 'warning', 'error'].includes(props.color)) {
    classes[`yiz-button-color-${props.color}`] = true
  }
  if (isDisabled.value) {
    classes['yiz-button-disabled'] = true
  }
  if (props.loading) {
    classes['yiz-button-loading'] = true
  }
  if (props.shape !== 'circle' && c.value.length === 1 && c.value[0]?.type === Icon) {
    classes['yiz-button-icon-only'] = true
  }
  return classes
})
const isWave = ref(false)
const vStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.color && props.color.match(/^#[\da-fA-F]{6}$/g)) {
    const color = new TinyColor(props.color)
    s['--yiz-button-color-text'] = 'var(--yiz-color-text-inverse)'
    s['--yiz-button-color-text2'] = 'var(--yiz-color-text-primary)'
    s['--yiz-button-color-disabled-text'] = color.tint(50).toString()
    s['--yiz-button-color-disabled-border'] = color.tint(80).toString()
    s['--yiz-button-color-disabled-bg'] = color.tint(90).toString()
    s['--yiz-button-color-bg'] = color.tint(90).toString()
    s['--yiz-button-color-primary'] = props.color
    s['--yiz-button-color-hover'] = color.tint(30).toString()
    s['--yiz-button-color-press'] = color.mix('#000000', 20).toString()
    s['--yiz-color-wave'] = props.color
  }
  return s
})
const emits = defineEmits<{
  /**
   * 点击可用按钮时触发。
   * @en Emitted when an enabled button is clicked.
   */
  click: [event: MouseEvent]
}>()
let waveTimerId: ReturnType<typeof setTimeout>
const onClick = (e: MouseEvent) => {
  if (isDisabled.value) {
    return
  }
  if (hasWave.value) {
    if (isWave.value) {
      clearTimeout(waveTimerId)
      isWave.value = false
    }
    nextTick(() => {
      isWave.value = true
      waveTimerId = setTimeout(() => {
        isWave.value = false
      }, 1000)
    })
  }
  emits('click', e)
}

defineExpose({
  /**
   * 聚焦按钮。
   * @en Focuses the button.
   */
  focus: () => buttonRef.value?.focus(),
  /**
   * 移除按钮焦点。
   * @en Removes focus from the button.
   */
  blur: () => buttonRef.value?.blur(),
})
</script>

<style lang="less">
.yiz-button {
  margin: 0;
  font-weight: var(--yiz-font-weight-regular);
  line-height: 1;
  font-family: inherit;
  height: var(--yiz-control-height-default);
  font-size: var(--yiz-font-size-default);
  white-space: nowrap;
  outline: none;
  position: relative;
  z-index: auto;
  display: inline-flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  user-select: none;
  text-align: center;
  cursor: pointer;
  text-decoration: none;
  transition:
    color var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard),
    background-color var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard),
    opacity var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard),
    border-color var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard),
    height var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard),
    width var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard),
    padding var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard),
    font-size var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard),
    border-radius var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard);
  border: 1px solid transparent;

  &.yiz-button-disabled {
    cursor: not-allowed;
  }

  &.yiz-button-loading > :not(.yiz-button-loading-icon):not(.yiz-wave) {
    opacity: 0;
  }

  & > .yiz-icon + span:not(.yiz-button-loading-icon) {
    margin-left: 4px;
  }

  & > span + .yiz-icon {
    margin-left: 4px;
  }

  & > .yiz-wave {
    position: absolute;
    pointer-events: none;
    z-index: 1;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    animation-duration: 0.6s;
    animation-name: yiz-wave-spread, yiz-wave-opacity;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1), cubic-bezier(0, 0, 0.2, 1);
  }
}

.yiz-button-loading-icon {
  position: absolute;
  inset: 0;
  margin: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: var(--yiz-button-color-primary);
  pointer-events: none;
}

.yiz-button-loading-ring {
  width: 16px;
  height: 16px;
  animation: yiz-button-loading-rotate 2s linear infinite;

  > circle {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: currentColor;
    stroke-linecap: round;
    transform-origin: 18px 18px;
    animation: yiz-button-loading-dash 1.5s ease-in-out infinite;
  }
}

@keyframes yiz-button-loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}

@keyframes yiz-button-loading-rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.yiz-button-shape-default {
  border-radius: var(--yiz-base-border-radius-default);
  padding: 0 var(--yiz-control-padding-x-default);

  & > .yiz-wave {
    border-radius: var(--yiz-base-border-radius-default);
  }
}

.yiz-button-shape-round {
  border-radius: 20px;
  padding: 8px 15px;

  & > .yiz-wave {
    border-radius: 20px;
  }
}

.yiz-button-shape-circle {
  width: 32px;
  border-radius: 50%;

  & > .yiz-wave {
    border-radius: 20px;
  }
}

.yiz-button-size-small {
  height: var(--yiz-control-height-small);
  font-size: var(--yiz-font-size-small);

  &.yiz-button-icon-only {
    width: 24px;
    padding: 0;
  }

  &.yiz-button-shape-default {
    border-radius: var(--yiz-base-border-radius-small);
    padding: 0 var(--yiz-control-padding-x-small);

    & > .yiz-wave {
      border-radius: var(--yiz-base-border-radius-small);
    }
  }

  &.yiz-button-shape-round {
    border-radius: 12px;
    padding: 0 12px;
  }

  &.yiz-button-shape-circle {
    width: 24px;
  }

  & > .yiz-icon {
    font-size: var(--yiz-icon-size-small);
  }
}

.yiz-button-size-default {
  height: var(--yiz-control-height-default);
  font-size: var(--yiz-font-size-default);

  &.yiz-button-icon-only {
    width: 32px;
    padding: 0;
  }

  &.yiz-button-shape-default {
    border-radius: var(--yiz-base-border-radius-default);
    padding: 0 var(--yiz-control-padding-x-default);

    & > .yiz-wave {
      border-radius: var(--yiz-base-border-radius-default);
    }
  }

  &.yiz-button-shape-round {
    border-radius: 16px;
    padding: 0 15px;
  }

  &.yiz-button-shape-circle {
    width: 32px;
  }

  & > .yiz-icon {
    font-size: var(--yiz-icon-size-default);
  }
}

.yiz-button-size-large {
  height: var(--yiz-control-height-large);
  font-size: var(--yiz-font-size-large);

  &.yiz-button-icon-only {
    width: 40px;
    padding: 0;
  }

  &.yiz-button-shape-default {
    border-radius: var(--yiz-base-border-radius-large);
    padding: 0 var(--yiz-control-padding-x-large);

    & > .yiz-wave {
      border-radius: var(--yiz-base-border-radius-large);
    }
  }

  &.yiz-button-shape-round {
    border-radius: 20px;
    padding: 0 20px;
  }

  &.yiz-button-shape-circle {
    width: 40px;
  }

  & > .yiz-icon {
    font-size: var(--yiz-icon-size-large);
  }
}

.yiz-button-size-small.yiz-button-icon-only {
  width: 24px;
  padding: 0;
}

.yiz-button-size-default.yiz-button-icon-only {
  width: 32px;
  padding: 0;
}

.yiz-button-size-large.yiz-button-icon-only {
  width: 40px;
  padding: 0;
}

.yiz-button-color-default {
  --yiz-button-color-text: var(--yiz-color-text-inverse);
  --yiz-button-color-text2: var(--yiz-color-text-primary);
  --yiz-button-color-disabled-text: var(--yiz-color-primary-light5);
  --yiz-button-color-disabled-border: var(--yiz-color-primary-light8);
  --yiz-button-color-disabled-bg: var(--yiz-color-primary-light9);
  --yiz-button-color-bg: var(--yiz-color-primary-light9);
  --yiz-button-color-primary: var(--yiz-color-primary);
  --yiz-button-color-hover: var(--yiz-color-primary-light2);
  --yiz-button-color-press: var(--yiz-color-primary-dark);
  --yiz-color-wave: var(--yiz-color-primary);
}

.yiz-button-color-success {
  --yiz-button-color-text: var(--yiz-color-text-inverse);
  --yiz-button-color-text2: var(--yiz-color-text-primary);
  --yiz-button-color-disabled-text: var(--yiz-color-success-light5);
  --yiz-button-color-disabled-border: var(--yiz-color-success-light8);
  --yiz-button-color-disabled-bg: var(--yiz-color-success-light9);
  --yiz-button-color-bg: var(--yiz-color-success-light9);
  --yiz-button-color-primary: var(--yiz-color-success);
  --yiz-button-color-hover: var(--yiz-color-success-light2);
  --yiz-button-color-press: var(--yiz-color-success-dark);
  --yiz-color-wave: var(--yiz-color-success);
}

.yiz-button-color-warning {
  --yiz-button-color-text: var(--yiz-color-text-inverse);
  --yiz-button-color-text2: var(--yiz-color-text-primary);
  --yiz-button-color-disabled-text: var(--yiz-color-warning-light5);
  --yiz-button-color-disabled-border: var(--yiz-color-warning-light8);
  --yiz-button-color-disabled-bg: var(--yiz-color-warning-light9);
  --yiz-button-color-bg: var(--yiz-color-warning-light9);
  --yiz-button-color-primary: var(--yiz-color-warning);
  --yiz-button-color-hover: var(--yiz-color-warning-light2);
  --yiz-button-color-press: var(--yiz-color-warning-dark);
  --yiz-color-wave: var(--yiz-color-warning);
}

.yiz-button-color-error {
  --yiz-button-color-text: var(--yiz-color-text-inverse);
  --yiz-button-color-text2: var(--yiz-color-text-primary);
  --yiz-button-color-disabled-text: var(--yiz-color-error-light5);
  --yiz-button-color-disabled-border: var(--yiz-color-error-light8);
  --yiz-button-color-disabled-bg: var(--yiz-color-error-light9);
  --yiz-button-color-bg: var(--yiz-color-error-light9);
  --yiz-button-color-primary: var(--yiz-color-error);
  --yiz-button-color-hover: var(--yiz-color-error-light2);
  --yiz-button-color-press: var(--yiz-color-error-dark);
  --yiz-color-wave: var(--yiz-color-error);
}

.yiz-button-type-outlined,
.yiz-button-type-dash {
  &.yiz-button-disabled {
    background-color: var(--yiz-color-bg-container);
    border-color: #e4e7ed;
    color: #a8abb2;
  }

  background-color: #00000000;
  border-color: #d9d9d9;
  color: var(--yiz-button-color-text2);

  &:not(.yiz-button-disabled):hover {
    color: var(--yiz-button-color-hover);
    border-color: var(--yiz-button-color-hover);
  }

  &:not(.yiz-button-disabled):active {
    color: var(--yiz-button-color-press);
    border-color: var(--yiz-button-color-press);
  }
}

.yiz-button-type-dash {
  border-style: dashed;
}

.yiz-button-type-primary {
  &.yiz-button-disabled {
    background-color: var(--yiz-button-color-disabled-text);
    border-color: var(--yiz-button-color-disabled-text);
    color: var(--yiz-color-text-inverse);
  }

  background-color: var(--yiz-button-color-primary);
  border-color: var(--yiz-button-color-primary);
  color: var(--yiz-button-color-text);

  &:not(.yiz-button-disabled):hover {
    background-color: var(--yiz-button-color-hover);
    border-color: var(--yiz-button-color-hover);
  }

  &:not(.yiz-button-disabled):active {
    background-color: var(--yiz-button-color-press);
    border-color: var(--yiz-button-color-press);
  }
}

.yiz-button-type-plain,
.yiz-button-type-filled {
  &.yiz-button-disabled {
    background-color: var(--yiz-button-color-disabled-bg);
    border-color: var(--yiz-button-color-disabled-border);
    //box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
    color: var(--yiz-button-color-disabled-text);
  }

  background-color: var(--yiz-button-color-bg);
  border-color: var(--yiz-button-color-primary);
  //box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
  color: var(--yiz-button-color-primary);

  &:not(.yiz-button-disabled):hover {
    background-color: var(--yiz-button-color-hover);
    border-color: var(--yiz-button-color-hover);
    color: var(--yiz-color-text-inverse);
  }

  &:not(.yiz-button-disabled):active {
    background-color: var(--yiz-button-color-press);
    border-color: var(--yiz-button-color-press);
    color: var(--yiz-color-text-inverse);
  }
}

.yiz-button-type-filled {
  &.yiz-button-disabled,
  &:not(.yiz-button-disabled):hover,
  &:not(.yiz-button-disabled):active {
    border-color: transparent;
  }

  border-color: transparent;
}

.yiz-button-type-text {
  &.yiz-button-disabled {
    background-color: var(--yiz-button-color-disabled-bg);
    border-color: transparent;
    color: var(--yiz-button-color-disabled-text);
  }

  background-color: transparent;
  border-color: transparent;
  color: var(--yiz-button-color-primary);

  &:not(.yiz-button-disabled):hover {
    background-color: var(--yiz-button-color-bg);
    border-color: transparent;
    color: var(--yiz-button-color-primary);
  }

  &:not(.yiz-button-disabled):active {
    background-color: var(--yiz-button-color-press);
    border-color: transparent;
    color: var(--yiz-color-text-inverse);
  }
}
</style>
