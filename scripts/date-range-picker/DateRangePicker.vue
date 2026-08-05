<template>
  <div
    ref="triggerRef"
    class="yiz-date-range-picker"
    :class="vClass"
    @click="onTriggerClick"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    v-bind="$attrs"
  >
    <div class="yiz-date-range-picker-input">
      <span class="yiz-date-range-picker-prefix" v-if="$props.prefix || $slots.prefix">
        <template v-if="$props.prefix">{{ $props.prefix }}</template>
        <slot v-else name="prefix" />
      </span>
      <input
        ref="startInputRef"
        class="yiz-date-range-picker-segment"
        :class="{ 'yiz-date-range-picker-segment-active': open && activeSide === 'start' }"
        :value="startInputText"
        :placeholder="startPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        @click.stop="onSegmentClick('start')"
        @focus="onInputFocus('start')"
        @input="onInput('start', $event)"
        @blur="onInputBlur('start')"
        @keydown.enter.prevent.stop="confirmFromInput('start')"
      />
      <span class="yiz-date-range-picker-separator">
        <slot name="separator">
          <Icon v-if="separator === '-'" size="16" :icon="ArrowRight16Regular" />
          <template v-else>{{ separator }}</template>
        </slot>
      </span>
      <input
        ref="endInputRef"
        class="yiz-date-range-picker-segment"
        :class="{ 'yiz-date-range-picker-segment-active': open && activeSide === 'end' }"
        :value="endInputText"
        :placeholder="endPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        @click.stop="onSegmentClick('end')"
        @focus="onInputFocus('end')"
        @input="onInput('end', $event)"
        @blur="onInputBlur('end')"
        @keydown.enter.prevent.stop="confirmFromInput('end')"
      />
      <Transition name="yiz-date-range-picker-clear-zoom">
        <span
          v-if="clearable && (startModel != null || endModel != null) && !disabled && !readonly && (isHovering || open)"
          class="yiz-date-range-picker-clear"
          @click.stop="onClear"
        >
          <Icon size="16" :icon="DismissCircle16Filled" />
        </span>
      </Transition>
      <span class="yiz-date-range-picker-extra-suffix" v-if="$props.suffix || $slots.suffix">
        <template v-if="$props.suffix">{{ $props.suffix }}</template>
        <slot v-else name="suffix" />
      </span>
      <Icon
        :class="{
          'yiz-date-range-picker-suffix--hidden':
            clearable && (startModel != null || endModel != null) && !disabled && !readonly && (isHovering || open),
        }"
        class="yiz-date-range-picker-suffix"
        size="16"
        :icon="CalendarLtr16Regular"
      />
    </div>
  </div>

  <Teleport to="body">
    <Transition name="yiz-date-range-picker-panel-fade">
      <div v-if="open" ref="panelRef" class="yiz-date-range-picker-panel" :style="panelStyle" @click.stop>
        <div class="yiz-date-range-picker-panels">
          <div
            class="yiz-date-range-picker-side"
            :class="{ 'yiz-date-range-picker-side-active': activeSide === 'start' }"
          >
            <div class="yiz-date-range-picker-header">
              <Icon
                class="yiz-date-range-picker-nav"
                size="16"
                :icon="ChevronDoubleLeft16Regular"
                @click="shiftYear('start', -1)"
              />
              <Icon
                class="yiz-date-range-picker-nav"
                size="16"
                :icon="ChevronLeft16Regular"
                @click="shiftMonth('start', -1)"
              />
              <span class="yiz-date-range-picker-month-year" @click="startShowYearPicker = !startShowYearPicker">
                {{ startViewYear }}-{{ pad(startViewMonth) }}
              </span>
              <Icon
                class="yiz-date-range-picker-nav"
                size="16"
                :icon="ChevronRight16Regular"
                @click="shiftMonth('start', 1)"
              />
              <Icon
                class="yiz-date-range-picker-nav"
                size="16"
                :icon="ChevronDoubleRight16Regular"
                @click="shiftYear('start', 1)"
              />
            </div>
            <div v-if="startShowYearPicker" class="yiz-date-range-picker-year-grid">
              <div
                v-for="y in startYearRange"
                :key="y"
                class="yiz-date-range-picker-year-item"
                :class="{ 'yiz-date-range-picker-year-item-active': y === startViewYear }"
                @click="selectYear('start', y)"
              >
                {{ y }}
              </div>
            </div>
            <DateRangeCalendar
              v-else
              :cells="startCalendarCells"
              :week-days="weekDays"
              @select="onCellClick('start', $event)"
            />
          </div>

          <div
            class="yiz-date-range-picker-side"
            :class="{ 'yiz-date-range-picker-side-active': activeSide === 'end' }"
          >
            <div class="yiz-date-range-picker-header">
              <Icon
                class="yiz-date-range-picker-nav"
                size="16"
                :icon="ChevronDoubleLeft16Regular"
                @click="shiftYear('end', -1)"
              />
              <Icon
                class="yiz-date-range-picker-nav"
                size="16"
                :icon="ChevronLeft16Regular"
                @click="shiftMonth('end', -1)"
              />
              <span class="yiz-date-range-picker-month-year" @click="endShowYearPicker = !endShowYearPicker">
                {{ endViewYear }}-{{ pad(endViewMonth) }}
              </span>
              <Icon
                class="yiz-date-range-picker-nav"
                size="16"
                :icon="ChevronRight16Regular"
                @click="shiftMonth('end', 1)"
              />
              <Icon
                class="yiz-date-range-picker-nav"
                size="16"
                :icon="ChevronDoubleRight16Regular"
                @click="shiftYear('end', 1)"
              />
            </div>
            <div v-if="endShowYearPicker" class="yiz-date-range-picker-year-grid">
              <div
                v-for="y in endYearRange"
                :key="y"
                class="yiz-date-range-picker-year-item"
                :class="{ 'yiz-date-range-picker-year-item-active': y === endViewYear }"
                @click="selectYear('end', y)"
              >
                {{ y }}
              </div>
            </div>
            <DateRangeCalendar
              v-else
              :cells="endCalendarCells"
              :week-days="weekDays"
              @select="onCellClick('end', $event)"
            />
          </div>
        </div>

        <div class="yiz-date-range-picker-footer">
          <LinkButton @click="onToday">{{ $t('datePicker.today') }}</LinkButton>
          <Button type="primary" size="small" :disabled="confirmDisabled" @click="onConfirm">{{
            $t('common.confirm')
          }}</Button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref, watch, type PropType } from 'vue'
import {
  ArrowRight16Regular,
  CalendarLtr16Regular,
  ChevronDoubleLeft16Regular,
  ChevronDoubleRight16Regular,
  ChevronLeft16Regular,
  ChevronRight16Regular,
  DismissCircle16Filled,
} from '@vicons/fluent'
import Button from '../button/Button.vue'
import { Icon } from '../icon'
import { useInputStyleMode } from '../input-style'
import LinkButton from '../link-button/LinkButton.vue'
import { $t, $tList } from '../locale'
import { useOverlayElement } from '../overlay/overlayScope'
import { nextZIndex } from '../zIndex'

defineSlots<{
  prefix: unknown
  separator: unknown
  suffix: unknown
}>()

type DateRangeSide = 'start' | 'end'
type DateRangeValue = Date | string | null

interface CalendarCell {
  day: number
  current: boolean
  isToday: boolean
  isSelected: boolean
  disabled: boolean
  date: Date
}

const DateRangeCalendar = defineComponent({
  props: {
    cells: { type: Array as PropType<CalendarCell[]>, required: true },
    weekDays: { type: Array as PropType<string[]>, required: true },
  },
  emits: {
    select: (_cell: CalendarCell) => true,
  },
  setup(calendarProps, { emit }) {
    return () =>
      h('div', { class: 'yiz-date-range-picker-body' }, [
        h(
          'div',
          { class: 'yiz-date-range-picker-weekdays' },
          calendarProps.weekDays.map((day) => h('span', { class: 'yiz-date-range-picker-weekday' }, day)),
        ),
        h(
          'div',
          { class: 'yiz-date-range-picker-dates' },
          calendarProps.cells.map((cell, idx) =>
            h(
              'div',
              {
                key: idx,
                class: {
                  'yiz-date-range-picker-cell': true,
                  'yiz-date-range-picker-cell-other': !cell.current,
                  'yiz-date-range-picker-cell-today': cell.isToday,
                  'yiz-date-range-picker-cell-selected': cell.isSelected,
                  'yiz-date-range-picker-cell-disabled': cell.disabled,
                },
                onClick: () => emit('select', cell),
              },
              [h('span', { class: 'yiz-date-range-picker-cell-inner' }, cell.day)],
            ),
          ),
        ),
      ])
  },
})

const startModel = defineModel<DateRangeValue>('start')
const endModel = defineModel<DateRangeValue>('end')

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    forceRange?: boolean
    autoSort?: boolean
    size?: 'small' | 'default' | 'large'
    styleMode?: 'outlined' | 'filled'
    disabledDate?: (date: Date) => boolean
    format?: string
    startValueFormat?: string
    endValueFormat?: string
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
    readonly: false,
    clearable: false,
    forceRange: false,
    autoSort: true,
    size: 'default',
    styleMode: 'outlined',
    format: 'YYYY-MM-DD',
    separator: '-',
  },
)

const emit = defineEmits<{
  change: [start: DateRangeValue, end: DateRangeValue]
}>()

const now = new Date()
const open = ref(false)
const isHovering = ref(false)
const activeSide = ref<DateRangeSide>('start')
const currentZIndex = ref(0)
const triggerRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
useOverlayElement(panelRef, open)
const startInputRef = ref<HTMLInputElement>()
const endInputRef = ref<HTMLInputElement>()
const draftStart = ref<Date | null>(null)
const draftEnd = ref<Date | null>(null)
const startInputFocused = ref(false)
const endInputFocused = ref(false)
const startInputDirty = ref(false)
const endInputDirty = ref(false)
const startInputText = ref('')
const endInputText = ref('')
const startViewYear = ref(now.getFullYear())
const startViewMonth = ref(now.getMonth() + 1)
const endViewYear = ref(now.getFullYear())
const endViewMonth = ref(now.getMonth() + 1)
const startShowYearPicker = ref(false)
const endShowYearPicker = ref(false)
const dropdownPos = ref<{ top?: string; bottom?: string; left?: string }>({})

const weekDays = computed(() => $tList('datePicker.weekdays'))

const startPlaceholder = computed(() => props.startPlaceholder ?? $t('dateRangePicker.startPlaceholder'))
const endPlaceholder = computed(() => props.endPlaceholder ?? $t('dateRangePicker.endPlaceholder'))
const separator = computed(() => props.separator)
const disabled = computed(() => props.disabled)
const clearable = computed(() => props.clearable)
const confirmDisabled = computed(() => props.forceRange && (draftStart.value == null || draftEnd.value == null))

const panelStyle = computed(() => ({
  zIndex: currentZIndex.value + 1,
  ...dropdownPos.value,
}))

const mergedStyleMode = useInputStyleMode(() => props.styleMode)

const vClass = computed(() => ({
  [`yiz-date-range-picker-${mergedStyleMode.value}`]: true,
  'yiz-date-range-picker-open': open.value,
  'yiz-date-range-picker-disabled': props.disabled,
  'yiz-date-range-picker-readonly': props.readonly,
  'yiz-date-range-picker-small': props.size === 'small',
  'yiz-date-range-picker-large': props.size === 'large',
}))

const startYearRange = computed(() => makeYearRange(startViewYear.value))
const endYearRange = computed(() => makeYearRange(endViewYear.value))
const startCalendarCells = computed(() => makeCalendarCells('start', startViewYear.value, startViewMonth.value))
const endCalendarCells = computed(() => makeCalendarCells('end', endViewYear.value, endViewMonth.value))

watch(open, async (val) => {
  if (val) {
    await nextTick()
    repositionPanel()
  } else {
    startInputDirty.value = false
    endInputDirty.value = false
    syncInputTextFromModel()
  }
})

watch(
  () => [startModel.value, endModel.value, props.format, props.startValueFormat, props.endValueFormat],
  () => {
    if (!open.value && !startInputFocused.value && !endInputFocused.value) {
      syncInputTextFromModel()
    }
  },
  { immediate: true },
)

watch(
  () => [props.disabled, props.readonly],
  ([disabled, readonly]) => {
    if (disabled || readonly) open.value = false
  },
)

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

function sameDate(a: Date | null | undefined, b: Date) {
  return !!a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function cloneDate(date: Date | null | undefined) {
  return date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : null
}

function formatDate(date: Date, fmt: string): string {
  const map: Record<string, string> = {
    YYYY: `${date.getFullYear()}`,
    yyyy: `${date.getFullYear()}`,
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    dd: pad(date.getDate()),
    M: `${date.getMonth() + 1}`,
    D: `${date.getDate()}`,
    d: `${date.getDate()}`,
  }
  return fmt.replace(/YYYY|yyyy|MM|DD|dd|M|D|d/g, (key) => map[key] || key)
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parseDate(value: string, fmt: string): Date | null {
  const tokenPattern = /YYYY|yyyy|MM|DD|dd|M|D|d/g
  const tokenMap: Record<string, string> = {
    YYYY: '(\\d{4})',
    yyyy: '(\\d{4})',
    MM: '(\\d{2})',
    M: '(\\d{1,2})',
    DD: '(\\d{2})',
    dd: '(\\d{2})',
    D: '(\\d{1,2})',
    d: '(\\d{1,2})',
  }
  const tokens: string[] = []
  let pattern = ''
  let lastIndex = 0
  for (const match of fmt.matchAll(tokenPattern)) {
    pattern += escapeRegExp(fmt.slice(lastIndex, match.index))
    pattern += tokenMap[match[0]]
    tokens.push(match[0])
    lastIndex = (match.index ?? 0) + match[0].length
  }
  pattern += escapeRegExp(fmt.slice(lastIndex))

  const matched = new RegExp(`^${pattern}$`).exec(value)
  if (!matched) return null

  let year: number | null = null
  let month: number | null = null
  let day: number | null = null
  tokens.forEach((token, index) => {
    const num = Number(matched[index + 1])
    if (token === 'YYYY' || token === 'yyyy') year = num
    if (token === 'MM' || token === 'M') month = num
    if (token === 'DD' || token === 'dd' || token === 'D' || token === 'd') day = num
  })
  if (year == null || month == null || day == null) return null

  const date = new Date(year, month - 1, day)
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null
  return date
}

function getValueFormat(side: DateRangeSide) {
  return (side === 'start' ? props.startValueFormat : props.endValueFormat) ?? props.format
}

function parseModelValue(side: DateRangeSide, value: DateRangeValue | undefined): Date | null {
  if (value == null) return null
  if (value instanceof Date) return cloneDate(value)
  return parseDate(value, getValueFormat(side))
}

function formatModelValue(side: DateRangeSide, date: Date | null): DateRangeValue {
  if (!date) return null
  const valueFormat = side === 'start' ? props.startValueFormat : props.endValueFormat
  if (valueFormat) return formatDate(date, valueFormat)
  return cloneDate(date)
}

function formatInputText(side: DateRangeSide, date: Date | null): string {
  return date ? formatDate(date, props.format) : ''
}

function getDraft(side: DateRangeSide) {
  return side === 'start' ? draftStart.value : draftEnd.value
}

function setDraft(side: DateRangeSide, date: Date | null) {
  if (side === 'start') {
    draftStart.value = cloneDate(date)
  } else {
    draftEnd.value = cloneDate(date)
  }
}

function setInputText(side: DateRangeSide, value: string) {
  if (side === 'start') {
    startInputText.value = value
  } else {
    endInputText.value = value
  }
}

function getInputText(side: DateRangeSide) {
  return side === 'start' ? startInputText.value : endInputText.value
}

function setInputDirty(side: DateRangeSide, dirty: boolean) {
  if (side === 'start') {
    startInputDirty.value = dirty
  } else {
    endInputDirty.value = dirty
  }
}

function isInputDirty(side: DateRangeSide) {
  return side === 'start' ? startInputDirty.value : endInputDirty.value
}

function parseInputText(side: DateRangeSide, value: string): Date | null {
  const parsed = parseDate(value, props.format)
  if (!parsed) return null
  if (props.disabledDate?.(parsed)) return null
  return parsed
}

function syncInputTextFromDraft(side: DateRangeSide) {
  setInputText(side, formatInputText(side, getDraft(side)))
}

function syncInputTextFromModel() {
  startInputText.value = formatInputText('start', parseModelValue('start', startModel.value))
  endInputText.value = formatInputText('end', parseModelValue('end', endModel.value))
}

function applyInputText(side: DateRangeSide, value: string): Date | null {
  const parsed = parseInputText(side, value)
  if (!parsed) return null
  setDraft(side, parsed)
  setView(side, parsed.getFullYear(), parsed.getMonth() + 1)
  activeSide.value = side
  if (side === 'start') {
    startShowYearPicker.value = false
  } else {
    endShowYearPicker.value = false
  }
  return parsed
}

function makeYearRange(year: number) {
  const result: number[] = []
  const start = year - 6
  for (let i = 0; i < 12; i++) {
    result.push(start + i)
  }
  return result
}

function makeCalendarCells(side: DateRangeSide, year: number, month: number): CalendarCell[] {
  const cells: CalendarCell[] = []
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const daysInMonth = lastDay.getDate()
  const startWeekDay = firstDay.getDay()
  const prevLastDay = new Date(year, month - 1, 0)
  const prevDays = prevLastDay.getDate()

  for (let i = startWeekDay - 1; i >= 0; i--) {
    cells.push(makeCell(side, year, month - 1, prevDays - i, false))
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(makeCell(side, year, month, day, true))
  }
  const remaining = 42 - cells.length
  for (let day = 1; day <= remaining; day++) {
    cells.push(makeCell(side, year, month + 1, day, false))
  }
  return cells
}

function makeCell(side: DateRangeSide, year: number, month: number, day: number, current: boolean): CalendarCell {
  const date = new Date(year, month - 1, day)
  const today = new Date()
  const selected = side === 'start' ? draftStart.value : draftEnd.value
  return {
    day,
    current,
    isToday: sameDate(today, date),
    isSelected: sameDate(selected, date),
    disabled: props.disabledDate ? props.disabledDate(date) : false,
    date,
  }
}

function syncViewFromDraft() {
  const start = draftStart.value ?? now
  const end = draftEnd.value ?? draftStart.value ?? now
  startViewYear.value = start.getFullYear()
  startViewMonth.value = start.getMonth() + 1
  endViewYear.value = end.getFullYear()
  endViewMonth.value = end.getMonth() + 1
}

function openPanel(side: DateRangeSide) {
  if (props.disabled || props.readonly) return
  activeSide.value = side
  draftStart.value = parseModelValue('start', startModel.value)
  draftEnd.value = parseModelValue('end', endModel.value)
  startShowYearPicker.value = false
  endShowYearPicker.value = false
  syncViewFromDraft()
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

function onSegmentClick(side: DateRangeSide) {
  if (props.disabled || props.readonly) return
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
}

function onInputFocus(side: DateRangeSide) {
  if (props.disabled || props.readonly) return
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

function onInput(side: DateRangeSide, e: Event) {
  if (props.disabled || props.readonly) return
  const value = (e.target as HTMLInputElement).value
  setInputText(side, value)
  setInputDirty(side, true)
  applyInputText(side, value)
}

function onInputBlur(side: DateRangeSide) {
  if (side === 'start') {
    startInputFocused.value = false
  } else {
    endInputFocused.value = false
  }
  if (!isInputDirty(side)) return

  applyInputText(side, getInputText(side))
  syncInputTextFromDraft(side)
  setInputDirty(side, false)
}

function onCellClick(side: DateRangeSide, cell: CalendarCell) {
  if (props.disabled || props.readonly) return
  if (cell.disabled) return
  activeSide.value = side
  if (!cell.current) {
    setView(side, cell.date.getFullYear(), cell.date.getMonth() + 1)
    return
  }
  if (side === 'start') {
    draftStart.value = cloneDate(cell.date)
    syncInputTextFromDraft('start')
    startInputDirty.value = false
  } else {
    draftEnd.value = cloneDate(cell.date)
    syncInputTextFromDraft('end')
    endInputDirty.value = false
  }
}

function onToday() {
  if (props.disabled || props.readonly) return
  const today = new Date()
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  if (activeSide.value === 'start') {
    draftStart.value = date
    setView('start', date.getFullYear(), date.getMonth() + 1)
    syncInputTextFromDraft('start')
    startInputDirty.value = false
  } else {
    draftEnd.value = date
    setView('end', date.getFullYear(), date.getMonth() + 1)
    syncInputTextFromDraft('end')
    endInputDirty.value = false
  }
}

function onConfirm() {
  if (props.disabled || props.readonly) return
  if (startInputDirty.value) {
    if (!applyInputText('start', startInputText.value)) return
    startInputDirty.value = false
  }
  if (endInputDirty.value) {
    if (!applyInputText('end', endInputText.value)) return
    endInputDirty.value = false
  }
  if (confirmDisabled.value) return
  let nextStart = cloneDate(draftStart.value)
  let nextEnd = cloneDate(draftEnd.value)
  if (props.autoSort && nextStart && nextEnd && nextEnd.getTime() < nextStart.getTime()) {
    const temp = nextStart
    nextStart = nextEnd
    nextEnd = temp
  }
  startModel.value = formatModelValue('start', nextStart)
  endModel.value = formatModelValue('end', nextEnd)
  emit('change', startModel.value ?? null, endModel.value ?? null)
  syncInputTextFromDraft('start')
  syncInputTextFromDraft('end')
  open.value = false
}

function confirmFromInput(side: DateRangeSide) {
  if (!open.value) {
    openPanel(side)
  }
  onConfirm()
}

function onClear() {
  if (props.disabled || props.readonly) return
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

function setView(side: DateRangeSide, year: number, month: number) {
  if (side === 'start') {
    startViewYear.value = year
    startViewMonth.value = month
  } else {
    endViewYear.value = year
    endViewMonth.value = month
  }
}

function shiftMonth(side: DateRangeSide, offset: number) {
  const year = side === 'start' ? startViewYear.value : endViewYear.value
  const month = side === 'start' ? startViewMonth.value : endViewMonth.value
  const next = new Date(year, month - 1 + offset, 1)
  setView(side, next.getFullYear(), next.getMonth() + 1)
}

function shiftYear(side: DateRangeSide, offset: number) {
  if (side === 'start') {
    startViewYear.value += offset
  } else {
    endViewYear.value += offset
  }
}

function selectYear(side: DateRangeSide, year: number) {
  if (side === 'start') {
    startViewYear.value = year
    startShowYearPicker.value = false
  } else {
    endViewYear.value = year
    endShowYearPicker.value = false
  }
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

defineExpose({
  focus: (side: 'start' | 'end' = 'start') => {
    const inputRef = side === 'start' ? startInputRef : endInputRef
    inputRef.value?.focus()
  },
  blur: () => {
    startInputRef.value?.blur()
    endInputRef.value?.blur()
  },
})
</script>

<style lang="less">
.yiz-date-range-picker {
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}

.yiz-date-range-picker-input {
  display: inline-flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  width: 100%;
  position: relative;
  height: var(--yiz-control-height-default);
  padding: 0 8px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-base-border-radius-default);
  background: var(--yiz-color-bg-container);
  cursor: pointer;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  box-sizing: border-box;
  gap: 4px;
  font-size: var(--yiz-font-size-default);
}

.yiz-date-range-picker:not(.yiz-date-range-picker-disabled) .yiz-date-range-picker-input:hover {
  border-color: var(--yiz-color-primary);
}

.yiz-date-range-picker-open .yiz-date-range-picker-input {
  border-color: var(--yiz-color-primary);
  box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
}

.yiz-form-item-error-status .yiz-date-range-picker:not(.yiz-date-range-picker-disabled) .yiz-date-range-picker-input {
  border-color: var(--yiz-color-error);
}

.yiz-form-item-error-status
  .yiz-date-range-picker:not(.yiz-date-range-picker-disabled)
  .yiz-date-range-picker-input:hover {
  border-color: var(--yiz-color-error);
}

.yiz-form-item-error-status
  .yiz-date-range-picker-open:not(.yiz-date-range-picker-disabled)
  .yiz-date-range-picker-input {
  border-color: var(--yiz-color-error);
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
}

.yiz-date-range-picker-disabled .yiz-date-range-picker-input {
  background: var(--yiz-color-bg-muted);
  cursor: not-allowed;
}

.yiz-date-range-picker-segment {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 4px;
  border: none;
  outline: none;
  box-sizing: border-box;
  border-radius: 3px;
  background: transparent;
  color: var(--yiz-color-text-primary);
  cursor: text;
  font: inherit;
  text-align: center;
  appearance: none;
  transition:
    background 0.2s,
    color 0.2s;

  &::placeholder {
    color: var(--yiz-color-text-disabled);
  }
}

.yiz-date-range-picker-segment:disabled {
  color: var(--yiz-color-text-disabled);
  cursor: not-allowed;
}

.yiz-date-range-picker-placeholder {
  color: var(--yiz-color-text-disabled);
}

.yiz-date-range-picker-separator {
  display: inline-flex;
  align-items: center;
  color: var(--yiz-color-text-tertiary);
  flex-shrink: 0;
}

.yiz-date-range-picker-clear,
.yiz-date-range-picker-suffix {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  color: var(--yiz-color-text-tertiary);
}

.yiz-date-range-picker-suffix {
  transition: opacity 0.2s;
}

.yiz-date-range-picker-suffix--hidden {
  opacity: 0;
}

.yiz-date-range-picker-prefix,
.yiz-date-range-picker-extra-suffix {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  color: var(--yiz-color-text-secondary);
  user-select: none;
}

.yiz-date-range-picker-clear {
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

.yiz-date-range-picker-clear:hover {
  color: rgba(0, 0, 0, 0.88);
}

.yiz-date-range-picker-small .yiz-date-range-picker-input {
  height: var(--yiz-control-height-small);
  border-radius: var(--yiz-base-border-radius-small);
  font-size: var(--yiz-font-size-small);
}

.yiz-date-range-picker-large .yiz-date-range-picker-input {
  height: var(--yiz-control-height-large);
  border-radius: var(--yiz-base-border-radius-large);
  font-size: var(--yiz-font-size-large);
}

.yiz-date-range-picker-panel {
  position: fixed;
  width: 560px;
  background: var(--yiz-color-bg-elevated);
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-pane-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  user-select: none;
}

.yiz-date-range-picker-panels {
  display: flex;
  align-items: stretch;
}

.yiz-date-range-picker-side {
  width: 50%;
  min-width: 0;
  flex: 0 0 50%;
  padding: 8px 12px;
  box-sizing: border-box;
}

.yiz-date-range-picker-side + .yiz-date-range-picker-side {
  border-left: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-date-range-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 2px;
}

.yiz-date-range-picker-nav {
  cursor: pointer;
  color: var(--yiz-color-text-secondary);
  border-radius: 2px;
  flex-shrink: 0;
  transition:
    color 0.2s,
    background 0.2s;
}

.yiz-date-range-picker-nav:hover {
  color: var(--yiz-color-primary);
  background: var(--yiz-color-hover-bg);
}

.yiz-date-range-picker-month-year {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--yiz-color-text-primary);
  cursor: pointer;
  padding: 2px 0;
  border-radius: var(--yiz-pane-item-border-radius);
  transition: background 0.2s;
}

.yiz-date-range-picker-month-year:hover {
  background: var(--yiz-color-hover-bg);
}

.yiz-date-range-picker-year-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 4px 0;
}

.yiz-date-range-picker-year-item {
  padding: 6px 0;
  text-align: center;
  font-size: 13px;
  color: var(--yiz-color-text-secondary);
  border-radius: var(--yiz-pane-item-border-radius);
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}

.yiz-date-range-picker-year-item:hover {
  background: var(--yiz-color-hover-bg);
}

.yiz-date-range-picker-year-item-active,
.yiz-date-range-picker-year-item-active:hover {
  color: var(--yiz-color-primary);
  background: var(--yiz-color-primary-light8);
  font-weight: 600;
}

.yiz-date-range-picker-weekdays {
  display: flex;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  padding-bottom: 4px;
  margin-bottom: 4px;
}

.yiz-date-range-picker-weekday {
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--yiz-color-text-tertiary);
  height: 28px;
  line-height: 28px;
}

.yiz-date-range-picker-dates {
  display: flex;
  flex-wrap: wrap;
}

.yiz-date-range-picker-cell {
  width: calc(100% / 7);
  text-align: center;
  cursor: pointer;
  padding: 2px 0;
}

.yiz-date-range-picker-cell-other {
  cursor: default;
}

.yiz-date-range-picker-cell-disabled {
  cursor: not-allowed;
}

.yiz-date-range-picker-cell-other .yiz-date-range-picker-cell-inner,
.yiz-date-range-picker-cell-disabled .yiz-date-range-picker-cell-inner {
  color: #d9d9d9;
}

.yiz-date-range-picker-cell-today .yiz-date-range-picker-cell-inner {
  color: var(--yiz-color-primary);
  font-weight: 600;
}

.yiz-date-range-picker-cell-selected .yiz-date-range-picker-cell-inner,
.yiz-date-range-picker-cell-selected .yiz-date-range-picker-cell-inner:hover {
  background: var(--yiz-color-primary);
  color: var(--yiz-color-text-inverse);
  border-radius: var(--yiz-pane-item-border-radius);
}

.yiz-date-range-picker-cell-inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 13px;
  color: var(--yiz-color-text-primary);
  border-radius: var(--yiz-pane-item-border-radius);
  transition:
    background 0.2s,
    color 0.2s;
}

.yiz-date-range-picker-cell-inner:hover {
  background: var(--yiz-color-hover-bg);
}

.yiz-date-range-picker-cell-disabled .yiz-date-range-picker-cell-inner:hover,
.yiz-date-range-picker-cell-other .yiz-date-range-picker-cell-inner:hover {
  background: transparent;
}

.yiz-date-range-picker-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-date-range-picker-panel-fade-enter-active,
.yiz-date-range-picker-panel-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.yiz-date-range-picker-panel-fade-enter-from,
.yiz-date-range-picker-panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

// ==================== clear 缩放过渡 ====================

.yiz-date-range-picker-clear-zoom-enter-active,
.yiz-date-range-picker-clear-zoom-leave-active {
  transition:
    transform 0.2s,
    opacity 0.2s;
}

.yiz-date-range-picker-clear-zoom-enter-from,
.yiz-date-range-picker-clear-zoom-leave-to {
  transform: translateY(-50%) scale(0);
  opacity: 0;
}

.yiz-date-range-picker-readonly .yiz-date-range-picker-input,
.yiz-date-range-picker-readonly .yiz-date-range-picker-segment {
  cursor: default;
}
</style>
