<template>
  <div ref="triggerRef" class="yiz-color-picker" :class="vClass" @click="onTriggerClick" v-bind="$attrs">
    <span class="yiz-color-picker-prefix" v-if="$props.prefix || $slots.prefix">
      <template v-if="$props.prefix">{{ $props.prefix }}</template>
      <slot v-else name="prefix" />
    </span>
    <span class="yiz-color-picker-swatch" :style="{ '--yiz-color-picker-swatch-color': displayColor }" />
    <span class="yiz-color-picker-value">{{ displayColor }}</span>
    <span class="yiz-color-picker-suffix" v-if="$props.suffix || $slots.suffix">
      <template v-if="$props.suffix">{{ $props.suffix }}</template>
      <slot v-else name="suffix" />
    </span>
  </div>
  <Teleport to="body">
    <Transition name="yiz-color-picker-dropdown-fade">
      <div v-if="open" ref="dropdownRef" class="yiz-color-picker-dropdown" :style="dropdownStyle" @click.stop>
        <div
          ref="panelRef"
          class="yiz-color-picker-panel"
          :style="{ backgroundColor: hueColor }"
          @mousedown.prevent="onPanelMouseDown"
        >
          <div class="yiz-color-picker-panel-white" />
          <div class="yiz-color-picker-panel-black" />
          <span class="yiz-color-picker-panel-thumb" :style="{ left: `${saturation}%`, top: `${100 - brightness}%` }" />
        </div>

        <div class="yiz-color-picker-control-row">
          <span class="yiz-color-picker-preview" :style="{ '--yiz-color-picker-swatch-color': previewColor }" />
          <div ref="hueRef" class="yiz-color-picker-hue" @mousedown.prevent="onHueMouseDown">
            <span class="yiz-color-picker-hue-thumb" :style="{ left: `${(hue / 360) * 100}%` }" />
          </div>
        </div>

        <div v-if="alpha" class="yiz-color-picker-alpha-row">
          <span class="yiz-color-picker-alpha-label">{{ Math.round(alphaValue) }}%</span>
          <div
            ref="alphaRef"
            class="yiz-color-picker-alpha"
            :style="alphaSliderStyle"
            @mousedown.prevent="onAlphaMouseDown"
          >
            <span class="yiz-color-picker-alpha-thumb" :style="{ left: `${alphaValue}%` }" />
          </div>
        </div>

        <Input
          class="yiz-color-picker-input"
          v-model:value="inputValue"
          prefix="#"
          @press-enter="commitTextInput"
          @focusout="commitTextInput"
        />

        <div class="yiz-color-picker-presets">
          <button
            v-for="color in presets"
            :key="color"
            class="yiz-color-picker-preset"
            :class="{
              'yiz-color-picker-preset-active': normalizeColor(color) === previewBaseColor,
              'yiz-color-picker-preset-white': normalizeColor(color) === '#ffffff'
            }"
            :style="{
              backgroundColor: normalizeColor(color),
              '--yiz-color-picker-preset-color': normalizeColor(color)
            }"
            type="button"
            :aria-label="normalizeColor(color)"
            @click="selectDraftColor(normalizeColor(color))"
          />
        </div>

        <div class="yiz-color-picker-actions">
          <Button size="small" @click="cancel">{{ $t('common.cancel') }}</Button>
          <Button type="primary" size="small" @click="confirm">{{ $t('common.confirm') }}</Button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Button from '../button/Button.vue'
import Input from '../input/Input.vue'
import { $t } from '../locale'
import { nextZIndex } from '../zIndex'

interface HsvColor {
  h: number
  s: number
  v: number
}

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    size?: 'small' | 'default' | 'large'
    alpha?: boolean
    presets?: string[]
    prefix?: string
    suffix?: string
  }>(),
  {
    disabled: false,
    size: 'default',
    alpha: false,
    presets: () => [
      '#1677ff',
      '#52c41a',
      '#faad14',
      '#ff4d4f',
      '#722ed1',
      '#13c2c2',
      '#eb2f96',
      '#2f54eb',
      '#000000',
      '#ffffff'
    ]
  }
)

const emit = defineEmits<{
  change: [value: string]
}>()

const modelValue = defineModel<string>('value')

const open = ref(false)
const currentZIndex = ref(0)
const triggerRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
const hueRef = ref<HTMLElement>()
const alphaRef = ref<HTMLElement>()
const dropdownPos = ref<{ top?: string; bottom?: string; left?: string }>({})
const inputValue = ref('')
const hue = ref(215)
const saturation = ref(100)
const brightness = ref(100)
const alphaValue = ref(100)
const dragging = ref<'panel' | 'hue' | 'alpha' | null>(null)

const alpha = computed(() => props.alpha)
const displayColor = computed(() => normalizeColor(modelValue.value || '#1677ff', props.alpha))
const previewBaseColor = computed(() => hsvToHex({ h: hue.value, s: saturation.value, v: brightness.value }))
const previewColor = computed(() => formatColor(previewBaseColor.value, alphaValue.value))
const hueColor = computed(() => hsvToHex({ h: hue.value, s: 100, v: 100 }))
const alphaSliderStyle = computed(() => ({
  backgroundImage: `
    linear-gradient(to right, rgba(255,255,255,0), ${previewBaseColor.value}),
    linear-gradient(45deg, #d9d9d9 25%, transparent 25%),
    linear-gradient(-45deg, #d9d9d9 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #d9d9d9 75%),
    linear-gradient(-45deg, transparent 75%, #d9d9d9 75%)
  `,
  backgroundPosition: '0 0, 0 0, 0 4px, 4px -4px, -4px 0',
  backgroundSize: '100% 100%, 8px 8px, 8px 8px, 8px 8px, 8px 8px'
}))

const vClass = computed(() => ({
  'yiz-color-picker-open': open.value,
  'yiz-color-picker-disabled': props.disabled,
  'yiz-color-picker-small': props.size === 'small',
  'yiz-color-picker-large': props.size === 'large'
}))

const dropdownStyle = computed(() => ({
  zIndex: currentZIndex.value + 1,
  ...dropdownPos.value
}))

watch(
  displayColor,
  (value) => {
    if (!open.value) {
      setDraftColor(value)
    }
  },
  { immediate: true }
)

watch(previewColor, (value) => {
  inputValue.value = value.slice(1).toUpperCase()
})

watch(inputValue, (value) => {
  const nextValue = normalizeHexInput(value)
  if (nextValue !== value) {
    inputValue.value = nextValue
  }
})

function normalizeColor(value: string, keepAlpha = false) {
  const raw = String(value || '').trim()
  const hex = raw.startsWith('#') ? raw : `#${raw}`
  if (/^#[\da-fA-F]{3}$/.test(hex)) {
    const full = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`.toLowerCase()
    return keepAlpha ? `${full}ff` : full
  }
  if (/^#[\da-fA-F]{6}$/.test(hex)) {
    const full = hex.toLowerCase()
    return keepAlpha ? `${full}ff` : full
  }
  if (/^#[\da-fA-F]{8}$/.test(hex)) {
    const full = hex.toLowerCase()
    return keepAlpha ? full : full.slice(0, 7)
  }
  return keepAlpha ? '#1677ffff' : '#1677ff'
}

function isHexInput(value: string) {
  return props.alpha ? /^[\da-fA-F]{8}$/.test(value) : /^[\da-fA-F]{6}$/.test(value)
}

function normalizeHexInput(value: string) {
  return String(value ?? '')
    .replace(/[^0-9a-fA-F]/g, '')
    .slice(0, props.alpha ? 8 : 6)
    .toUpperCase()
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function hexToRgb(hexValue: string) {
  const hex = normalizeColor(hexValue).slice(1)
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16)
  }
}

function getAlphaFromHex(hexValue: string) {
  const normalized = normalizeColor(hexValue, true)
  return (Number.parseInt(normalized.slice(7, 9), 16) / 255) * 100
}

function formatColor(baseColor: string, alphaPercent: number) {
  const base = normalizeColor(baseColor)
  if (!props.alpha) return base
  const alphaHex = clamp(Math.round((alphaPercent / 100) * 255), 0, 255)
    .toString(16)
    .padStart(2, '0')
  return `${base}${alphaHex}`
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('')}`
}

function hexToHsv(hexValue: string): HsvColor {
  const { r, g, b } = hexToRgb(hexValue)
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min
  let h = 0

  if (delta !== 0) {
    if (max === rn) h = 60 * (((gn - bn) / delta) % 6)
    else if (max === gn) h = 60 * ((bn - rn) / delta + 2)
    else h = 60 * ((rn - gn) / delta + 4)
  }

  if (h < 0) h += 360

  return {
    h,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100
  }
}

function hsvToHex(color: HsvColor) {
  const h = color.h
  const s = color.s / 100
  const v = color.v / 100
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let r = 0
  let g = 0
  let b = 0

  if (h < 60) {
    r = c
    g = x
  } else if (h < 120) {
    r = x
    g = c
  } else if (h < 180) {
    g = c
    b = x
  } else if (h < 240) {
    g = x
    b = c
  } else if (h < 300) {
    r = x
    b = c
  } else {
    r = c
    b = x
  }

  return rgbToHex((r + m) * 255, (g + m) * 255, (b + m) * 255)
}

function setDraftColor(value: string) {
  const hsv = hexToHsv(value)
  hue.value = hsv.s === 0 ? hue.value : hsv.h
  saturation.value = hsv.s
  brightness.value = hsv.v
  alphaValue.value = props.alpha ? getAlphaFromHex(value) : 100
  inputValue.value = normalizeColor(value, props.alpha).slice(1).toUpperCase()
}

function onTriggerClick() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    setDraftColor(displayColor.value)
    currentZIndex.value = nextZIndex()
    nextTick(repositionDropdown)
  }
}

function selectDraftColor(value: string) {
  setDraftColor(value)
}

function commitTextInput() {
  if (isHexInput(inputValue.value)) {
    setDraftColor(`#${inputValue.value}`)
  } else {
    inputValue.value = previewColor.value.slice(1).toUpperCase()
  }
}

function updatePanelByMouse(e: MouseEvent) {
  if (!panelRef.value) return
  const rect = panelRef.value.getBoundingClientRect()
  saturation.value = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100)
  brightness.value = clamp(100 - ((e.clientY - rect.top) / rect.height) * 100, 0, 100)
}

function updateHueByMouse(e: MouseEvent) {
  if (!hueRef.value) return
  const rect = hueRef.value.getBoundingClientRect()
  hue.value = clamp(((e.clientX - rect.left) / rect.width) * 360, 0, 360)
}

function updateAlphaByMouse(e: MouseEvent) {
  if (!alphaRef.value) return
  const rect = alphaRef.value.getBoundingClientRect()
  alphaValue.value = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100)
}

function onPanelMouseDown(e: MouseEvent) {
  dragging.value = 'panel'
  updatePanelByMouse(e)
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
}

function onHueMouseDown(e: MouseEvent) {
  dragging.value = 'hue'
  updateHueByMouse(e)
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
}

function onAlphaMouseDown(e: MouseEvent) {
  dragging.value = 'alpha'
  updateAlphaByMouse(e)
  document.addEventListener('mousemove', onDragMove)
  document.addEventListener('mouseup', onDragEnd)
}

function onDragMove(e: MouseEvent) {
  if (dragging.value === 'panel') updatePanelByMouse(e)
  if (dragging.value === 'hue') updateHueByMouse(e)
  if (dragging.value === 'alpha') updateAlphaByMouse(e)
}

function onDragEnd() {
  dragging.value = null
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
}

function confirm() {
  const color = previewColor.value
  modelValue.value = color
  emit('change', color)
  open.value = false
}

function cancel() {
  setDraftColor(displayColor.value)
  open.value = false
}

function repositionDropdown() {
  if (!triggerRef.value || !dropdownRef.value || !open.value) return
  const triggerRect = triggerRef.value.getBoundingClientRect()
  const dropdownRect = dropdownRef.value.getBoundingClientRect()
  const gap = 4
  const margin = 8
  const vw = window.innerWidth
  const vh = window.innerHeight
  const pos: { top?: string; bottom?: string; left?: string } = {}

  if (triggerRect.bottom + gap + dropdownRect.height <= vh - margin) {
    pos.top = `${triggerRect.bottom + gap}px`
  } else {
    pos.bottom = `${vh - triggerRect.top + gap}px`
  }

  let left = triggerRect.left
  if (left + dropdownRect.width > vw - margin) {
    left = triggerRect.right - dropdownRect.width
  }
  pos.left = `${Math.max(margin, left)}px`
  dropdownPos.value = pos
}

function onClickOutside(e: MouseEvent) {
  if (!open.value) return
  const target = e.target as HTMLElement
  if (triggerRef.value?.contains(target)) return
  if (dropdownRef.value?.contains(target)) return
  cancel()
}

function onReposition() {
  if (open.value) repositionDropdown()
}

onMounted(() => {
  document.addEventListener('click', onClickOutside, true)
  window.addEventListener('scroll', onReposition, true)
  window.addEventListener('resize', onReposition)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside, true)
  document.removeEventListener('mousemove', onDragMove)
  document.removeEventListener('mouseup', onDragEnd)
  window.removeEventListener('scroll', onReposition, true)
  window.removeEventListener('resize', onReposition)
})
</script>

<style lang="less">
.yiz-color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  min-width: 116px;
  padding: 0 10px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-base-border-radius-default);
  background: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;

  &:hover {
    border-color: var(--yiz-color-primary);
  }

  &.yiz-color-picker-open {
    border-color: var(--yiz-color-primary);
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }

  &.yiz-color-picker-disabled {
    background: #f5f5f5;
    color: #c0c4cc;
    cursor: not-allowed;

    &:hover {
      border-color: var(--yiz-color-border, #d9d9d9);
    }
  }

  &.yiz-color-picker-small {
    height: 24px;
    min-width: 104px;
    padding: 0 8px;
    border-radius: var(--yiz-base-border-radius-small);
    font-size: 13px;

    .yiz-color-picker-swatch {
      width: 14px;
      height: 14px;
    }
  }

  &.yiz-color-picker-large {
    height: 40px;
    min-width: 128px;
    padding: 0 12px;
    border-radius: var(--yiz-base-border-radius-large);
    font-size: 16px;

    .yiz-color-picker-swatch {
      width: 22px;
      height: 22px;
    }
  }

  .yiz-form-item-error-status &:not(.yiz-color-picker-disabled) {
    border-color: var(--yiz-color-error);

    &:hover {
      border-color: var(--yiz-color-error);
    }

    &.yiz-color-picker-open {
      border-color: var(--yiz-color-error);
      box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
    }
  }
}

.yiz-color-picker-swatch {
  width: 18px;
  height: 18px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: var(--yiz-pane-item-border-radius);
  background-image:
    linear-gradient(var(--yiz-color-picker-swatch-color), var(--yiz-color-picker-swatch-color)),
    linear-gradient(45deg, #d9d9d9 25%, transparent 25%), linear-gradient(-45deg, #d9d9d9 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #d9d9d9 75%), linear-gradient(-45deg, transparent 75%, #d9d9d9 75%);
  background-position:
    0 0,
    0 0,
    0 4px,
    4px -4px,
    -4px 0;
  background-size:
    100% 100%,
    8px 8px,
    8px 8px,
    8px 8px,
    8px 8px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.yiz-color-picker-prefix,
.yiz-color-picker-suffix {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: #666;
  user-select: none;
}

.yiz-color-picker-value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  line-height: 1;
  text-transform: uppercase;
  white-space: nowrap;
}

.yiz-color-picker-dropdown {
  position: fixed;
  width: 258px;
  padding: 12px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-pane-border-radius);
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.yiz-color-picker-panel {
  position: relative;
  width: 100%;
  height: 156px;
  overflow: hidden;
  border-radius: 4px;
  cursor: crosshair;
}

.yiz-color-picker-panel-white,
.yiz-color-picker-panel-black {
  position: absolute;
  inset: 0;
}

.yiz-color-picker-panel-white {
  background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
}

.yiz-color-picker-panel-black {
  background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
}

.yiz-color-picker-panel-thumb {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
  transform: translate(-50%, -50%);
}

.yiz-color-picker-control-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.yiz-color-picker-preview {
  width: 28px;
  height: 28px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  background-image:
    linear-gradient(var(--yiz-color-picker-swatch-color), var(--yiz-color-picker-swatch-color)),
    linear-gradient(45deg, #d9d9d9 25%, transparent 25%), linear-gradient(-45deg, #d9d9d9 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #d9d9d9 75%), linear-gradient(-45deg, transparent 75%, #d9d9d9 75%);
  background-position:
    0 0,
    0 0,
    0 5px,
    5px -5px,
    -5px 0;
  background-size:
    100% 100%,
    10px 10px,
    10px 10px,
    10px 10px,
    10px 10px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.yiz-color-picker-hue {
  position: relative;
  flex: 1;
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(to right, red, #ff0, lime, cyan, blue, #f0f, red);
  cursor: pointer;
}

.yiz-color-picker-hue-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
  transform: translate(-50%, -50%);
}

.yiz-color-picker-alpha-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.yiz-color-picker-alpha-label {
  width: 34px;
  color: #666;
  font-size: 12px;
  text-align: right;
}

.yiz-color-picker-alpha {
  position: relative;
  flex: 1;
  height: 12px;
  border-radius: 6px;
  cursor: pointer;
}

.yiz-color-picker-alpha-thumb {
  position: absolute;
  top: 50%;
  width: 12px;
  height: 12px;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
  transform: translate(-50%, -50%);
}

.yiz-color-picker-input {
  display: flex;
  width: 100%;
  margin-top: 10px;

  .yiz-input_inner,
  .yiz-input_prefix {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    text-transform: uppercase;
  }
}

.yiz-color-picker-presets {
  display: grid;
  grid-template-columns: repeat(10, 18px);
  gap: 6px;
  margin-top: 10px;
}

.yiz-color-picker-preset {
  width: 18px;
  height: 18px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 3px;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
  transition:
    box-shadow 0.2s,
    transform 0.2s;

  &:hover {
    transform: translateY(-1px);
  }

  &.yiz-color-picker-preset-active {
    border-color: transparent;
    box-shadow:
      inset 0 0 0 1px rgba(255, 255, 255, 0.55),
      0 0 8px 2px var(--yiz-color-picker-preset-color);
  }

  &.yiz-color-picker-preset-white.yiz-color-picker-preset-active {
    border-color: #bfbfbf;
    box-shadow:
      inset 0 0 0 1px #fff,
      0 0 0 1px rgba(0, 0, 0, 0.28),
      0 0 8px 2px rgba(0, 0, 0, 0.24);
  }
}

.yiz-color-picker-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}

.yiz-color-picker-dropdown-fade-enter-active,
.yiz-color-picker-dropdown-fade-leave-active {
  transition:
    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-color-picker-dropdown-fade-enter-from,
.yiz-color-picker-dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
