<template>
  <div
    ref="triggerRef"
    class="yiz-datetime-range-picker"
    :class="vClass"
    @click="onTriggerClick"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    v-bind="$attrs"
  >
    <div class="yiz-datetime-range-picker-input">
      <span class="yiz-datetime-range-picker-prefix" v-if="$props.prefix || $slots.prefix">
        <template v-if="$props.prefix">{{ $props.prefix }}</template>
        <slot v-else name="prefix" />
      </span>
      <input
        ref="startInputRef"
        class="yiz-datetime-range-picker-segment"
        :class="{ 'yiz-datetime-range-picker-segment-active': open && activeSide === 'start' }"
        :value="startInputText"
        :placeholder="startPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        @click.stop="onSegmentClick('start')"
        @focus="onInputFocus('start')"
        @input="onInput('start', $event)"
        @blur="onInputBlur('start')"
        @keydown.enter="onInputEnter('start', $event)"
        @keyup.enter="onInputEnter('start', $event)"
      />
      <span class="yiz-datetime-range-picker-separator">
        <slot name="separator">
          <Icon v-if="separator === '-'" size="16" :icon="ArrowRight16Regular" />
          <template v-else>{{ separator }}</template>
        </slot>
      </span>
      <input
        ref="endInputRef"
        class="yiz-datetime-range-picker-segment"
        :class="{ 'yiz-datetime-range-picker-segment-active': open && activeSide === 'end' }"
        :value="endInputText"
        :placeholder="endPlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        @click.stop="onSegmentClick('end')"
        @focus="onInputFocus('end')"
        @input="onInput('end', $event)"
        @blur="onInputBlur('end')"
        @keydown.enter="onInputEnter('end', $event)"
        @keyup.enter="onInputEnter('end', $event)"
      />
      <Transition name="yiz-datetime-range-picker-clear-zoom">
        <span
          v-if="clearable && (startModel != null || endModel != null) && !disabled && !readonly && (isHovering || open)"
          class="yiz-datetime-range-picker-clear"
          @click.stop="onClear"
        >
          <Icon size="16" :icon="DismissCircle16Filled" />
        </span>
      </Transition>
      <span class="yiz-datetime-range-picker-extra-suffix" v-if="$props.suffix || $slots.suffix">
        <template v-if="$props.suffix">{{ $props.suffix }}</template>
        <slot v-else name="suffix" />
      </span>
      <Icon
        :class="{
          'yiz-datetime-range-picker-suffix--hidden':
            clearable && (startModel != null || endModel != null) && !disabled && !readonly && (isHovering || open),
        }"
        class="yiz-datetime-range-picker-suffix"
        size="16"
        :icon="CalendarClock16Regular"
      />
    </div>
  </div>

  <AppTeleport>
    <Transition name="yiz-datetime-range-picker-panel-fade">
      <div v-if="open" ref="panelRef" class="yiz-datetime-range-picker-panel" :style="panelStyle" @click.stop>
        <div class="yiz-datetime-range-picker-panels">
          <div
            class="yiz-datetime-range-picker-side"
            :class="{ 'yiz-datetime-range-picker-side-active': activeSide === 'start' }"
          >
            <div class="yiz-datetime-range-picker-side-content">
              <div class="yiz-datetime-range-picker-date-panel">
                <!-- 年、月、日期面板导航 -->
                <div class="yiz-datetime-range-picker-header" @keydown.enter.stop>
                  <Icon
                    class="yiz-datetime-range-picker-nav"
                    size="16"
                    :icon="ChevronDoubleLeft16Regular"
                    @click="shiftYear('start', -1)"
                  />
                  <Icon
                    v-if="startPanelMode === 'date'"
                    class="yiz-datetime-range-picker-nav"
                    size="16"
                    :icon="ChevronLeft16Regular"
                    @click="shiftMonth('start', -1)"
                  />
                  <div class="yiz-datetime-range-picker-month-year">
                    <span v-if="startPanelMode === 'year'" class="yiz-datetime-range-picker-year-range">
                      {{ t('datePicker.yearRange', { start: startDecadeStart, end: startDecadeStart + 9 }) }}
                    </span>
                    <template v-else>
                      <button
                        type="button"
                        class="yiz-datetime-range-picker-header-label"
                        @click="startPanelMode = 'year'"
                      >
                        {{ t('datePicker.year', { year: startViewYear }) }}
                      </button>
                      <button
                        v-if="startPanelMode === 'date'"
                        type="button"
                        class="yiz-datetime-range-picker-header-label"
                        @click="startPanelMode = 'month'"
                      >
                        {{ t('datePicker.month', { month: startViewMonth }) }}
                      </button>
                    </template>
                  </div>
                  <Icon
                    v-if="startPanelMode === 'date'"
                    class="yiz-datetime-range-picker-nav"
                    size="16"
                    :icon="ChevronRight16Regular"
                    @click="shiftMonth('start', 1)"
                  />
                  <Icon
                    class="yiz-datetime-range-picker-nav"
                    size="16"
                    :icon="ChevronDoubleRight16Regular"
                    @click="shiftYear('start', 1)"
                  />
                </div>

                <!-- 年份快速选择 -->
                <div v-if="startPanelMode === 'year'" class="yiz-datetime-range-picker-year-grid" @keydown.enter.stop>
                  <button
                    v-for="y in startYearRange"
                    :key="y"
                    type="button"
                    class="yiz-datetime-range-picker-year-item"
                    :class="{
                      'yiz-datetime-range-picker-year-item-active': y === startViewYear,
                      'yiz-datetime-range-picker-year-item-other': y < startDecadeStart || y > startDecadeStart + 9,
                    }"
                    @click="selectYear('start', y)"
                  >
                    {{ y }}
                  </button>
                </div>

                <!-- 月份快速选择 -->
                <div
                  v-else-if="startPanelMode === 'month'"
                  class="yiz-datetime-range-picker-month-grid"
                  @keydown.enter.stop
                >
                  <button
                    v-for="m in 12"
                    :key="m"
                    type="button"
                    class="yiz-datetime-range-picker-month-item"
                    :class="{ 'yiz-datetime-range-picker-month-item-active': m === startViewMonth }"
                    @click="selectMonth('start', m)"
                  >
                    {{ t('datePicker.month', { month: m }) }}
                  </button>
                </div>
                <template v-else>
                  <div class="yiz-datetime-range-picker-weekdays">
                    <span v-for="day in weekDays" :key="day" class="yiz-datetime-range-picker-weekday">{{ day }}</span>
                  </div>
                  <div class="yiz-datetime-range-picker-dates">
                    <div
                      v-for="(cell, idx) in startCalendarCells"
                      :key="idx"
                      class="yiz-datetime-range-picker-cell"
                      :class="{
                        'yiz-datetime-range-picker-cell-other': !cell.current,
                        'yiz-datetime-range-picker-cell-today': cell.isToday,
                        'yiz-datetime-range-picker-cell-selected': cell.isSelected,
                        'yiz-datetime-range-picker-cell-disabled': cell.disabled,
                      }"
                      @click="onCellClick('start', cell)"
                    >
                      <span class="yiz-datetime-range-picker-cell-inner">{{ cell.day }}</span>
                    </div>
                  </div>
                </template>
              </div>

              <div class="yiz-datetime-range-picker-time">
                <div class="yiz-datetime-range-picker-time-col">
                  <div class="yiz-datetime-range-picker-time-title">{{ t('timePicker.hour') }}</div>
                  <div ref="startHourListRef" class="yiz-datetime-range-picker-time-list">
                    <div
                      v-for="h in hours"
                      :key="h"
                      class="yiz-datetime-range-picker-time-item"
                      :class="{ 'yiz-datetime-range-picker-time-item-active': h === startHour }"
                      @click="setTime('start', 'hour', h)"
                    >
                      {{ pad(h) }}
                    </div>
                  </div>
                </div>
                <div class="yiz-datetime-range-picker-time-col">
                  <div class="yiz-datetime-range-picker-time-title">{{ t('timePicker.minute') }}</div>
                  <div ref="startMinuteListRef" class="yiz-datetime-range-picker-time-list">
                    <div
                      v-for="m in minutes"
                      :key="m"
                      class="yiz-datetime-range-picker-time-item"
                      :class="{ 'yiz-datetime-range-picker-time-item-active': m === startMinute }"
                      @click="setTime('start', 'minute', m)"
                    >
                      {{ pad(m) }}
                    </div>
                  </div>
                </div>
                <div class="yiz-datetime-range-picker-time-col">
                  <div class="yiz-datetime-range-picker-time-title">{{ t('timePicker.second') }}</div>
                  <div ref="startSecondListRef" class="yiz-datetime-range-picker-time-list">
                    <div
                      v-for="s in 60"
                      :key="s - 1"
                      class="yiz-datetime-range-picker-time-item"
                      :class="{ 'yiz-datetime-range-picker-time-item-active': s - 1 === startSecond }"
                      @click="setTime('start', 'second', s - 1)"
                    >
                      {{ pad(s - 1) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="yiz-datetime-range-picker-side"
            :class="{ 'yiz-datetime-range-picker-side-active': activeSide === 'end' }"
          >
            <div class="yiz-datetime-range-picker-side-content">
              <div class="yiz-datetime-range-picker-date-panel">
                <!-- 年、月、日期面板导航 -->
                <div class="yiz-datetime-range-picker-header" @keydown.enter.stop>
                  <Icon
                    class="yiz-datetime-range-picker-nav"
                    size="16"
                    :icon="ChevronDoubleLeft16Regular"
                    @click="shiftYear('end', -1)"
                  />
                  <Icon
                    v-if="endPanelMode === 'date'"
                    class="yiz-datetime-range-picker-nav"
                    size="16"
                    :icon="ChevronLeft16Regular"
                    @click="shiftMonth('end', -1)"
                  />
                  <div class="yiz-datetime-range-picker-month-year">
                    <span v-if="endPanelMode === 'year'" class="yiz-datetime-range-picker-year-range">
                      {{ t('datePicker.yearRange', { start: endDecadeStart, end: endDecadeStart + 9 }) }}
                    </span>
                    <template v-else>
                      <button
                        type="button"
                        class="yiz-datetime-range-picker-header-label"
                        @click="endPanelMode = 'year'"
                      >
                        {{ t('datePicker.year', { year: endViewYear }) }}
                      </button>
                      <button
                        v-if="endPanelMode === 'date'"
                        type="button"
                        class="yiz-datetime-range-picker-header-label"
                        @click="endPanelMode = 'month'"
                      >
                        {{ t('datePicker.month', { month: endViewMonth }) }}
                      </button>
                    </template>
                  </div>
                  <Icon
                    v-if="endPanelMode === 'date'"
                    class="yiz-datetime-range-picker-nav"
                    size="16"
                    :icon="ChevronRight16Regular"
                    @click="shiftMonth('end', 1)"
                  />
                  <Icon
                    class="yiz-datetime-range-picker-nav"
                    size="16"
                    :icon="ChevronDoubleRight16Regular"
                    @click="shiftYear('end', 1)"
                  />
                </div>

                <!-- 年份快速选择 -->
                <div v-if="endPanelMode === 'year'" class="yiz-datetime-range-picker-year-grid" @keydown.enter.stop>
                  <button
                    v-for="y in endYearRange"
                    :key="y"
                    type="button"
                    class="yiz-datetime-range-picker-year-item"
                    :class="{
                      'yiz-datetime-range-picker-year-item-active': y === endViewYear,
                      'yiz-datetime-range-picker-year-item-other': y < endDecadeStart || y > endDecadeStart + 9,
                    }"
                    @click="selectYear('end', y)"
                  >
                    {{ y }}
                  </button>
                </div>

                <!-- 月份快速选择 -->
                <div
                  v-else-if="endPanelMode === 'month'"
                  class="yiz-datetime-range-picker-month-grid"
                  @keydown.enter.stop
                >
                  <button
                    v-for="m in 12"
                    :key="m"
                    type="button"
                    class="yiz-datetime-range-picker-month-item"
                    :class="{ 'yiz-datetime-range-picker-month-item-active': m === endViewMonth }"
                    @click="selectMonth('end', m)"
                  >
                    {{ t('datePicker.month', { month: m }) }}
                  </button>
                </div>
                <template v-else>
                  <div class="yiz-datetime-range-picker-weekdays">
                    <span v-for="day in weekDays" :key="day" class="yiz-datetime-range-picker-weekday">{{ day }}</span>
                  </div>
                  <div class="yiz-datetime-range-picker-dates">
                    <div
                      v-for="(cell, idx) in endCalendarCells"
                      :key="idx"
                      class="yiz-datetime-range-picker-cell"
                      :class="{
                        'yiz-datetime-range-picker-cell-other': !cell.current,
                        'yiz-datetime-range-picker-cell-today': cell.isToday,
                        'yiz-datetime-range-picker-cell-selected': cell.isSelected,
                        'yiz-datetime-range-picker-cell-disabled': cell.disabled,
                      }"
                      @click="onCellClick('end', cell)"
                    >
                      <span class="yiz-datetime-range-picker-cell-inner">{{ cell.day }}</span>
                    </div>
                  </div>
                </template>
              </div>

              <div class="yiz-datetime-range-picker-time">
                <div class="yiz-datetime-range-picker-time-col">
                  <div class="yiz-datetime-range-picker-time-title">{{ t('timePicker.hour') }}</div>
                  <div ref="endHourListRef" class="yiz-datetime-range-picker-time-list">
                    <div
                      v-for="h in hours"
                      :key="h"
                      class="yiz-datetime-range-picker-time-item"
                      :class="{ 'yiz-datetime-range-picker-time-item-active': h === endHour }"
                      @click="setTime('end', 'hour', h)"
                    >
                      {{ pad(h) }}
                    </div>
                  </div>
                </div>
                <div class="yiz-datetime-range-picker-time-col">
                  <div class="yiz-datetime-range-picker-time-title">{{ t('timePicker.minute') }}</div>
                  <div ref="endMinuteListRef" class="yiz-datetime-range-picker-time-list">
                    <div
                      v-for="m in minutes"
                      :key="m"
                      class="yiz-datetime-range-picker-time-item"
                      :class="{ 'yiz-datetime-range-picker-time-item-active': m === endMinute }"
                      @click="setTime('end', 'minute', m)"
                    >
                      {{ pad(m) }}
                    </div>
                  </div>
                </div>
                <div class="yiz-datetime-range-picker-time-col">
                  <div class="yiz-datetime-range-picker-time-title">{{ t('timePicker.second') }}</div>
                  <div ref="endSecondListRef" class="yiz-datetime-range-picker-time-list">
                    <div
                      v-for="s in 60"
                      :key="s - 1"
                      class="yiz-datetime-range-picker-time-item"
                      :class="{ 'yiz-datetime-range-picker-time-item-active': s - 1 === endSecond }"
                      @click="setTime('end', 'second', s - 1)"
                    >
                      {{ pad(s - 1) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="isDatePanel" class="yiz-datetime-range-picker-footer">
          <LinkButton @click="onNow">{{ t('timePicker.now') }}</LinkButton>
          <Button type="primary" size="small" :disabled="confirmDisabled" @click="onConfirm">{{
            t('common.confirm')
          }}</Button>
        </div>
      </div>
    </Transition>
  </AppTeleport>
</template>

<script lang="ts" setup>
import AppTeleport from '../app/AppTeleport.vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ArrowRight16Regular,
  CalendarClock16Regular,
  ChevronDoubleLeft16Regular,
  ChevronDoubleRight16Regular,
  ChevronLeft16Regular,
  ChevronRight16Regular,
  DismissCircle16Filled,
} from '@vicons/fluent'
import Button from '../button/Button.vue'
import { Icon } from '../icon'
import { useInputStyle } from '../input-style'
import LinkButton from '../link-button/LinkButton.vue'
import { useLocale } from '../locale'
import { useOverlayElement } from '../overlay/overlayScope'
import { useZIndexManager } from '../zIndex'
import { formatDateTime, parseDateTime, parseDateTimeValue, type DateTimeValue } from '../datetime-utils'

const t = useLocale()

defineSlots<{
  prefix: unknown
  separator: unknown
  suffix: unknown
}>()

type DateTimeRangeSide = 'start' | 'end'
type TimeUnit = 'hour' | 'minute' | 'second'

interface CalendarCell {
  day: number
  current: boolean
  isToday: boolean
  isSelected: boolean
  disabled: boolean
  date: Date
}

const startModel = defineModel<DateTimeValue>('start')
const endModel = defineModel<DateTimeValue>('end')

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    forceRange?: boolean
    autoSort?: boolean
    size?: 'small' | 'default' | 'large'
    styleMode?: 'outlined' | 'filled'
    format?: string
    startValueFormat?: string
    endValueFormat?: string
    disabledDate?: (date: Date) => boolean
    startPlaceholder?: string
    endPlaceholder?: string
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
    format: 'YYYY-MM-DD HH:mm:ss',
    separator: '-',
  },
)

const emit = defineEmits<{
  change: [start: DateTimeValue, end: DateTimeValue]
}>()

const now = new Date()
const open = ref(false)
const isHovering = ref(false)
const activeSide = ref<DateTimeRangeSide>('start')
const currentZIndex = ref(0)
const zIndexManager = useZIndexManager()
const triggerRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
useOverlayElement(panelRef, open)
const startInputRef = ref<HTMLInputElement>()
const endInputRef = ref<HTMLInputElement>()
const startHourListRef = ref<HTMLElement>()
const startMinuteListRef = ref<HTMLElement>()
const startSecondListRef = ref<HTMLElement>()
const endHourListRef = ref<HTMLElement>()
const endMinuteListRef = ref<HTMLElement>()
const endSecondListRef = ref<HTMLElement>()
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
const startPanelMode = ref<'date' | 'month' | 'year'>('date')
const endPanelMode = ref<'date' | 'month' | 'year'>('date')
const startHour = ref(0)
const startMinute = ref(0)
const startSecond = ref(0)
const endHour = ref(0)
const endMinute = ref(0)
const endSecond = ref(0)
const dropdownPos = ref<{ top?: string; bottom?: string; left?: string }>({})
const inputEnterHandledOnKeydown = ref(false)

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 60 }, (_, i) => i)
const weekDays = computed(() => t.list('datePicker.weekdays'))
const startPlaceholder = computed(() => props.startPlaceholder ?? t('dateRangePicker.startPlaceholder'))
const endPlaceholder = computed(() => props.endPlaceholder ?? t('dateRangePicker.endPlaceholder'))
const disabled = computed(() => props.disabled)
const clearable = computed(() => props.clearable)
const separator = computed(() => props.separator)
const confirmDisabled = computed(() => props.forceRange && (draftStart.value == null || draftEnd.value == null))
const panelStyle = computed(() => ({ zIndex: currentZIndex.value + 1, ...dropdownPos.value }))
const isDatePanel = computed(() => startPanelMode.value === 'date' && endPanelMode.value === 'date')
const startDecadeStart = computed(() => Math.floor(startViewYear.value / 10) * 10)
const endDecadeStart = computed(() => Math.floor(endViewYear.value / 10) * 10)
const startYearRange = computed(() => makeYearRange(startViewYear.value))
const endYearRange = computed(() => makeYearRange(endViewYear.value))
const startCalendarCells = computed(() => makeCalendarCells('start', startViewYear.value, startViewMonth.value))
const endCalendarCells = computed(() => makeCalendarCells('end', endViewYear.value, endViewMonth.value))

const { styleMode: mergedStyleMode, size: mergedSize } = useInputStyle(
  () => props.styleMode,
  () => props.size,
)

const vClass = computed(() => ({
  [`yiz-datetime-range-picker-${mergedStyleMode.value}`]: true,
  'yiz-datetime-range-picker-open': open.value,
  'yiz-datetime-range-picker-disabled': props.disabled,
  'yiz-datetime-range-picker-readonly': props.readonly,
  'yiz-datetime-range-picker-small': mergedSize.value === 'small',
  'yiz-datetime-range-picker-large': mergedSize.value === 'large',
}))

watch([startPanelMode, endPanelMode], async () => {
  if (!open.value) return
  await nextTick()
  repositionPanel()
})

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

function cloneDate(date: Date | null | undefined) {
  return date ? new Date(date.getTime()) : null
}

function sameDate(a: Date | null | undefined, b: Date) {
  return !!a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getValueFormat(side: DateTimeRangeSide) {
  return (side === 'start' ? props.startValueFormat : props.endValueFormat) ?? props.format
}

function parseModelValue(side: DateTimeRangeSide, value: DateTimeValue | undefined) {
  return parseDateTimeValue(value, getValueFormat(side))
}

function formatModelValue(side: DateTimeRangeSide, date: Date | null): DateTimeValue {
  if (!date) return null
  const valueFormat = side === 'start' ? props.startValueFormat : props.endValueFormat
  if (valueFormat) return formatDateTime(date, valueFormat)
  return new Date(date.getTime())
}

function getDraft(side: DateTimeRangeSide) {
  return side === 'start' ? draftStart.value : draftEnd.value
}

function setDraft(side: DateTimeRangeSide, date: Date | null) {
  if (side === 'start') {
    draftStart.value = cloneDate(date)
  } else {
    draftEnd.value = cloneDate(date)
  }
}

function syncTimeFromDate(side: DateTimeRangeSide, date: Date | null) {
  if (side === 'start') {
    startHour.value = date?.getHours() ?? 0
    startMinute.value = date?.getMinutes() ?? 0
    startSecond.value = date?.getSeconds() ?? 0
  } else {
    endHour.value = date?.getHours() ?? 0
    endMinute.value = date?.getMinutes() ?? 0
    endSecond.value = date?.getSeconds() ?? 0
  }
}

function getTime(side: DateTimeRangeSide) {
  return side === 'start'
    ? { hour: startHour.value, minute: startMinute.value, second: startSecond.value }
    : { hour: endHour.value, minute: endMinute.value, second: endSecond.value }
}

function buildDateWithTime(side: DateTimeRangeSide, date: Date) {
  const time = getTime(side)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.hour, time.minute, time.second)
}

function setInputText(side: DateTimeRangeSide, value: string) {
  if (side === 'start') {
    startInputText.value = value
  } else {
    endInputText.value = value
  }
}

function getInputText(side: DateTimeRangeSide) {
  return side === 'start' ? startInputText.value : endInputText.value
}

function getInputElement(side: DateTimeRangeSide) {
  return side === 'start' ? startInputRef.value : endInputRef.value
}

function setInputDirty(side: DateTimeRangeSide, dirty: boolean) {
  if (side === 'start') {
    startInputDirty.value = dirty
  } else {
    endInputDirty.value = dirty
  }
}

function isInputDirty(side: DateTimeRangeSide) {
  return side === 'start' ? startInputDirty.value : endInputDirty.value
}

function syncInputTextFromDraft(side: DateTimeRangeSide) {
  const draft = getDraft(side)
  setInputText(side, draft ? formatDateTime(draft, props.format) : '')
}

function syncInputTextFromModel() {
  const start = parseModelValue('start', startModel.value)
  const end = parseModelValue('end', endModel.value)
  startInputText.value = start ? formatDateTime(start, props.format) : ''
  endInputText.value = end ? formatDateTime(end, props.format) : ''
}

function applyInputText(side: DateTimeRangeSide, value: string): Date | null {
  const parsed = parseDateTime(value.trim(), props.format)
  if (!parsed) return null
  if (props.disabledDate?.(parsed)) return null
  setDraft(side, parsed)
  syncTimeFromDate(side, parsed)
  setView(side, parsed.getFullYear(), parsed.getMonth() + 1)
  activeSide.value = side
  if (side === 'start') {
    startPanelMode.value = 'date'
  } else {
    endPanelMode.value = 'date'
  }
  scrollToSelected()
  return parsed
}

function makeYearRange(year: number) {
  return Array.from({ length: 12 }, (_, i) => Math.floor(year / 10) * 10 - 1 + i)
}

function makeCalendarCells(side: DateTimeRangeSide, year: number, month: number): CalendarCell[] {
  const cells: CalendarCell[] = []
  const firstDay = new Date(year, month - 1, 1)
  const daysInMonth = new Date(year, month, 0).getDate()
  const startWeekDay = firstDay.getDay()
  const prevDays = new Date(year, month - 1, 0).getDate()
  for (let i = startWeekDay - 1; i >= 0; i--) cells.push(makeCell(side, year, month - 1, prevDays - i, false))
  for (let day = 1; day <= daysInMonth; day++) cells.push(makeCell(side, year, month, day, true))
  for (let day = 1; cells.length < 42; day++) cells.push(makeCell(side, year, month + 1, day, false))
  return cells
}

function makeCell(side: DateTimeRangeSide, year: number, month: number, day: number, current: boolean): CalendarCell {
  const date = buildDateWithTime(side, new Date(year, month - 1, day))
  const today = new Date()
  return {
    day,
    current,
    isToday: sameDate(today, date),
    isSelected: sameDate(getDraft(side), date),
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

function openPanel(side: DateTimeRangeSide) {
  if (props.disabled || props.readonly) return
  activeSide.value = side
  draftStart.value = parseModelValue('start', startModel.value)
  draftEnd.value = parseModelValue('end', endModel.value)
  syncTimeFromDate('start', draftStart.value)
  syncTimeFromDate('end', draftEnd.value)
  startPanelMode.value = 'date'
  endPanelMode.value = 'date'
  syncViewFromDraft()
  syncInputTextFromDraft('start')
  syncInputTextFromDraft('end')
  startInputDirty.value = false
  endInputDirty.value = false
  currentZIndex.value = zIndexManager.next()
  open.value = true
}

function onTriggerClick() {
  if (!open.value) {
    openPanel('start')
  }
}

function onSegmentClick(side: DateTimeRangeSide) {
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
  scrollToSelected()
}

function onInputFocus(side: DateTimeRangeSide) {
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

function onInput(side: DateTimeRangeSide, e: Event) {
  if (props.disabled || props.readonly) return
  const value = (e.target as HTMLInputElement).value
  setInputText(side, value)
  setInputDirty(side, true)
  applyInputText(side, value)
}

function onInputBlur(side: DateTimeRangeSide) {
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

function onCellClick(side: DateTimeRangeSide, cell: CalendarCell) {
  if (props.disabled || props.readonly || cell.disabled) return
  activeSide.value = side
  if (!cell.current) {
    setView(side, cell.date.getFullYear(), cell.date.getMonth() + 1)
    return
  }
  setDraft(side, cell.date)
  syncInputTextFromDraft(side)
  setInputDirty(side, false)
}

function setTime(side: DateTimeRangeSide, unit: TimeUnit, value: number) {
  if (props.disabled || props.readonly) return
  activeSide.value = side
  if (side === 'start') {
    if (unit === 'hour') startHour.value = value
    if (unit === 'minute') startMinute.value = value
    if (unit === 'second') startSecond.value = value
  } else {
    if (unit === 'hour') endHour.value = value
    if (unit === 'minute') endMinute.value = value
    if (unit === 'second') endSecond.value = value
  }
  const base =
    getDraft(side) ??
    new Date(
      side === 'start' ? startViewYear.value : endViewYear.value,
      side === 'start' ? startViewMonth.value - 1 : endViewMonth.value - 1,
      1,
    )
  setDraft(side, buildDateWithTime(side, base))
  syncInputTextFromDraft(side)
  setInputDirty(side, false)
  scrollToSelected()
}

function onNow() {
  if (props.disabled || props.readonly) return
  const value = new Date()
  setDraft(activeSide.value, value)
  syncTimeFromDate(activeSide.value, value)
  setView(activeSide.value, value.getFullYear(), value.getMonth() + 1)
  syncInputTextFromDraft(activeSide.value)
  setInputDirty(activeSide.value, false)
  scrollToSelected()
}

function onConfirm() {
  if (props.disabled || props.readonly || !isDatePanel.value) return
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
  syncInputTextFromModel()
  open.value = false
}

function confirmFromInput(side: DateTimeRangeSide) {
  if (props.disabled || props.readonly) return
  const inputValue = getInputElement(side)?.value ?? getInputText(side)
  const shouldValidateInput = isInputDirty(side) || inputValue !== getInputText(side)
  if (!open.value) {
    openPanel(side)
  }
  activeSide.value = side
  setInputText(side, inputValue)
  if (shouldValidateInput) {
    setInputDirty(side, true)
  }
  onConfirm()
}

function onInputEnter(side: DateTimeRangeSide, e: KeyboardEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (e.isComposing) return
  if (e.type === 'keyup' && inputEnterHandledOnKeydown.value) {
    inputEnterHandledOnKeydown.value = false
    return
  }
  if (e.type === 'keydown') {
    inputEnterHandledOnKeydown.value = true
  }
  confirmFromInput(side)
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

function setView(side: DateTimeRangeSide, year: number, month: number) {
  if (side === 'start') {
    startViewYear.value = year
    startViewMonth.value = month
  } else {
    endViewYear.value = year
    endViewMonth.value = month
  }
}

function shiftMonth(side: DateTimeRangeSide, offset: number) {
  const year = side === 'start' ? startViewYear.value : endViewYear.value
  const month = side === 'start' ? startViewMonth.value : endViewMonth.value
  const next = new Date(year, month - 1 + offset, 1)
  setView(side, next.getFullYear(), next.getMonth() + 1)
}

function shiftYear(side: DateTimeRangeSide, offset: number) {
  if (side === 'start') {
    startViewYear.value += offset * (startPanelMode.value === 'year' ? 10 : 1)
  } else {
    endViewYear.value += offset * (endPanelMode.value === 'year' ? 10 : 1)
  }
}

function selectYear(side: DateTimeRangeSide, year: number) {
  if (side === 'start') {
    startViewYear.value = year
    startPanelMode.value = 'month'
  } else {
    endViewYear.value = year
    endPanelMode.value = 'month'
  }
}

function selectMonth(side: DateTimeRangeSide, month: number) {
  if (side === 'start') {
    startViewMonth.value = month
    startPanelMode.value = 'date'
  } else {
    endViewMonth.value = month
    endPanelMode.value = 'date'
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
  if (triggerRef.value?.contains(target) || panelRef.value?.contains(target)) return
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
.yiz-datetime-range-picker {
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}

.yiz-datetime-range-picker-input {
  --yiz-datetime-range-picker-padding-inline: var(--yiz-control-padding-inline-default);
  --yiz-datetime-range-picker-affix-gap: var(--yiz-control-affix-gap-default);

  display: inline-flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  width: 100%;
  position: relative;
  height: var(--yiz-control-height-default);
  padding: 0 var(--yiz-datetime-range-picker-padding-inline);
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-base-border-radius-default);
  background: var(--yiz-color-bg-container);
  cursor: pointer;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  box-sizing: border-box;
  gap: var(--yiz-datetime-range-picker-affix-gap);
  font-size: var(--yiz-font-size-default);
  line-height: 1;
}

.yiz-datetime-range-picker:not(.yiz-datetime-range-picker-disabled) .yiz-datetime-range-picker-input:hover {
  border-color: var(--yiz-color-primary);
}

.yiz-datetime-range-picker-open .yiz-datetime-range-picker-input {
  border-color: var(--yiz-color-primary);
  box-shadow: var(--yiz-control-focus-shadow);
}

.yiz-form-item-error-status
  .yiz-datetime-range-picker:not(.yiz-datetime-range-picker-disabled)
  .yiz-datetime-range-picker-input {
  border-color: var(--yiz-color-error);
}

.yiz-form-item-error-status
  .yiz-datetime-range-picker:not(.yiz-datetime-range-picker-disabled)
  .yiz-datetime-range-picker-input:hover {
  border-color: var(--yiz-color-error);
}

.yiz-form-item-error-status
  .yiz-datetime-range-picker-open:not(.yiz-datetime-range-picker-disabled)
  .yiz-datetime-range-picker-input {
  border-color: var(--yiz-color-error);
  box-shadow: var(--yiz-control-error-focus-shadow);
}

.yiz-datetime-range-picker-disabled .yiz-datetime-range-picker-input {
  background: var(--yiz-color-bg-muted);
  cursor: not-allowed;
}

.yiz-datetime-range-picker-segment {
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

  &::placeholder {
    color: var(--yiz-color-text-disabled);
  }
}

.yiz-datetime-range-picker-segment:hover,
.yiz-datetime-range-picker-segment:active,
.yiz-datetime-range-picker-segment-active {
  background: transparent;
  color: var(--yiz-color-text-primary);
}

.yiz-datetime-range-picker-segment:disabled {
  color: var(--yiz-color-text-disabled);
  cursor: not-allowed;
}

.yiz-datetime-range-picker-separator {
  display: inline-flex;
  align-items: center;
  color: var(--yiz-color-text-tertiary);
  flex-shrink: 0;
}

.yiz-datetime-range-picker-clear,
.yiz-datetime-range-picker-suffix {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  color: var(--yiz-color-text-tertiary);
}

.yiz-datetime-range-picker-suffix {
  transition: opacity 0.2s;
}

.yiz-datetime-range-picker-suffix--hidden {
  opacity: 0;
}

.yiz-datetime-range-picker-prefix,
.yiz-datetime-range-picker-extra-suffix {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  color: var(--yiz-color-text-secondary);
  user-select: none;
}

.yiz-datetime-range-picker-clear {
  position: absolute;
  right: var(--yiz-datetime-range-picker-padding-inline);
  top: 50%;
  transform: translateY(-50%);
  user-select: none;
  cursor: pointer;
  color: var(--yiz-color-text-tertiary);
  transition: color 0.3s;
  z-index: 1;
}

.yiz-datetime-range-picker-clear:hover {
  color: var(--yiz-color-text-primary);
}

.yiz-datetime-range-picker-small .yiz-datetime-range-picker-input {
  --yiz-datetime-range-picker-padding-inline: var(--yiz-control-padding-inline-small);
  --yiz-datetime-range-picker-affix-gap: var(--yiz-control-affix-gap-small);

  height: var(--yiz-control-height-small);
  border-radius: var(--yiz-base-border-radius-small);
  font-size: var(--yiz-font-size-small);
}

.yiz-datetime-range-picker-large .yiz-datetime-range-picker-input {
  --yiz-datetime-range-picker-padding-inline: var(--yiz-control-padding-inline-large);
  --yiz-datetime-range-picker-affix-gap: var(--yiz-control-affix-gap-large);

  height: var(--yiz-control-height-large);
  border-radius: var(--yiz-base-border-radius-large);
  font-size: var(--yiz-font-size-large);
}

.yiz-datetime-range-picker-panel {
  position: fixed;
  width: 880px;
  background: var(--yiz-color-bg-elevated);
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-pane-border-radius);
  box-shadow: var(--yiz-shadow-popup);
  user-select: none;
  font-size: 14px;
}

.yiz-datetime-range-picker-panels {
  display: flex;
  align-items: stretch;
}

.yiz-datetime-range-picker-side {
  width: 50%;
  min-width: 0;
  flex: 0 0 50%;
  box-sizing: border-box;
}

.yiz-datetime-range-picker-side + .yiz-datetime-range-picker-side {
  border-left: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-datetime-range-picker-side-content {
  display: flex;
  align-items: stretch;
}

.yiz-datetime-range-picker-date-panel {
  width: 280px;
  padding: 8px 12px;
  box-sizing: border-box;
}

.yiz-datetime-range-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 2px;
  height: var(--yiz-control-height-small);
}

.yiz-datetime-range-picker-nav {
  cursor: pointer;
  color: var(--yiz-color-text-secondary);
  border-radius: 2px;
  flex-shrink: 0;
  transition: color 0.2s;
}

.yiz-datetime-range-picker-nav:hover {
  color: var(--yiz-color-primary);
}

.yiz-datetime-range-picker-month-year {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--yiz-color-text-primary);
}

.yiz-datetime-range-picker-header-label {
  border: none;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  padding: 2px 0;
  border-radius: var(--yiz-pane-item-border-radius);
  transition: color 0.2s;

  &:hover {
    color: var(--yiz-color-primary);
  }
}

.yiz-datetime-range-picker-year-range {
  padding: 2px 0;
  color: var(--yiz-color-primary);
}

// 年份和月份选择：三列四行
.yiz-datetime-range-picker-year-grid,
.yiz-datetime-range-picker-month-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(4, 1fr);
  align-items: center;
  justify-items: center;
  gap: 4px;
  height: 256px;
  padding-top: 4px;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-datetime-range-picker-year-item,
.yiz-datetime-range-picker-month-item {
  border: none;
  background: transparent;
  font-family: inherit;
  min-width: 52px;
  padding: 6px 8px;
  text-align: center;
  font-size: 13px;
  color: var(--yiz-color-text-secondary);
  border-radius: var(--yiz-pane-item-border-radius);
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;

  &:hover {
    background: var(--yiz-color-hover-bg);
  }

  &-other {
    color: var(--yiz-color-text-disabled);
  }

  &-active,
  &-active:hover {
    color: var(--yiz-color-primary);
    background: var(--yiz-color-primary-bg-hover);
    font-weight: 600;
  }
}

.yiz-datetime-range-picker-weekdays {
  display: flex;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  padding-bottom: 4px;
  margin-bottom: 4px;
}

.yiz-datetime-range-picker-weekday {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: var(--yiz-color-text-tertiary);
  height: 26px;
  line-height: 26px;
}

.yiz-datetime-range-picker-dates {
  display: flex;
  flex-wrap: wrap;
}

.yiz-datetime-range-picker-cell {
  width: calc(100% / 7);
  text-align: center;
  cursor: pointer;
  padding: 1px 0;
}

.yiz-datetime-range-picker-cell-other {
  cursor: default;
}

.yiz-datetime-range-picker-cell-disabled {
  cursor: not-allowed;
}

.yiz-datetime-range-picker-cell-inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 13px;
  color: var(--yiz-color-text-primary);
  border-radius: var(--yiz-pane-item-border-radius);
  transition:
    background 0.2s,
    color 0.2s;
}

.yiz-datetime-range-picker-cell-inner:hover {
  background: var(--yiz-color-hover-bg);
}

.yiz-datetime-range-picker-cell-other .yiz-datetime-range-picker-cell-inner,
.yiz-datetime-range-picker-cell-disabled .yiz-datetime-range-picker-cell-inner {
  color: var(--yiz-color-text-disabled);
}

.yiz-datetime-range-picker-cell-today .yiz-datetime-range-picker-cell-inner {
  color: var(--yiz-color-primary);
  font-weight: 600;
}

.yiz-datetime-range-picker-cell-selected .yiz-datetime-range-picker-cell-inner,
.yiz-datetime-range-picker-cell-selected .yiz-datetime-range-picker-cell-inner:hover {
  background: var(--yiz-color-primary);
  color: var(--yiz-color-on-primary);
  border-radius: var(--yiz-pane-item-border-radius);
}

.yiz-datetime-range-picker-cell-disabled .yiz-datetime-range-picker-cell-inner:hover,
.yiz-datetime-range-picker-cell-other .yiz-datetime-range-picker-cell-inner:hover {
  background: transparent;
}

.yiz-datetime-range-picker-time {
  display: flex;
  width: 160px;
  gap: 4px;
  padding: 8px;
  border-left: 1px solid var(--yiz-color-border, #d9d9d9);
  box-sizing: border-box;
}

.yiz-datetime-range-picker-time-col {
  flex: 1;
  min-width: 0;
}

.yiz-datetime-range-picker-time-title {
  text-align: center;
  color: var(--yiz-color-text-tertiary);
  font-size: 12px;
  padding: 4px 0;
}

.yiz-datetime-range-picker-time-list {
  height: 236px;
  overflow-y: auto;
  scrollbar-width: none;
}

.yiz-datetime-range-picker-time-list::-webkit-scrollbar {
  display: none;
}

.yiz-datetime-range-picker-time-item {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 28px;
  height: 28px;
  margin: 0 auto 2px;
  text-align: center;
  padding: 0;
  font-size: 14px;
  border-radius: var(--yiz-pane-item-border-radius);
  cursor: pointer;
  color: var(--yiz-color-text-secondary);
  transition:
    background 0.15s,
    color 0.15s;
}

.yiz-datetime-range-picker-time-item:hover {
  background: var(--yiz-color-hover-bg);
}

.yiz-datetime-range-picker-time-item-active,
.yiz-datetime-range-picker-time-item-active:hover {
  color: var(--yiz-color-on-primary);
  background: var(--yiz-color-primary);
}

.yiz-datetime-range-picker-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-datetime-range-picker-panel-fade-enter-active,
.yiz-datetime-range-picker-panel-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.yiz-datetime-range-picker-panel-fade-enter-from,
.yiz-datetime-range-picker-panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.yiz-datetime-range-picker-clear-zoom-enter-active,
.yiz-datetime-range-picker-clear-zoom-leave-active {
  transition:
    transform 0.2s,
    opacity 0.2s;
}

.yiz-datetime-range-picker-clear-zoom-enter-from,
.yiz-datetime-range-picker-clear-zoom-leave-to {
  transform: translateY(-50%) scale(0);
  opacity: 0;
}

.yiz-datetime-range-picker-readonly .yiz-datetime-range-picker-input,
.yiz-datetime-range-picker-readonly .yiz-datetime-range-picker-segment {
  cursor: default;
}
</style>
