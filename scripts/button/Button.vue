<template>
  <button class="yiz-button" :class="vClass" :style="vStyle" @click="onClick" :disabled="$props.disabled">
    <component v-for="i in c" :key="i" :is="i" />
    <div class="yiz-wave" v-if="isWave" />
  </button>
</template>

<script lang="ts" setup>
import { computed, h, isVNode, nextTick, ref, Text } from 'vue'
import { TinyColor } from '@ctrl/tinycolor'

const slots = defineSlots<{
  default?: () => any[]
}>()

const c = computed(() =>
  (slots.default?.() ?? []).map((s: any) => {
    if (isVNode(s) && s.type === Text) {
      return h('span', {}, s.children as string)
    } else {
      return s
    }
  })
)

const props = withDefaults(
  defineProps<{
    type?: 'default' | 'primary'
    color?: 'default' | 'success' | 'warning' | 'error' | string
    shape?: 'default' | 'round' | 'circle'
    disabled?: boolean
  }>(),
  {
    type: 'default',
    color: 'default',
    shape: 'default',
    disabled: false
  }
)
const vClass = computed(() => {
  const c: Record<string, boolean> = {
    [`yiz-button-type-${props.type}`]: true,
    [`yiz-button-shape-${props.shape}`]: true
  }
  if (['success', 'default', 'warning', 'error'].includes(props.color)) {
    c[`yiz-button-color-${props.color}`] = true
  }
  if (props.disabled) {
    c['yiz-button-disabled'] = true
  }
  return c
})
const isWave = ref(false)
const vStyle = computed(() => {
  const s: Record<string, string> = {}
  if (props.color && props.color.match(/^#[\da-fA-F]{6}$/g)) {
    const color = new TinyColor(props.color)
    s['--yiz-button-color-text'] = 'white'
    s['--yiz-button-color-text2'] = 'black'
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
const emits = defineEmits(['click'])
let waveTimerId: ReturnType<typeof setTimeout>
const onClick = (e: MouseEvent) => {
  if (props.disabled) {
    return
  }
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
  emits('click', e)
}
</script>

<style lang="less">
.yiz-button {
  margin: 0;
  font-weight: 400;
  line-height: 1;
  font-family: inherit;
  height: 34px;
  font-size: 14px;
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
    color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;

  &.yiz-button-disabled {
    cursor: not-allowed;
  }

  & > .yiz-icon + span {
    margin-left: 4px;
  }

  & > span + .yiz-icon {
    margin-left: 4px;
  }

  & > .yiz-wave {
    position: absolute;
    pointer-events: none;
    z-index: 9999;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    animation-duration: 0.6s;
    animation-name: yiz-wave-spread, yiz-wave-opacity;
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1), cubic-bezier(0, 0, 0.2, 1);
  }
}

.yiz-button-shape-default {
  border-radius: 3px;
  padding: 0 14px;

  & > .yiz-wave {
    border-radius: 3px;
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
  width: 34px;
  border-radius: 50%;

  & > .yiz-wave {
    border-radius: 20px;
  }
}

.yiz-button-color-default {
  --yiz-button-color-text: white;
  --yiz-button-color-text2: black;
  --yiz-button-color-disabled-text: var(--yiz-color-primary-light5);
  --yiz-button-color-disabled-border: var(--yiz-color-primary-light8);
  --yiz-button-color-disabled-bg: var(--yiz-color-primary-light9);
  --yiz-button-color-bg: var(--yiz-color-primary-light9);
  --yiz-button-color-primary: var(--yiz-color-primary);
  --yiz-button-color-hover: var(--yiz-color-primary-light2);
  --yiz-button-color-press: var(--yiz-color-primary-heary);
  --yiz-color-wave: var(--yiz-color-primary);
}

.yiz-button-color-success {
  --yiz-button-color-text: white;
  --yiz-button-color-text2: black;
  --yiz-button-color-disabled-text: var(--yiz-color-success-light5);
  --yiz-button-color-disabled-border: var(--yiz-color-success-light8);
  --yiz-button-color-disabled-bg: var(--yiz-color-success-light9);
  --yiz-button-color-bg: var(--yiz-color-success-light9);
  --yiz-button-color-primary: var(--yiz-color-success);
  --yiz-button-color-hover: var(--yiz-color-success-light2);
  --yiz-button-color-press: var(--yiz-color-success-heary);
  --yiz-color-wave: var(--yiz-color-success);
}

.yiz-button-color-warning {
  --yiz-button-color-text: white;
  --yiz-button-color-text2: black;
  --yiz-button-color-disabled-text: var(--yiz-color-warning-light5);
  --yiz-button-color-disabled-border: var(--yiz-color-warning-light8);
  --yiz-button-color-disabled-bg: var(--yiz-color-warning-light9);
  --yiz-button-color-bg: var(--yiz-color-warning-light9);
  --yiz-button-color-primary: var(--yiz-color-warning);
  --yiz-button-color-hover: var(--yiz-color-warning-light2);
  --yiz-button-color-press: var(--yiz-color-warning-heary);
  --yiz-color-wave: var(--yiz-color-warning);
}

.yiz-button-color-error {
  --yiz-button-color-text: white;
  --yiz-button-color-text2: black;
  --yiz-button-color-disabled-text: var(--yiz-color-error-light5);
  --yiz-button-color-disabled-border: var(--yiz-color-error-light8);
  --yiz-button-color-disabled-bg: var(--yiz-color-error-light9);
  --yiz-button-color-bg: var(--yiz-color-error-light9);
  --yiz-button-color-primary: var(--yiz-color-error);
  --yiz-button-color-hover: var(--yiz-color-error-light2);
  --yiz-button-color-press: var(--yiz-color-error-heary);
  --yiz-color-wave: var(--yiz-color-error);
}

.yiz-button-type-default {
  &.yiz-button-disabled {
    background-color: #fff;
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

.yiz-button-type-primary {
  &.yiz-button-disabled {
    background-color: var(--yiz-button-color-disabled-text);
    border-color: var(--yiz-button-color-disabled-text);
    color: white;
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

.yiz-button-type-plain {
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
    color: white;
  }

  &:not(.yiz-button-disabled):active {
    background-color: var(--yiz-button-color-press);
    border-color: var(--yiz-button-color-press);
    color: white;
  }
}
</style>
