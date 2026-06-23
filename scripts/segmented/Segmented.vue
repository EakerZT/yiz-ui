<template>
  <div ref="segmentedRef" class="yiz-segmented" :class="vClass" role="radiogroup">
    <div class="yiz-segmented-indicator" :class="indicatorClass" :style="indicatorStyle" />
    <label
      v-for="option in options"
      :key="option.value"
      :ref="(el) => setItemRef(el, option.value)"
      class="yiz-segmented-item"
      :class="getItemClass(option)"
    >
      <input
        class="yiz-segmented-input"
        type="radio"
        :name="groupName"
        :checked="modelValue === option.value"
        :disabled="disabled || option.disabled"
        :value="option.value"
        @change="changeValue(option)"
      />
      <span class="yiz-segmented-content">{{ option.label }}</span>
    </label>
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'

export interface SegmentedOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    options?: SegmentedOption[]
    disabled?: boolean
    size?: 'small' | 'default' | 'large'
    shape?: 'block' | 'round'
    block?: boolean
    name?: string
  }>(),
  {
    options: () => [],
    disabled: false,
    size: 'default',
    shape: 'block',
    block: false,
    name: ''
  }
)

const emit = defineEmits<{ change: [value: string | number] }>()
const modelValue = defineModel<string | number>('value')
const instance = getCurrentInstance()
const segmentedRef = ref<HTMLElement>()
const itemElements = new Map<string, HTMLElement>()
const indicatorStyle = ref<Record<string, string>>({ opacity: '0' })

let resizeObserver: ResizeObserver | null = null

const groupName = computed(() => props.name || `yiz-segmented-${instance?.uid ?? 'default'}`)
const selectedOption = computed(() => props.options.find((option) => option.value === modelValue.value))

const vClass = computed(() => ({
  'yiz-segmented-disabled': props.disabled,
  'yiz-segmented-block': props.block,
  [`yiz-segmented-shape-${props.shape}`]: true,
  [`yiz-segmented-${props.size}`]: true
}))

const indicatorClass = computed(() => ({
  'yiz-segmented-indicator-disabled': props.disabled || selectedOption.value?.disabled
}))

watch(
  () => [modelValue.value, props.options, props.size, props.shape, props.block],
  () => {
    nextTick(() => {
      updateIndicator()
      observeSize()
    })
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    updateIndicator()
    observeSize()
  })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

function getItemClass(option: SegmentedOption) {
  return {
    'yiz-segmented-item-selected': modelValue.value === option.value,
    'yiz-segmented-item-disabled': props.disabled || option.disabled
  }
}

function setItemRef(el: Element | ComponentPublicInstance | null, value: string | number) {
  const key = String(value)
  if (el instanceof HTMLElement) {
    itemElements.set(key, el)
  } else {
    itemElements.delete(key)
  }
}

function changeValue(option: SegmentedOption) {
  if (props.disabled || option.disabled) return
  if (modelValue.value === option.value) return
  modelValue.value = option.value
  emit('change', option.value)
}

function updateIndicator() {
  if (modelValue.value == null) {
    setIndicatorStyle({ opacity: '0' })
    return
  }
  const currentItem = itemElements.get(String(modelValue.value))
  if (!currentItem) {
    setIndicatorStyle({ opacity: '0' })
    return
  }
  setIndicatorStyle({
    width: `${currentItem.offsetWidth}px`,
    transform: `translateX(${currentItem.offsetLeft}px)`,
    opacity: '1'
  })
}

function observeSize() {
  if (typeof ResizeObserver === 'undefined' || !segmentedRef.value) return
  resizeObserver?.disconnect()
  resizeObserver = new ResizeObserver(updateIndicator)
  resizeObserver.observe(segmentedRef.value)
  itemElements.forEach((item) => resizeObserver?.observe(item))
}

function setIndicatorStyle(style: Record<string, string>) {
  const oldStyle = indicatorStyle.value
  const keys = Object.keys(style)
  const oldKeys = Object.keys(oldStyle)
  if (keys.length === oldKeys.length && keys.every((key) => oldStyle[key] === style[key])) return
  indicatorStyle.value = style
}
</script>

<style lang="less">
.yiz-segmented {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  vertical-align: middle;
  background: #f5f5f5;
  border-radius: 4px;
  color: #333;
}

.yiz-segmented-indicator {
  position: absolute;
  top: 2px;
  bottom: 2px;
  left: 0;
  z-index: 0;
  border-radius: 3px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  pointer-events: none;
  transition:
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-segmented-indicator-disabled {
  background: #fafafa;
  box-shadow: none;
}

.yiz-segmented-block {
  display: flex;
  width: 100%;

  .yiz-segmented-item {
    flex: 1;
    min-width: 0;
  }
}

.yiz-segmented-disabled {
  cursor: not-allowed;
}

.yiz-segmented-item {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 68px;
  height: 30px;
  padding: 0 12px;
  border-radius: 3px;
  color: #333;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  transition:
    color 0.2s,
    background-color 0.2s;
}

.yiz-segmented-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.yiz-segmented-content {
  position: relative;
  z-index: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yiz-segmented-item:not(.yiz-segmented-item-selected):not(.yiz-segmented-item-disabled):hover {
  background: var(--yiz-color-hover-bg);
}

.yiz-segmented-item-selected {
  color: var(--yiz-color-primary);
}

.yiz-segmented-item-disabled {
  cursor: not-allowed;
  color: #bfbfbf;
}

.yiz-segmented-item-disabled .yiz-segmented-input {
  cursor: not-allowed;
}

.yiz-segmented-item-disabled.yiz-segmented-item-selected {
  color: var(--yiz-color-primary-light5);
}

.yiz-segmented-small {
  .yiz-segmented-item {
    min-width: 56px;
    height: 24px;
    padding: 0 8px;
    font-size: 13px;
  }
}

.yiz-segmented-large {
  .yiz-segmented-item {
    min-width: 80px;
    height: 36px;
    padding: 0 16px;
    font-size: 15px;
  }
}

.yiz-segmented-shape-round {
  border-radius: 20px;

  .yiz-segmented-indicator,
  .yiz-segmented-item {
    border-radius: 20px;
  }

  .yiz-segmented-item {
    padding: 0 15px;
  }

  &.yiz-segmented-small {
    border-radius: 14px;

    .yiz-segmented-indicator,
    .yiz-segmented-item {
      border-radius: 14px;
    }

    .yiz-segmented-item {
      padding: 0 12px;
    }
  }

  &.yiz-segmented-large {
    .yiz-segmented-item {
      padding: 0 20px;
    }
  }
}
</style>
