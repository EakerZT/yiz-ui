<template>
  <div
    ref="triggerRef"
    class="yiz-time-range-picker"
    :class="vClass"
    @click="onTriggerClick"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    v-bind="$attrs"
  >
    <div class="yiz-time-range-picker-input">
      <span class="yiz-time-range-picker-prefix" v-if="$props.prefix || $slots.prefix">
        <template v-if="$props.prefix">{{ $props.prefix }}</template>
        <slot v-else name="prefix" />
      </span>
      <input
        ref="startInputRef"
        class="yiz-time-range-picker-segment"
        :class="{ 'yiz-time-range-picker-segment-active': open && activeSide === 'start' }"
        :value="startInputText"
        :placeholder="startPlaceholder"
        :disabled="disabled"
        @click.stop="onSegmentClick('start')"
        @focus="onInputFocus('start')"
        @input="onInput('start', $event)"
        @blur="onInputBlur('start')"
        @keydown.enter.prevent.stop="confirmFromInput('start')"
      />
      <span class="yiz-time-range-picker-separator">
        <slot name="separator">
          <Icon v-if="separator === '-'" size="16" :icon="ArrowRight16Regular" />
          <template v-else>{{ separator }}</template>
        </slot>
      </span>
      <input
        ref="endInputRef"
        class="yiz-time-range-picker-segment"
        :class="{ 'yiz-time-range-picker-segment-active': open && activeSide === 'end' }"
        :value="endInputText"
        :placeholder="endPlaceholder"
        :disabled="disabled"
        @click.stop="onSegmentClick('end')"
        @focus="onInputFocus('end')"
        @input="onInput('end', $event)"
        @blur="onInputBlur('end')"
        @keydown.enter.prevent.stop="confirmFromInput('end')"
      />
      <Transition name="yiz-time-range-picker-clear-zoom">
        <span
          v-if="clearable && (startModel != null || endModel != null) && !disabled && (isHovering || open)"
          class="yiz-time-range-picker-clear"
          @click.stop="onClear"
        >
          <Icon size="16" :icon="DismissCircle32Filled" />
        </span>
      </Transition>
      <span class="yiz-time-range-picker-extra-suffix" v-if="$props.suffix || $slots.suffix">
        <template v-if="$props.suffix">{{ $props.suffix }}</template>
        <slot v-else name="suffix" />
      </span>
      <Icon
        :class="{
          'yiz-time-range-picker-suffix--hidden':
            clearable && (startModel != null || endModel != null) && !disabled && (isHovering || open)
        }"
        class="yiz-time-range-picker-suffix"
        size="16"
        :icon="Clock16Regular"
      />
    </div>
  </div>

  <Teleport to="body">
    <Transition name="yiz-time-range-picker-panel-fade">
      <div v-if="open" ref="panelRef" class="yiz-time-range-picker-panel" :style="panelStyle" @click.stop>
        <div class="yiz-time-range-picker-panels">
          <div
            class="yiz-time-range-picker-side"
            :class="{ 'yiz-time-range-picker-side-active': activeSide === 'start' }"
          >
            <div class="yiz-time-range-picker-body">
              <div class="yiz-time-range-picker-col">
                <div class="yiz-time-range-picker-col-header">{{ $t('timePicker.hour') }}</div>
                <div ref="startHourListRef" class="yiz-time-range-picker-col-list">
                  <div
                    v-for="h in hours"
                    :key="h"
                    class="yiz-time-range-picker-col-item"
                    :class="{ 'yiz-time-range-picker-col-item-active': h === startHour }"
                    @click="setPicked('start', 'hour', h)"
                  >
                    {{ pad(h) }}
                  </div>
                </div>
              </div>
              <div class="yiz-time-range-picker-col">
                <div class="yiz-time-range-picker-col-header">{{ $t('timePicker.minute') }}</div>
                <div ref="startMinuteListRef" class="yiz-time-range-picker-col-list">
                  <div
                    v-for="m in minutes"
                    :key="m"
                    class="yiz-time-range-picker-col-item"
                    :class="{ 'yiz-time-range-picker-col-item-active': m === startMinute }"
                    @click="setPicked('start', 'minute', m)"
                  >
                    {{ pad(m) }}
                  </div>
                </div>
              </div>
              <div v-if="showSeconds" class="yiz-time-range-picker-col">
                <div class="yiz-time-range-picker-col-header">{{ $t('timePicker.second') }}</div>
                <div ref="startSecondListRef" class="yiz-time-range-picker-col-list">
                  <div
                    v-for="s in 60"
                    :key="s - 1"
                    class="yiz-time-range-picker-col-item"
                    :class="{ 'yiz-time-range-picker-col-item-active': s - 1 === startSecond }"
                    @click="setPicked('start', 'second', s - 1)"
                  >
                    {{ pad(s - 1) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="yiz-time-range-picker-side"
            :class="{ 'yiz-time-range-picker-side-active': activeSide === 'end' }"
          >
            <div class="yiz-time-range-picker-body">
              <div class="yiz-time-range-picker-col">
                <div class="yiz-time-range-picker-col-header">{{ $t('timePicker.hour') }}</div>
                <div ref="endHourListRef" class="yiz-time-range-picker-col-list">
                  <div
                    v-for="h in hours"
                    :key="h"
                    class="yiz-time-range-picker-col-item"
                    :class="{ 'yiz-time-range-picker-col-item-active': h === endHour }"
                    @click="setPicked('end', 'hour', h)"
                  >
                    {{ pad(h) }}
                  </div>
                </div>
              </div>
              <div class="yiz-time-range-picker-col">
                <div class="yiz-time-range-picker-col-header">{{ $t('timePicker.minute') }}</div>
                <div ref="endMinuteListRef" class="yiz-time-range-picker-col-list">
                  <div
                    v-for="m in minutes"
                    :key="m"
                    class="yiz-time-range-picker-col-item"
                    :class="{ 'yiz-time-range-picker-col-item-active': m === endMinute }"
                    @click="setPicked('end', 'minute', m)"
                  >
                    {{ pad(m) }}
                  </div>
                </div>
              </div>
              <div v-if="showSeconds" class="yiz-time-range-picker-col">
                <div class="yiz-time-range-picker-col-header">{{ $t('timePicker.second') }}</div>
                <div ref="endSecondListRef" class="yiz-time-range-picker-col-list">
                  <div
                    v-for="s in 60"
                    :key="s - 1"
                    class="yiz-time-range-picker-col-item"
                    :class="{ 'yiz-time-range-picker-col-item-active': s - 1 === endSecond }"
                    @click="setPicked('end', 'second', s - 1)"
                  >
                    {{ pad(s - 1) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="yiz-time-range-picker-footer">
          <LinkButton @click="onNow">{{ $t('timePicker.now') }}</LinkButton>
          <Button type="primary" size="small" :disabled="confirmDisabled" @click="onConfirm">{{
            $t('common.confirm')
          }}</Button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ArrowRight16Regular, Clock16Regular, DismissCircle32Filled } from '@vicons/fluent'
import Button from '../button/Button.vue'
import { Icon } from '../icon'
import LinkButton from '../link-button/LinkButton.vue'
import { $t } from '../locale'
import { nextZIndex } from '../zIndex'

defineSlots<{
  prefix: unknown
  separator: unknown
  suffix: unknown
}>()

type TimeRangeSide = 'start' | 'end'
type TimeUnit = 'hour' | 'minute' | 'second'

interface TimeParts {
  hour: number
  minute: number
  second: number
}

const startModel = defineModel<string | null>('start')
const endModel = defineModel<string | null>('end')

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    clearable?: boolean
    forceRange?: boolean
    size?: 'small' | 'default' | 'large'
    showSeconds?: boolean
    format?: string
    startPlaceholder?: string
    endPlaceholder?: string
    startLabel?: string
    endLabel?: string
    separator?: string
    prefix?: string
    suffix?: string
  }>(),
  {
    disabled: false,
    clearable: false,
    forceRange: false,
    size: 'default',
    showSeconds: false,
    format: 'HH:mm:ss',
    separator: '-'
  }
)

const emit = defineEmits<{
  change: [start: string | null, end: string | null]
}>()

const open = ref(false)
const isHovering = ref(false)
const activeSide = ref<TimeRangeSide>('start')
const currentZIndex = ref(0)
const triggerRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
const startInputRef = ref<HTMLInputElement>()
const endInputRef = ref<HTMLInputElement>()
const startHourListRef = ref<HTMLElement>()
const startMinuteListRef = ref<HTMLElement>()
const startSecondListRef = ref<HTMLElement>()
const endHourListRef = ref<HTMLElement>()
const endMinuteListRef = ref<HTMLElement>()
const endSecondListRef = ref<HTMLElement>()

const draftStart = ref<string | null>(null)
const draftEnd = ref<string | null>(null)
const startInputFocused = ref(false)
const endInputFocused = ref(false)
const startInputDirty = ref(false)
const endInputDirty = ref(false)
const startInputText = ref('')
const endInputText = ref('')

const startHour = ref(0)
const startMinute = ref(0)
const startSecond = ref(0)
const endHour = ref(0)
const endMinute = ref(0)
const endSecond = ref(0)

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 60 }, (_, i) => i)

const dropdownPos = ref<{ top?: string; bottom?: string; left?: string }>({})

const startPlaceholder = computed(() => props.startPlaceholder ?? $t('timeRangePicker.startPlaceholder'))
const endPlaceholder = computed(() => props.endPlaceholder ?? $t('timeRangePicker.endPlaceholder'))
const separator = computed(() => props.separator)
const disabled = computed(() => props.disabled)
const clearable = computed(() => props.clearable)
const showSeconds = computed(() => props.showSeconds)
const confirmDisabled = computed(() => props.forceRange && (draftStart.value == null || draftEnd.value == null))

const panelStyle = computed(() => ({
  zIndex: currentZIndex.value + 1,
  ...dropdownPos.value
}))

const vClass = computed(() => ({
  'yiz-time-range-picker-open': open.value,
  'yiz-time-range-picker-disabled': props.disabled,
  'yiz-time-range-picker-small': props.size === 'small',
  'yiz-time-range-picker-large': props.size === 'large'
}))

watch(open, async (val) => {
  if (val) {
    await nextTick()
    repositionPanel()
    scrollToSelected()
  } else {
    startInputDirty.value = false
    endInputDirty.value = false
    syncInputTextFromModel()
  }
})

watch(
  () => [startModel.value, endModel.value, props.format],
  () => {
    if (!open.value && !startInputFocused.value && !endInputFocused.value) {
      syncInputTextFromModel()
    }
  },
  { immediate: true }
)

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) open.value = false
  }
)

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parseValue(value: string | null | undefined): TimeParts | null {
  if (!value) return null
  const tokenPattern = /HH|mm|ss|H|m|s/g
  const tokenMap: Record<string, string> = {
    HH: '(\\d{2})',
    H: '(\\d{1,2})',
    mm: '(\\d{2})',
    m: '(\\d{1,2})',
    ss: '(\\d{2})',
    s: '(\\d{1,2})'
  }
  const tokens: string[] = []
  let pattern = ''
  let lastIndex = 0
  for (const match of props.format.matchAll(tokenPattern)) {
    pattern += escapeRegExp(props.format.slice(lastIndex, match.index))
    pattern += tokenMap[match[0]]
    tokens.push(match[0])
    lastIndex = (match.index ?? 0) + match[0].length
  }
  pattern += escapeRegExp(props.format.slice(lastIndex))

  const matched = new RegExp(`^${pattern}$`).exec(value)
  if (!matched) return null

  let hour: number | null = null
  let minute: number | null = null
  let second = 0
  tokens.forEach((token, index) => {
    const num = Number(matched[index + 1])
    if (token === 'HH' || token === 'H') hour = num
    if (token === 'mm' || token === 'm') minute = num
    if (token === 'ss' || token === 's') second = num
  })
  if (hour == null || minute == null) return null
  if (hour < 0 || hour > 23) return null
  if (minute < 0 || minute > 59) return null
  if (second < 0 || second > 59) return null
  return { hour, minute, second }
}

function buildValue(side: TimeRangeSide): string {
  const hour = side === 'start' ? startHour.value : endHour.value
  const minute = side === 'start' ? startMinute.value : endMinute.value
  const second = side === 'start' ? startSecond.value : endSecond.value

  return props.format
    .replace(/HH/g, pad(hour))
    .replace(/mm/g, pad(minute))
    .replace(/ss/g, pad(second))
    .replace(/H/g, `${hour}`)
    .replace(/m/g, `${minute}`)
    .replace(/s/g, `${second}`)
}

function applyParts(side: TimeRangeSide, parts: TimeParts) {
  if (side === 'start') {
    startHour.value = parts.hour
    startMinute.value = parts.minute
    startSecond.value = parts.second
  } else {
    endHour.value = parts.hour
    endMinute.value = parts.minute
    endSecond.value = parts.second
  }
}

function applyParsed(side: TimeRangeSide, value: string | null | undefined) {
  applyParts(side, parseValue(value) ?? getNowParts())
}

function applyInputText(side: TimeRangeSide, value: string): TimeParts | null {
  const parsed = parseValue(value)
  if (!parsed) return null
  applyParts(side, parsed)
  if (side === 'start') {
    draftStart.value = buildValue('start')
  } else {
    draftEnd.value = buildValue('end')
  }
  activeSide.value = side
  scrollToSelected()
  return parsed
}

function getNowParts(): TimeParts {
  const now = new Date()
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds()
  }
}

function syncInputTextFromDraft(side: TimeRangeSide) {
  if (side === 'start') {
    startInputText.value = draftStart.value ?? ''
  } else {
    endInputText.value = draftEnd.value ?? ''
  }
}

function syncInputTextFromModel() {
  startInputText.value = startModel.value ?? ''
  endInputText.value = endModel.value ?? ''
}

function openPanel(side: TimeRangeSide) {
  if (props.disabled) return
  activeSide.value = side
  draftStart.value = startModel.value ?? null
  draftEnd.value = endModel.value ?? null
  applyParsed('start', draftStart.value)
  applyParsed('end', draftEnd.value)
  syncInputTextFromDraft('start')
  syncInputTextFromDraft('end')
  startInputDirty.value = false
  endInputDirty.value = false
  currentZIndex.value = nextZIndex()
  open.value = true
}

function onTriggerClick() {
  if (!open.value) {
    openPanel('start')
  }
}

function onSegmentClick(side: TimeRangeSide) {
  if (props.disabled) return
  if (!open.value) {
    openPanel(side)
  }
  activeSide.value = side
  nextTick(() => {
    if (side === 'start') {
      startInputRef.value?.focus()
    } else {
      endInputRef.value?.focus()
    }
  })
  scrollToSelected()
}

function onInputFocus(side: TimeRangeSide) {
  if (props.disabled) return
  if (side === 'start') {
    startInputFocused.value = true
  } else {
    endInputFocused.value = true
  }
  if (!open.value) {
    openPanel(side)
  }
  activeSide.value = side
}

function onInput(side: TimeRangeSide, e: Event) {
  if (props.disabled) return
  const value = (e.target as HTMLInputElement).value
  if (side === 'start') {
    startInputText.value = value
    startInputDirty.value = true
  } else {
    endInputText.value = value
    endInputDirty.value = true
  }
  applyInputText(side, value)
}

function onInputBlur(side: TimeRangeSide) {
  if (side === 'start') {
    startInputFocused.value = false
  } else {
    endInputFocused.value = false
  }
  const dirty = side === 'start' ? startInputDirty.value : endInputDirty.value
  if (!dirty) return

  applyInputText(side, side === 'start' ? startInputText.value : endInputText.value)
  syncInputTextFromDraft(side)
  if (side === 'start') {
    startInputDirty.value = false
  } else {
    endInputDirty.value = false
  }
}

function setPicked(side: TimeRangeSide, unit: TimeUnit, value: number) {
  if (props.disabled) return
  activeSide.value = side
  if (side === 'start') {
    if (unit === 'hour') startHour.value = value
    if (unit === 'minute') startMinute.value = value
    if (unit === 'second') startSecond.value = value
    draftStart.value = buildValue('start')
    syncInputTextFromDraft('start')
    startInputDirty.value = false
  } else {
    if (unit === 'hour') endHour.value = value
    if (unit === 'minute') endMinute.value = value
    if (unit === 'second') endSecond.value = value
    draftEnd.value = buildValue('end')
    syncInputTextFromDraft('end')
    endInputDirty.value = false
  }
}

function onNow() {
  if (props.disabled) return
  const now = getNowParts()
  if (activeSide.value === 'start') {
    startHour.value = now.hour
    startMinute.value = now.minute
    startSecond.value = now.second
    draftStart.value = buildValue('start')
    syncInputTextFromDraft('start')
    startInputDirty.value = false
  } else {
    endHour.value = now.hour
    endMinute.value = now.minute
    endSecond.value = now.second
    draftEnd.value = buildValue('end')
    syncInputTextFromDraft('end')
    endInputDirty.value = false
  }
  scrollToSelected()
}

function onConfirm() {
  if (props.disabled) return
  if (startInputDirty.value) {
    if (!applyInputText('start', startInputText.value)) return
    startInputDirty.value = false
  }
  if (endInputDirty.value) {
    if (!applyInputText('end', endInputText.value)) return
    endInputDirty.value = false
  }
  if (confirmDisabled.value) return
  startModel.value = draftStart.value
  endModel.value = draftEnd.value
  emit('change', draftStart.value, draftEnd.value)
  syncInputTextFromDraft('start')
  syncInputTextFromDraft('end')
  open.value = false
}

function confirmFromInput(side: TimeRangeSide) {
  if (!open.value) {
    openPanel(side)
  }
  onConfirm()
}

function onClear() {
  if (props.disabled) return
  startModel.value = null
  endModel.value = null
  draftStart.value = null
  draftEnd.value = null
  startInputText.value = ''
  endInputText.value = ''
  startInputDirty.value = false
  endInputDirty.value = false
  emit('change', null, null)
}

function repositionPanel() {
  if (!panelRef.value || !triggerRef.value || !open.value) return
  const panelRect = panelRef.value.getBoundingClientRect()
  const triggerRect = triggerRef.value.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const gap = 4
  const margin = 8

  const spaceBelow = vh - triggerRect.bottom - gap - margin
  const spaceAbove = triggerRect.top - gap - margin
  const pos: { top?: string; bottom?: string; left?: string } = {}

  if (spaceBelow >= panelRect.height || spaceBelow >= spaceAbove) {
    pos.top = `${triggerRect.bottom + gap}px`
  } else {
    pos.bottom = `${vh - triggerRect.top + gap}px`
  }

  let left = triggerRect.left
  if (left + panelRect.width > vw - margin) {
    left = triggerRect.right - panelRect.width
    if (left < margin) left = margin
  }
  if (left < margin) left = margin
  pos.left = `${left}px`

  dropdownPos.value = pos
}

function scrollToSelected() {
  nextTick(() => {
    scrollListTo(startHourListRef.value, startHour.value)
    scrollListTo(startMinuteListRef.value, startMinute.value)
    scrollListTo(startSecondListRef.value, startSecond.value)
    scrollListTo(endHourListRef.value, endHour.value)
    scrollListTo(endMinuteListRef.value, endMinute.value)
    scrollListTo(endSecondListRef.value, endSecond.value)
  })
}

function scrollListTo(list: HTMLElement | undefined, index: number) {
  const item = list?.children[index] as HTMLElement | undefined
  if (!list || !item) return
  list.scrollTop = item.offsetTop - list.offsetHeight / 2 + item.offsetHeight / 2
}

function onClickOutside(e: MouseEvent) {
  if (!open.value) return
  const target = e.target as HTMLElement
  if (triggerRef.value?.contains(target)) return
  if (panelRef.value?.contains(target)) return
  open.value = false
}

function onReposition() {
  if (open.value) {
    repositionPanel()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') {
    open.value = false
  }
  if (e.key === 'Enter') {
    onConfirm()
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside, true)
  document.addEventListener('keydown', onKeydown)
  window.addEventListener('scroll', onReposition, true)
  window.addEventListener('resize', onReposition)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside, true)
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', onReposition, true)
  window.removeEventListener('resize', onReposition)
})
</script>

<style lang="less">
.yiz-time-range-picker {
  display: flex;
  align-items: center;
  position: relative;
  min-width: 260px;
  box-sizing: border-box;
}

.yiz-time-range-picker-input {
  display: inline-flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  width: 100%;
  position: relative;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-base-border-radius-default);
  background: #fff;
  cursor: pointer;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  box-sizing: border-box;
  gap: 4px;
}

.yiz-time-range-picker:not(.yiz-time-range-picker-disabled) .yiz-time-range-picker-input:hover {
  border-color: var(--yiz-color-primary);
}

.yiz-time-range-picker-open .yiz-time-range-picker-input {
  border-color: var(--yiz-color-primary);
  box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
}

.yiz-form-item-error-status .yiz-time-range-picker:not(.yiz-time-range-picker-disabled) .yiz-time-range-picker-input {
  border-color: var(--yiz-color-error);
}

.yiz-form-item-error-status
  .yiz-time-range-picker:not(.yiz-time-range-picker-disabled)
  .yiz-time-range-picker-input:hover {
  border-color: var(--yiz-color-error);
}

.yiz-form-item-error-status
  .yiz-time-range-picker-open:not(.yiz-time-range-picker-disabled)
  .yiz-time-range-picker-input {
  border-color: var(--yiz-color-error);
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
}

.yiz-time-range-picker-disabled .yiz-time-range-picker-input {
  background: #f5f5f5;
  cursor: not-allowed;
}

.yiz-time-range-picker-segment {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 4px;
  border: none;
  outline: none;
  box-sizing: border-box;
  border-radius: 3px;
  background: transparent;
  color: #333;
  cursor: text;
  font: inherit;
  text-align: center;
  appearance: none;
  transition:
    background 0.2s,
    color 0.2s;

  &::placeholder {
    color: #c0c4cc;
  }
}

.yiz-time-range-picker-segment:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.yiz-time-range-picker-separator {
  display: inline-flex;
  align-items: center;
  color: #999;
  flex-shrink: 0;
}

.yiz-time-range-picker-clear,
.yiz-time-range-picker-suffix {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  color: #999;
}

.yiz-time-range-picker-suffix {
  transition: opacity 0.2s;
}

.yiz-time-range-picker-suffix--hidden {
  opacity: 0;
}

.yiz-time-range-picker-prefix,
.yiz-time-range-picker-extra-suffix {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  color: #666;
  user-select: none;
}

.yiz-time-range-picker-clear {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  user-select: none;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  transition: color 0.3s;
  z-index: 1;
}

.yiz-time-range-picker-clear:hover {
  color: rgba(0, 0, 0, 0.88);
}

.yiz-time-range-picker-small .yiz-time-range-picker-input {
  height: 24px;
  border-radius: var(--yiz-base-border-radius-small);
  font-size: 13px;
}

.yiz-time-range-picker-large .yiz-time-range-picker-input {
  height: 40px;
  border-radius: var(--yiz-base-border-radius-large);
  font-size: 16px;
}

.yiz-time-range-picker-panel {
  position: fixed;
  width: 520px;
  background: #fff;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-pane-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  user-select: none;
}

.yiz-time-range-picker-panels {
  display: flex;
  align-items: stretch;
  gap: 0;
}

.yiz-time-range-picker-side {
  width: 50%;
  min-width: 0;
  flex: 0 0 50%;
}

.yiz-time-range-picker-side + .yiz-time-range-picker-side {
  border-left: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-time-range-picker-body {
  display: flex;
  padding: 8px;
  gap: 4px;
}

.yiz-time-range-picker-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.yiz-time-range-picker-col-header {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 4px 0;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  margin-bottom: 2px;
  flex-shrink: 0;
}

.yiz-time-range-picker-col-list {
  flex: 1;
  overflow-y: auto;
  max-height: 180px;
  scrollbar-width: none;
}

.yiz-time-range-picker-col-list::-webkit-scrollbar {
  display: none;
}

.yiz-time-range-picker-col-item {
  text-align: center;
  padding: 6px 0;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-radius: var(--yiz-pane-item-border-radius);
  transition:
    background 0.15s,
    color 0.15s;
}

.yiz-time-range-picker-col-item:hover {
  background: var(--yiz-color-hover-bg);
}

.yiz-time-range-picker-col-item-active,
.yiz-time-range-picker-col-item-active:hover {
  color: var(--yiz-color-primary);
  background: var(--yiz-color-primary-light8);
  font-weight: 600;
}

.yiz-time-range-picker-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-time-range-picker-panel-fade-enter-active,
.yiz-time-range-picker-panel-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.yiz-time-range-picker-panel-fade-enter-from,
.yiz-time-range-picker-panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

// ==================== clear 缩放过渡 ====================

.yiz-time-range-picker-clear-zoom-enter-active,
.yiz-time-range-picker-clear-zoom-leave-active {
  transition:
    transform 0.2s,
    opacity 0.2s;
}

.yiz-time-range-picker-clear-zoom-enter-from,
.yiz-time-range-picker-clear-zoom-leave-to {
  transform: translateY(-50%) scale(0);
  opacity: 0;
}
</style>
