<template>
  <div ref="sliderRef" class="yiz-slider" :class="vClass" @pointerdown="onTrackPointerDown">
    <div class="yiz-slider-track">
      <div class="yiz-slider-rail" />
      <div class="yiz-slider-fill" :style="fillStyle" />

      <span
        v-for="stop in stops"
        :key="stop"
        class="yiz-slider-stop"
        :class="{ 'yiz-slider-stop-active': isStopActive(stop) }"
        :style="{ left: `${stop}%` }"
      />

      <div
        v-for="(handle, index) in handles"
        :key="index"
        class="yiz-slider-handle-wrap"
        :class="{ 'yiz-slider-handle-wrap-active': activeHandle === index }"
        :style="{ left: `${handle.percent}%` }"
      >
        <div v-if="showTooltip" class="yiz-slider-tooltip">{{ getTooltip(handle.value) }}</div>
        <button
          type="button"
          class="yiz-slider-handle"
          role="slider"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="handle.value"
          :aria-disabled="disabled"
          :disabled="disabled"
          @pointerdown.stop="onHandlePointerDown($event, index)"
          @keydown="onHandleKeydown($event, index)"
        />
      </div>

      <div v-if="marks.length" class="yiz-slider-marks">
        <button
          v-for="mark in normalizedMarks"
          :key="mark.value"
          type="button"
          class="yiz-slider-mark"
          :class="{ 'yiz-slider-mark-active': isMarkActive(mark.value) }"
          :style="{ left: `${mark.percent}%` }"
          :disabled="disabled"
          @click.stop="onMarkClick(mark.value)"
        >
          {{ mark.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref } from 'vue'

export interface SliderMark {
  value: number
  label: string
}

export type SliderValue = number | [number, number]

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    range?: boolean
    disabled?: boolean
    showTooltip?: boolean
    showStops?: boolean
    marks?: SliderMark[]
    formatTooltip?: (value: number) => string
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    range: false,
    disabled: false,
    showTooltip: true,
    showStops: false,
    marks: () => [],
  },
)

const emit = defineEmits<{
  change: [value: SliderValue]
}>()

const modelValue = defineModel<SliderValue>('value')

const sliderRef = ref<HTMLElement>()
const activeHandle = ref<number | null>(null)

const mergedMin = computed(() => Math.min(props.min, props.max))
const mergedMax = computed(() => Math.max(props.min, props.max))
const mergedStep = computed(() => (props.step > 0 ? props.step : 1))
const valueRange = computed(() => mergedMax.value - mergedMin.value)

const normalizedValue = computed<[number, number]>(() => {
  if (props.range) {
    const value = Array.isArray(modelValue.value) ? modelValue.value : [mergedMin.value, mergedMin.value]
    const start = normalizeValue(value[0])
    const end = normalizeValue(value[1])
    return start <= end ? [start, end] : [end, start]
  }
  const value = typeof modelValue.value === 'number' ? modelValue.value : mergedMin.value
  return [mergedMin.value, normalizeValue(value)]
})

const handles = computed(() => {
  if (props.range) {
    return normalizedValue.value.map((value) => ({ value, percent: getPercent(value) }))
  }
  const value = normalizedValue.value[1]
  return [{ value, percent: getPercent(value) }]
})

const fillStyle = computed(() => {
  const start = props.range ? getPercent(normalizedValue.value[0]) : 0
  const end = getPercent(normalizedValue.value[1])
  return {
    left: `${start}%`,
    width: `${Math.max(end - start, 0)}%`,
  }
})

const stops = computed(() => {
  if (!props.showStops || valueRange.value <= 0) return []
  const result: number[] = []
  const count = Math.floor(valueRange.value / mergedStep.value)
  for (let i = 1; i < count; i++) {
    result.push((i / count) * 100)
  }
  return result
})

const normalizedMarks = computed(() =>
  props.marks
    .map((mark) => ({
      value: normalizeValue(mark.value),
      label: mark.label,
      percent: getPercent(mark.value),
    }))
    .filter((mark) => mark.percent >= 0 && mark.percent <= 100),
)

const vClass = computed(() => ({
  'yiz-slider-range': props.range,
  'yiz-slider-disabled': props.disabled,
  'yiz-slider-with-marks': props.marks.length > 0,
}))

function normalizeValue(value: number) {
  const clamped = Math.min(Math.max(value, mergedMin.value), mergedMax.value)
  const stepped = mergedMin.value + Math.round((clamped - mergedMin.value) / mergedStep.value) * mergedStep.value
  const precision = getPrecision(mergedStep.value)
  return Number(Math.min(Math.max(stepped, mergedMin.value), mergedMax.value).toFixed(precision))
}

function getPrecision(value: number) {
  const str = String(value)
  if (!str.includes('.')) return 0
  return str.length - str.indexOf('.') - 1
}

function getPercent(value: number) {
  if (valueRange.value <= 0) return 0
  return ((normalizeValue(value) - mergedMin.value) / valueRange.value) * 100
}

function getValueByPointer(event: PointerEvent) {
  const rect = sliderRef.value?.getBoundingClientRect()
  if (!rect || rect.width <= 0) return mergedMin.value
  const percent = (event.clientX - rect.left) / rect.width
  return normalizeValue(mergedMin.value + percent * valueRange.value)
}

function getClosestHandleIndex(value: number) {
  if (!props.range) return 0
  const [start, end] = normalizedValue.value
  return Math.abs(value - start) <= Math.abs(value - end) ? 0 : 1
}

function setValue(nextValue: number, handleIndex: number) {
  if (props.disabled) return
  const value = normalizeValue(nextValue)
  if (props.range) {
    const next: [number, number] = [...normalizedValue.value]
    next[handleIndex] = value
    const sorted: [number, number] = next[0] <= next[1] ? [next[0], next[1]] : [next[1], next[0]]
    modelValue.value = sorted
    return
  }
  modelValue.value = value
}

function commitChange() {
  if (props.range) {
    emit('change', normalizedValue.value)
    return
  }
  emit('change', normalizedValue.value[1])
}

function onTrackPointerDown(event: PointerEvent) {
  if (props.disabled || event.button !== 0) return
  const value = getValueByPointer(event)
  const index = getClosestHandleIndex(value)
  activeHandle.value = index
  setValue(value, index)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp, { once: true })
}

function onHandlePointerDown(event: PointerEvent, index: number) {
  if (props.disabled || event.button !== 0) return
  activeHandle.value = index
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp, { once: true })
}

function onPointerMove(event: PointerEvent) {
  if (activeHandle.value === null) return
  setValue(getValueByPointer(event), activeHandle.value)
}

function onPointerUp() {
  window.removeEventListener('pointermove', onPointerMove)
  activeHandle.value = null
  commitChange()
}

function onHandleKeydown(event: KeyboardEvent, index: number) {
  if (props.disabled) return
  const current = handles.value[index]?.value ?? mergedMin.value
  let next = current
  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = current - mergedStep.value
  else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = current + mergedStep.value
  else if (event.key === 'PageDown') next = current - mergedStep.value * 10
  else if (event.key === 'PageUp') next = current + mergedStep.value * 10
  else if (event.key === 'Home') next = mergedMin.value
  else if (event.key === 'End') next = mergedMax.value
  else return
  event.preventDefault()
  activeHandle.value = index
  setValue(next, index)
  commitChange()
}

function onMarkClick(value: number) {
  if (props.disabled) return
  const index = getClosestHandleIndex(value)
  activeHandle.value = index
  setValue(value, index)
  commitChange()
  activeHandle.value = null
}

function isStopActive(percent: number) {
  const start = props.range ? getPercent(normalizedValue.value[0]) : 0
  const end = getPercent(normalizedValue.value[1])
  return percent >= start && percent <= end
}

function isMarkActive(value: number) {
  const [start, end] = normalizedValue.value
  return props.range ? value >= start && value <= end : value <= end
}

function getTooltip(value: number) {
  return props.formatTooltip ? props.formatTooltip(value) : String(value)
}

function focus(handleIndex = 0) {
  if (props.disabled) return
  sliderRef.value?.querySelectorAll<HTMLButtonElement>('.yiz-slider-handle')[handleIndex]?.focus()
}

function blur() {
  const activeElement = document.activeElement
  if (activeElement instanceof HTMLElement && sliderRef.value?.contains(activeElement)) activeElement.blur()
}

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})

defineExpose({
  focus,
  blur,
})
</script>

<style lang="less">
.yiz-slider {
  --yiz-slider-height: 4px;
  --yiz-slider-handle-size: 14px;
  --yiz-slider-color: var(--yiz-color-primary);
  --yiz-slider-disabled-color: var(--yiz-color-text-disabled);

  position: relative;
  box-sizing: border-box;
  width: 100%;
  min-width: 120px;
  padding: 10px 0;
  cursor: pointer;
}

.yiz-slider-with-marks {
  padding-bottom: 28px;
}

.yiz-slider-track {
  position: relative;
  height: var(--yiz-slider-height);
}

.yiz-slider-rail,
.yiz-slider-fill {
  position: absolute;
  top: 0;
  height: var(--yiz-slider-height);
  border-radius: 999px;
}

.yiz-slider-rail {
  left: 0;
  right: 0;
  background: var(--yiz-color-bg-active);
}

.yiz-slider-fill {
  background: var(--yiz-slider-color);
}

.yiz-slider-stop {
  position: absolute;
  top: 50%;
  z-index: 1;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--yiz-color-border);
  transform: translate(-50%, -50%);
}

.yiz-slider-stop-active {
  background: var(--yiz-color-bg-container);
}

.yiz-slider-handle-wrap {
  position: absolute;
  top: 50%;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
}

.yiz-slider-handle {
  width: var(--yiz-slider-handle-size);
  height: var(--yiz-slider-handle-size);
  padding: 0;
  border: 2px solid var(--yiz-slider-color);
  border-radius: 50%;
  background: var(--yiz-color-bg-container);
  outline: none;
  cursor: grab;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    transform 0.2s;

  &:hover,
  &:focus-visible {
    box-shadow: 0 0 0 4px var(--yiz-color-primary-bg);
  }

  &:active {
    cursor: grabbing;
    transform: scale(1.08);
  }
}

.yiz-slider-tooltip {
  position: absolute;
  bottom: 18px;
  left: 50%;
  z-index: 3;
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--yiz-color-tooltip-text);
  background: var(--yiz-color-tooltip-bg);
  color: var(--yiz-color-text-inverse);
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
  pointer-events: none;
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.yiz-slider-handle-wrap:hover .yiz-slider-tooltip,
.yiz-slider-handle-wrap-active .yiz-slider-tooltip,
.yiz-slider-handle-wrap:focus-within .yiz-slider-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.yiz-slider-marks {
  position: absolute;
  top: 14px;
  left: 0;
  right: 0;
}

.yiz-slider-mark {
  position: absolute;
  padding: 0;
  border: none;
  background: transparent;
  color: var(--yiz-color-text-tertiary);
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  cursor: pointer;
  transform: translateX(-50%);
  transition: color 0.2s;

  &:hover {
    color: var(--yiz-slider-color);
  }
}

.yiz-slider-mark-active {
  color: var(--yiz-slider-color);
}

.yiz-slider-disabled {
  cursor: not-allowed;

  .yiz-slider-fill {
    background: var(--yiz-slider-disabled-color);
  }

  .yiz-slider-handle {
    border-color: var(--yiz-slider-disabled-color);
    cursor: not-allowed;
    box-shadow: none;
  }

  .yiz-slider-stop-active {
    background: var(--yiz-color-bg-muted);
  }

  .yiz-slider-mark {
    color: var(--yiz-color-text-disabled);
    cursor: not-allowed;
  }
}
</style>
