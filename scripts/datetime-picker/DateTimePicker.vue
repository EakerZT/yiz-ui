<template>
  <div
    ref="triggerRef"
    class="yiz-datetime-picker"
    :class="vClass"
    @click="onTriggerClick"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    v-bind="$attrs"
  >
    <div class="yiz-datetime-picker-input">
      <input
        ref="inputRef"
        :value="inputText"
        :placeholder="placeholderText"
        :disabled="disabled"
        :readonly="readonly"
        @input="onInput"
        @focus="onInputFocus"
        @blur="onInputBlur"
        @keydown.enter.prevent.stop="confirmFromInput"
      />
      <Transition name="yiz-datetime-picker-clear-zoom">
        <span
          v-if="clearable && modelValue != null && !disabled && !readonly && (isHovering || open)"
          class="yiz-datetime-picker-clear"
          @click.stop="onClear"
        >
          <Icon size="16" :icon="DismissCircle16Filled" />
        </span>
      </Transition>
      <Icon
        :class="{
          'yiz-datetime-picker-suffix--hidden':
            clearable && modelValue != null && !disabled && !readonly && (isHovering || open),
        }"
        class="yiz-datetime-picker-suffix"
        size="16"
        :icon="CalendarClock16Regular"
      />
    </div>
  </div>

  <Teleport to="body">
    <Transition name="yiz-datetime-picker-panel-fade">
      <div v-if="open" ref="panelRef" class="yiz-datetime-picker-panel" :style="panelStyle" @click.stop>
        <div class="yiz-datetime-picker-content">
          <div class="yiz-datetime-picker-date-panel">
            <div class="yiz-datetime-picker-header">
              <Icon class="yiz-datetime-picker-nav" size="16" :icon="ChevronDoubleLeft16Regular" @click="prevYear" />
              <Icon class="yiz-datetime-picker-nav" size="16" :icon="ChevronLeft16Regular" @click="prevMonth" />
              <span class="yiz-datetime-picker-month-year" @click="showYearPicker = !showYearPicker">
                {{ $t('datePicker.yearMonth', { year, month }) }}
              </span>
              <Icon class="yiz-datetime-picker-nav" size="16" :icon="ChevronRight16Regular" @click="nextMonth" />
              <Icon class="yiz-datetime-picker-nav" size="16" :icon="ChevronDoubleRight16Regular" @click="nextYear" />
            </div>

            <div v-if="showYearPicker" class="yiz-datetime-picker-year-grid">
              <div
                v-for="y in yearRange"
                :key="y"
                class="yiz-datetime-picker-year-item"
                :class="{ 'yiz-datetime-picker-year-item-active': y === year }"
                @click="selectYear(y)"
              >
                {{ y }}
              </div>
            </div>

            <div v-else class="yiz-datetime-picker-body">
              <div class="yiz-datetime-picker-weekdays">
                <span v-for="d in weekDays" :key="d" class="yiz-datetime-picker-weekday">{{ d }}</span>
              </div>
              <div class="yiz-datetime-picker-dates">
                <div
                  v-for="(cell, idx) in calendarCells"
                  :key="idx"
                  class="yiz-datetime-picker-cell"
                  :class="{
                    'yiz-datetime-picker-cell-other': !cell.current,
                    'yiz-datetime-picker-cell-today': cell.isToday,
                    'yiz-datetime-picker-cell-selected': cell.isSelected,
                    'yiz-datetime-picker-cell-disabled': cell.disabled,
                  }"
                  @click="onCellClick(cell)"
                >
                  <span class="yiz-datetime-picker-cell-inner">{{ cell.day }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="yiz-datetime-picker-time">
            <div class="yiz-datetime-picker-time-col">
              <div class="yiz-datetime-picker-time-title">{{ $t('timePicker.hour') }}</div>
              <div class="yiz-datetime-picker-time-list">
                <div
                  v-for="h in hours"
                  :key="h"
                  class="yiz-datetime-picker-time-item"
                  :class="{ 'yiz-datetime-picker-time-item-active': h === pickedHour }"
                  @click="setTime('hour', h)"
                >
                  {{ pad(h) }}
                </div>
              </div>
            </div>
            <div class="yiz-datetime-picker-time-col">
              <div class="yiz-datetime-picker-time-title">{{ $t('timePicker.minute') }}</div>
              <div class="yiz-datetime-picker-time-list">
                <div
                  v-for="m in minutes"
                  :key="m"
                  class="yiz-datetime-picker-time-item"
                  :class="{ 'yiz-datetime-picker-time-item-active': m === pickedMinute }"
                  @click="setTime('minute', m)"
                >
                  {{ pad(m) }}
                </div>
              </div>
            </div>
            <div class="yiz-datetime-picker-time-col">
              <div class="yiz-datetime-picker-time-title">{{ $t('timePicker.second') }}</div>
              <div class="yiz-datetime-picker-time-list">
                <div
                  v-for="s in 60"
                  :key="s - 1"
                  class="yiz-datetime-picker-time-item"
                  :class="{ 'yiz-datetime-picker-time-item-active': s - 1 === pickedSecond }"
                  @click="setTime('second', s - 1)"
                >
                  {{ pad(s - 1) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="yiz-datetime-picker-footer">
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
import {
  CalendarClock16Regular,
  ChevronDoubleLeft16Regular,
  ChevronDoubleRight16Regular,
  ChevronLeft16Regular,
  ChevronRight16Regular,
  DismissCircle16Filled,
} from '@vicons/fluent'
import Button from '../button/Button.vue'
import LinkButton from '../link-button/LinkButton.vue'
import { Icon } from '../icon'
import { $t, $tList } from '../locale'
import { useOverlayElement } from '../overlay/overlayScope'
import { nextZIndex } from '../zIndex'
import { type DateTimeValue, formatDateTime, parseDateTime, parseDateTimeValue } from '../datetime-utils'

interface CalendarCell {
  day: number
  current: boolean
  isToday: boolean
  isSelected: boolean
  disabled: boolean
  date: Date
}

const props = withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    size?: 'small' | 'default' | 'large'
    format?: string
    valueFormat?: string
    disabledDate?: (date: Date) => boolean
  }>(),
  {
    disabled: false,
    readonly: false,
    clearable: false,
    size: 'default',
    format: 'YYYY-MM-DD HH:mm:ss',
  },
)

const emit = defineEmits<{
  change: [value: DateTimeValue]
}>()

const modelValue = defineModel<DateTimeValue>('value')

const open = ref(false)
const currentZIndex = ref(0)
const triggerRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
useOverlayElement(panelRef, open)
const inputRef = ref<HTMLInputElement>()
const isHovering = ref(false)
const inputFocused = ref(false)
const inputDirty = ref(false)
const inputText = ref('')
const showYearPicker = ref(false)
const draft = ref<Date | null>(null)
const now = new Date()
const viewYear = ref(now.getFullYear())
const viewMonth = ref(now.getMonth() + 1)
const pickedHour = ref(0)
const pickedMinute = ref(0)
const pickedSecond = ref(0)

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 60 }, (_, i) => i)
const weekDays = computed(() => $tList('datePicker.weekdays'))
const year = computed(() => viewYear.value)
const month = computed(() => viewMonth.value)
const placeholderText = computed(() => props.placeholder ?? $t('datePicker.placeholder'))
const confirmDisabled = computed(() => draft.value == null)
const panelStyle = computed(() => ({ zIndex: currentZIndex.value + 1 }))
const valueFormat = computed(() => props.valueFormat ?? props.format)

const vClass = computed(() => ({
  'yiz-datetime-picker-open': open.value,
  'yiz-datetime-picker-disabled': props.disabled,
  'yiz-datetime-picker-readonly': props.readonly,
  'yiz-datetime-picker-small': props.size === 'small',
  'yiz-datetime-picker-large': props.size === 'large',
}))

const yearRange = computed(() => {
  const start = viewYear.value - 6
  return Array.from({ length: 12 }, (_, i) => start + i)
})

const calendarCells = computed<CalendarCell[]>(() => {
  const cells: CalendarCell[] = []
  const y = viewYear.value
  const m = viewMonth.value
  const firstDay = new Date(y, m - 1, 1)
  const daysInMonth = new Date(y, m, 0).getDate()
  const startWeekDay = firstDay.getDay()
  const prevDays = new Date(y, m - 1, 0).getDate()
  for (let i = startWeekDay - 1; i >= 0; i--) cells.push(makeCell(y, m - 1, prevDays - i, false))
  for (let d = 1; d <= daysInMonth; d++) cells.push(makeCell(y, m, d, true))
  for (let d = 1; cells.length < 42; d++) cells.push(makeCell(y, m + 1, d, false))
  return cells
})

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function cloneDate(date: Date | null | undefined) {
  return date ? new Date(date.getTime()) : null
}

function sameDate(a: Date | null | undefined, b: Date) {
  return !!a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function makeCell(year: number, month: number, day: number, current: boolean): CalendarCell {
  const date = new Date(year, month - 1, day, pickedHour.value, pickedMinute.value, pickedSecond.value)
  const today = new Date()
  return {
    day,
    current,
    isToday: sameDate(today, date),
    isSelected: sameDate(draft.value, date),
    disabled: props.disabledDate ? props.disabledDate(date) : false,
    date,
  }
}

function syncTimeFromDate(date: Date | null) {
  pickedHour.value = date?.getHours() ?? 0
  pickedMinute.value = date?.getMinutes() ?? 0
  pickedSecond.value = date?.getSeconds() ?? 0
}

function syncInputFromModel() {
  const value = parseDateTimeValue(modelValue.value, valueFormat.value)
  inputText.value = value ? formatDateTime(value, props.format) : ''
}

function syncInputFromDraft() {
  inputText.value = draft.value ? formatDateTime(draft.value, props.format) : ''
}

function applyInputText(value: string) {
  const parsed = parseDateTime(value, props.format)
  if (!parsed) return null
  if (props.disabledDate?.(parsed)) return null
  draft.value = parsed
  syncTimeFromDate(parsed)
  viewYear.value = parsed.getFullYear()
  viewMonth.value = parsed.getMonth() + 1
  showYearPicker.value = false
  return parsed
}

function formatModelValue(date: Date): DateTimeValue {
  if (props.valueFormat) return formatDateTime(date, props.valueFormat)
  return new Date(date.getTime())
}

function openPanel() {
  if (props.disabled || props.readonly) return
  const value = parseDateTimeValue(modelValue.value, valueFormat.value)
  draft.value = cloneDate(value)
  syncTimeFromDate(value)
  if (value) {
    viewYear.value = value.getFullYear()
    viewMonth.value = value.getMonth() + 1
  }
  syncInputFromDraft()
  inputDirty.value = false
  showYearPicker.value = false
  currentZIndex.value = nextZIndex()
  open.value = true
}

function onTriggerClick() {
  if (props.disabled || props.readonly) return
  if (!open.value) openPanel()
  nextTick(() => inputRef.value?.focus())
}

function onInputFocus() {
  if (props.disabled || props.readonly) return
  inputFocused.value = true
  if (!open.value) openPanel()
}

function onInput(e: Event) {
  if (props.disabled || props.readonly) return
  inputText.value = (e.target as HTMLInputElement).value
  inputDirty.value = true
  applyInputText(inputText.value)
}

function onInputBlur() {
  inputFocused.value = false
  if (!inputDirty.value) return
  applyInputText(inputText.value)
  syncInputFromDraft()
  inputDirty.value = false
}

function onClear() {
  if (props.disabled || props.readonly) return
  modelValue.value = null
  draft.value = null
  inputText.value = ''
  inputDirty.value = false
  emit('change', null)
}

function onCellClick(cell: CalendarCell) {
  if (props.disabled || props.readonly) return
  if (cell.disabled) return
  if (!cell.current) {
    viewYear.value = cell.date.getFullYear()
    viewMonth.value = cell.date.getMonth() + 1
    return
  }
  draft.value = new Date(
    cell.date.getFullYear(),
    cell.date.getMonth(),
    cell.date.getDate(),
    pickedHour.value,
    pickedMinute.value,
    pickedSecond.value,
  )
  syncInputFromDraft()
}

function setTime(unit: 'hour' | 'minute' | 'second', value: number) {
  if (props.disabled || props.readonly) return
  if (unit === 'hour') pickedHour.value = value
  if (unit === 'minute') pickedMinute.value = value
  if (unit === 'second') pickedSecond.value = value
  const base = draft.value ?? new Date(viewYear.value, viewMonth.value - 1, 1)
  draft.value = new Date(
    base.getFullYear(),
    base.getMonth(),
    base.getDate(),
    pickedHour.value,
    pickedMinute.value,
    pickedSecond.value,
  )
  syncInputFromDraft()
}

function onNow() {
  if (props.disabled || props.readonly) return
  const value = new Date()
  draft.value = value
  syncTimeFromDate(value)
  viewYear.value = value.getFullYear()
  viewMonth.value = value.getMonth() + 1
  syncInputFromDraft()
}

function onConfirm() {
  if (props.disabled || props.readonly) return
  if (inputDirty.value) {
    if (!applyInputText(inputText.value)) return
    inputDirty.value = false
  }
  if (!draft.value) return
  modelValue.value = formatModelValue(draft.value)
  emit('change', modelValue.value ?? null)
  syncInputFromDraft()
  open.value = false
}

function confirmFromInput() {
  if (!open.value) openPanel()
  onConfirm()
}

function prevMonth() {
  if (viewMonth.value === 1) {
    viewYear.value--
    viewMonth.value = 12
  } else viewMonth.value--
}

function nextMonth() {
  if (viewMonth.value === 12) {
    viewYear.value++
    viewMonth.value = 1
  } else viewMonth.value++
}

function prevYear() {
  viewYear.value--
}

function nextYear() {
  viewYear.value++
}

function selectYear(y: number) {
  viewYear.value = y
  showYearPicker.value = false
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

  if (spaceBelow >= panelRect.height || spaceBelow >= spaceAbove) {
    panelRef.value.style.top = `${triggerRect.bottom + gap}px`
    panelRef.value.style.bottom = ''
  } else {
    panelRef.value.style.bottom = `${vh - triggerRect.top + gap}px`
    panelRef.value.style.top = ''
  }

  let left = triggerRect.left
  if (left + panelRect.width > vw - margin) {
    left = triggerRect.right - panelRect.width
    if (left < margin) left = margin
  }
  if (left < margin) left = margin
  panelRef.value.style.left = `${left}px`
}

watch(open, async (val) => {
  if (val) {
    await nextTick()
    repositionPanel()
  } else {
    inputDirty.value = false
    syncInputFromModel()
  }
})

watch(() => [modelValue.value, props.format, props.valueFormat], syncInputFromModel, { immediate: true })

watch(
  () => [props.disabled, props.readonly],
  ([disabled, readonly]) => {
    if (disabled || readonly) open.value = false
  },
)

function onClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!open.value || triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
  open.value = false
}

function onReposition() {
  if (open.value) {
    repositionPanel()
  }
}

function onKeydown(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') open.value = false
  if (e.key === 'Enter') onConfirm()
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

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<style lang="less">
.yiz-datetime-picker {
  display: flex;
}

.yiz-datetime-picker-input {
  display: inline-flex;
  align-items: center;
  width: 100%;
  position: relative;
  height: 32px;
  padding: 0 11px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-base-border-radius-default);
  background: #fff;
  box-sizing: border-box;
  gap: 4px;

  input {
    flex: 1;
    min-width: 0;
    height: 100%;
    border: none;
    outline: none;
    box-sizing: border-box;
    background: transparent;
    font-size: var(--yiz-font-size-default);
    cursor: text;
  }
}

.yiz-datetime-picker-open .yiz-datetime-picker-input {
  border-color: var(--yiz-color-primary);
  box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
}

.yiz-datetime-picker-disabled .yiz-datetime-picker-input {
  background: #f5f5f5;
  cursor: not-allowed;
}

.yiz-datetime-picker-small .yiz-datetime-picker-input {
  height: 24px;
  border-radius: var(--yiz-base-border-radius-small);
  input {
    font-size: var(--yiz-font-size-small);
  }
}

.yiz-datetime-picker-large .yiz-datetime-picker-input {
  height: 40px;
  border-radius: var(--yiz-base-border-radius-large);
  input {
    font-size: var(--yiz-font-size-large);
  }
}

.yiz-datetime-picker-clear {
  position: absolute;
  right: 11px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  transition: color 0.3s;
  z-index: 1;

  &:hover {
    color: rgba(0, 0, 0, 0.88);
  }
}

.yiz-datetime-picker-suffix {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: #999;
  transition: opacity 0.2s;
}

.yiz-datetime-picker-suffix--hidden {
  opacity: 0;
}

.yiz-datetime-picker-panel {
  position: fixed;
  width: 448px;
  background: #fff;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-pane-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  user-select: none;
  font-size: 14px;
}

.yiz-datetime-picker-content {
  display: flex;
  align-items: stretch;
}

.yiz-datetime-picker-date-panel {
  width: 280px;
  padding: 8px 12px;
  box-sizing: border-box;
}

.yiz-datetime-picker-header {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 8px;
  height: 24px;
}

.yiz-datetime-picker-nav {
  cursor: pointer;
  color: #666;
  border-radius: 2px;
  flex-shrink: 0;
  transition:
    color 0.2s,
    background 0.2s;
}

.yiz-datetime-picker-nav:hover {
  color: var(--yiz-color-primary);
  background: var(--yiz-color-hover-bg);
}

.yiz-datetime-picker-month-year {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  padding: 2px 0;
  border-radius: var(--yiz-pane-item-border-radius);
  transition: background 0.2s;
}

.yiz-datetime-picker-month-year:hover {
  background: var(--yiz-color-hover-bg);
}

.yiz-datetime-picker-year-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
}

.yiz-datetime-picker-year-item {
  padding: 6px 0;
  text-align: center;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  border-radius: var(--yiz-pane-item-border-radius);
  transition:
    background 0.2s,
    color 0.2s;
}

.yiz-datetime-picker-year-item:hover {
  background: var(--yiz-color-hover-bg);
}

.yiz-datetime-picker-year-item-active,
.yiz-datetime-picker-year-item-active:hover {
  color: var(--yiz-color-primary);
  background: var(--yiz-color-primary-light8);
  font-weight: 600;
}

.yiz-datetime-picker-weekdays,
.yiz-datetime-picker-dates {
  display: flex;
  flex-wrap: wrap;
}

.yiz-datetime-picker-weekdays {
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  padding-bottom: 4px;
  margin-bottom: 4px;
}

.yiz-datetime-picker-weekday,
.yiz-datetime-picker-cell {
  width: calc(100% / 7);
  text-align: center;
}

.yiz-datetime-picker-weekday {
  height: 28px;
  line-height: 28px;
  color: #999;
  font-size: 12px;
  font-weight: 600;
}

.yiz-datetime-picker-cell {
  padding: 1px 0;
  cursor: pointer;
}

.yiz-datetime-picker-cell-inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 13px;
  color: #333;
  border-radius: var(--yiz-pane-item-border-radius);
  transition:
    background 0.2s,
    color 0.2s;
}

.yiz-datetime-picker-cell-inner:hover {
  background: var(--yiz-color-hover-bg);
}

.yiz-datetime-picker-cell-other .yiz-datetime-picker-cell-inner,
.yiz-datetime-picker-cell-disabled .yiz-datetime-picker-cell-inner {
  color: #d9d9d9;
}

.yiz-datetime-picker-cell-today .yiz-datetime-picker-cell-inner {
  color: var(--yiz-color-primary);
  font-weight: 600;
}

.yiz-datetime-picker-cell-selected .yiz-datetime-picker-cell-inner,
.yiz-datetime-picker-cell-selected .yiz-datetime-picker-cell-inner:hover {
  background: var(--yiz-color-primary);
  color: #fff;
}

.yiz-datetime-picker-time {
  display: flex;
  width: 168px;
  padding: 8px;
  gap: 4px;
  border-left: 1px solid var(--yiz-color-border, #d9d9d9);
  box-sizing: border-box;
}

.yiz-datetime-picker-time-col {
  flex: 1;
  min-width: 0;
}

.yiz-datetime-picker-time-title {
  text-align: center;
  color: #999;
  font-size: 12px;
  padding: 4px 0;
}

.yiz-datetime-picker-time-list {
  height: 236px;
  overflow-y: auto;
  scrollbar-width: none;
}

.yiz-datetime-picker-time-list::-webkit-scrollbar {
  display: none;
}

.yiz-datetime-picker-time-item {
  text-align: center;
  padding: 6px 0;
  font-size: 14px;
  color: #666;
  border-radius: var(--yiz-pane-item-border-radius);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}

.yiz-datetime-picker-time-item:hover {
  background: var(--yiz-color-hover-bg);
}

.yiz-datetime-picker-time-item-active,
.yiz-datetime-picker-time-item-active:hover {
  color: var(--yiz-color-primary);
  background: var(--yiz-color-primary-light8);
  font-weight: 600;
}

.yiz-datetime-picker-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-datetime-picker-panel-fade-enter-active,
.yiz-datetime-picker-panel-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.yiz-datetime-picker-panel-fade-enter-from,
.yiz-datetime-picker-panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.yiz-datetime-picker-clear-zoom-enter-active,
.yiz-datetime-picker-clear-zoom-leave-active {
  transition:
    transform 0.2s,
    opacity 0.2s;
}

.yiz-datetime-picker-clear-zoom-enter-from,
.yiz-datetime-picker-clear-zoom-leave-to {
  transform: translateY(-50%) scale(0);
  opacity: 0;
}

.yiz-datetime-picker-readonly .yiz-datetime-picker-input,
.yiz-datetime-picker-readonly .yiz-datetime-picker-input input {
  cursor: default;
}
</style>
