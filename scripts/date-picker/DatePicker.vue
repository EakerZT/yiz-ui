<template>
  <div ref="triggerRef" class="yiz-date-picker" :class="vClass" @click="onTriggerClick" @mouseenter="isHovering = true" @mouseleave="isHovering = false" v-bind="$attrs">
    <div class="yiz-date-picker-input">
      <span class="yiz-date-picker-prefix" v-if="$props.prefix || $slots.prefix">
        <template v-if="$props.prefix">{{ $props.prefix }}</template>
        <slot v-else name="prefix" />
      </span>
      <input ref="inputRef" :value="displayText" :placeholder="placeholderText" :disabled="disabled" readonly />
      <Transition name="yiz-date-picker-clear-zoom">
        <span v-if="clearable && modelValue && !disabled && (isHovering || open)" class="yiz-date-picker-clear" @click.stop="onClear">
          <Icon size="16" :icon="DismissCircle32Filled" />
        </span>
      </Transition>
      <span class="yiz-date-picker-extra-suffix" v-if="$props.suffix || $slots.suffix">
        <template v-if="$props.suffix">{{ $props.suffix }}</template>
        <slot v-else name="suffix" />
      </span>
      <Icon :class="{ 'yiz-date-picker-suffix--hidden': clearable && modelValue && !disabled && (isHovering || open) }" class="yiz-date-picker-suffix" size="16" :icon="CalendarLtr16Regular" />
    </div>
  </div>

  <Teleport to="body">
    <Transition name="yiz-date-picker-panel-fade">
      <div v-if="open" ref="panelRef" class="yiz-date-picker-panel" :style="panelStyle" @click.stop>
        <!-- 月份导航 -->
        <div class="yiz-date-picker-header">
          <Icon class="yiz-date-picker-nav" size="16" :icon="ChevronDoubleLeft16Regular" @click="prevYear" />
          <Icon class="yiz-date-picker-nav" size="16" :icon="ChevronLeft16Regular" @click="prevMonth" />
          <span class="yiz-date-picker-month-year" @click="showYearPicker = !showYearPicker">
            {{ $t('datePicker.yearMonth', { year, month }) }}
          </span>
          <Icon class="yiz-date-picker-nav" size="16" :icon="ChevronRight16Regular" @click="nextMonth" />
          <Icon class="yiz-date-picker-nav" size="16" :icon="ChevronDoubleRight16Regular" @click="nextYear" />
        </div>

        <!-- 年份快速选择 -->
        <div v-if="showYearPicker" class="yiz-date-picker-year-grid">
          <div
            v-for="y in yearRange"
            :key="y"
            class="yiz-date-picker-year-item"
            :class="{ 'yiz-date-picker-year-item--active': y === year }"
            @click="selectYear(y)"
          >
            {{ y }}
          </div>
        </div>

        <!-- 日期网格 -->
        <div v-else class="yiz-date-picker-body">
          <div class="yiz-date-picker-weekdays">
            <span v-for="d in weekDays" :key="d" class="yiz-date-picker-weekday">{{ d }}</span>
          </div>
          <div class="yiz-date-picker-dates">
            <div
              v-for="(cell, idx) in calendarCells"
              :key="idx"
              class="yiz-date-picker-cell"
              :class="{
                'yiz-date-picker-cell--other': !cell.current,
                'yiz-date-picker-cell--today': cell.isToday,
                'yiz-date-picker-cell--selected': cell.isSelected,
                'yiz-date-picker-cell--disabled': cell.disabled
              }"
              @click="onCellClick(cell)"
            >
              <span class="yiz-date-picker-cell-inner">{{ cell.day }}</span>
            </div>
          </div>
        </div>

        <!-- 底部 -->
        <div class="yiz-date-picker-footer">
          <LinkButton @click="onToday">{{ $t('datePicker.today') }}</LinkButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  CalendarLtr16Regular,
  ChevronDoubleLeft16Regular,
  ChevronDoubleRight16Regular,
  ChevronLeft16Regular,
  ChevronRight16Regular,
  DismissCircle32Filled
} from '@vicons/fluent'
import { Icon } from '../icon'
import LinkButton from '../link-button/LinkButton.vue'
import { $t, $tList } from '../locale'
import { nextZIndex } from '../zIndex'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    size?: 'small' | 'default' | 'large'
    disabledDate?: (date: Date) => boolean
    format?: string
    prefix?: string
    suffix?: string
  }>(),
  {
    disabled: false,
    clearable: false,
    size: 'default',
    format: 'yyyy-MM-dd'
  }
)

const emit = defineEmits<{
  change: [date: Date | null]
}>()

const modelValue = defineModel<Date | null>('modelValue')

// ==================== 状态 ====================

const open = ref(false)
const currentZIndex = ref(0)
const triggerRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const showYearPicker = ref(false)
const isHovering = ref(false)

const now = new Date()
const viewYear = ref(now.getFullYear())
const viewMonth = ref(now.getMonth() + 1)

const weekDays = computed(() => $tList('datePicker.weekdays'))

// ==================== 计算属性 ====================

const year = computed(() => viewYear.value)
const month = computed(() => viewMonth.value)
const placeholderText = computed(() => props.placeholder ?? $t('datePicker.placeholder'))

const yearRange = computed(() => {
  const start = viewYear.value - 6
  const result: number[] = []
  for (let i = 0; i < 12; i++) {
    result.push(start + i)
  }
  return result
})

const displayText = computed(() => {
  if (!modelValue.value) return ''
  return formatDate(modelValue.value, props.format)
})

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (open.value) c['yiz-date-picker-open'] = true
  if (props.disabled) c['yiz-date-picker-disabled'] = true
  if (props.size === 'small') c['yiz-date-picker-small'] = true
  if (props.size === 'large') c['yiz-date-picker-large'] = true
  return c
})

const panelStyle = computed(() => ({
  zIndex: currentZIndex.value + 1
}))

interface CalendarCell {
  day: number
  current: boolean
  isToday: boolean
  isSelected: boolean
  disabled: boolean
  date: Date
}

const calendarCells = computed<CalendarCell[]>(() => {
  const cells: CalendarCell[] = []
  const y = viewYear.value
  const m = viewMonth.value

  const firstDay = new Date(y, m - 1, 1)
  const lastDay = new Date(y, m, 0)
  const daysInMonth = lastDay.getDate()
  const startWeekDay = firstDay.getDay()

  // 上月填充
  const prevLastDay = new Date(y, m - 1, 0)
  const prevDays = prevLastDay.getDate()
  for (let i = startWeekDay - 1; i >= 0; i--) {
    const d = prevDays - i
    cells.push(makeCell(y, m - 1, d, false))
  }

  // 当月
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(makeCell(y, m, d, true))
  }

  // 下月填充（补齐到 6 行）
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push(makeCell(y, m + 1, d, false))
  }

  return cells
})

function makeCell(year: number, month: number, day: number, current: boolean): CalendarCell {
  const date = new Date(year, month - 1, day)
  const today = new Date()
  return {
    day,
    current,
    isToday:
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate(),
    isSelected: modelValue.value
      ? date.getFullYear() === modelValue.value.getFullYear() &&
        date.getMonth() === modelValue.value.getMonth() &&
        date.getDate() === modelValue.value.getDate()
      : false,
    disabled: props.disabledDate ? props.disabledDate(date) : false,
    date
  }
}

// ==================== 日期格式化 ====================

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

function formatDate(date: Date, fmt: string): string {
  const map: Record<string, string> = {
    yyyy: `${date.getFullYear()}`,
    MM: pad(date.getMonth() + 1),
    dd: pad(date.getDate()),
    M: `${date.getMonth() + 1}`,
    d: `${date.getDate()}`
  }
  return fmt.replace(/yyyy|MM|dd|M|d/g, (k) => map[k] || k)
}

// ==================== 操作 ====================

function onTriggerClick() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    currentZIndex.value = nextZIndex()
    showYearPicker.value = false
    if (modelValue.value) {
      viewYear.value = modelValue.value.getFullYear()
      viewMonth.value = modelValue.value.getMonth() + 1
    }
    nextTick(() => inputRef.value?.focus())
  }
}

function onClear() {
  if (props.disabled) return
  modelValue.value = null
  emit('change', null)
}

function onCellClick(cell: CalendarCell) {
  if (props.disabled) return
  if (cell.disabled) return
  if (!cell.current) {
    viewYear.value = cell.date.getFullYear()
    viewMonth.value = cell.date.getMonth() + 1
    return
  }
  modelValue.value = cell.date
  emit('change', cell.date)
  open.value = false
}

function onToday() {
  if (props.disabled) return
  const today = new Date()
  modelValue.value = today
  emit('change', today)
  open.value = false
}

function prevMonth() {
  if (viewMonth.value === 1) {
    viewYear.value--
    viewMonth.value = 12
  } else {
    viewMonth.value--
  }
}

function nextMonth() {
  if (viewMonth.value === 12) {
    viewYear.value++
    viewMonth.value = 1
  } else {
    viewMonth.value++
  }
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

// ==================== 定位 ====================

function repositionPanel() {
  if (!panelRef.value || !triggerRef.value) return
  const panelRect = panelRef.value.getBoundingClientRect()
  const triggerRect = triggerRef.value.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const gap = 4
  const margin = 8

  // 垂直方向
  const spaceBelow = vh - triggerRect.bottom - gap
  const spaceAbove = triggerRect.top - gap

  if (spaceBelow >= panelRect.height || spaceBelow >= spaceAbove) {
    panelRef.value.style.top = `${triggerRect.bottom + gap}px`
    panelRef.value.style.bottom = ''
  } else {
    panelRef.value.style.bottom = `${vh - triggerRect.top + gap}px`
    panelRef.value.style.top = ''
  }

  // 水平方向
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
  }
})

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      open.value = false
      showYearPicker.value = false
    }
  }
)

function onClickOutside(e: MouseEvent) {
  if (!open.value) return
  const target = e.target as HTMLElement
  if (triggerRef.value?.contains(target)) return
  if (panelRef.value?.contains(target)) return
  open.value = false
  showYearPicker.value = false
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
    showYearPicker.value = false
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
.yiz-date-picker {
  display: flex;
  align-items: center;
  position: relative;
  min-width: 160px;
  box-sizing: border-box;
}

.yiz-date-picker-input {
  display: inline-flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  width: 100%;
  position: relative;
  height: 32px;
  padding: 0 11px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  box-sizing: border-box;
  gap: 4px;

  &:hover {
    border-color: var(--yiz-color-primary);
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    min-width: 0;

    &::placeholder {
      color: #c0c4cc;
    }

    &:disabled {
      cursor: not-allowed;
      color: #c0c4cc;
    }
  }
}

.yiz-date-picker-open .yiz-date-picker-input {
  border-color: var(--yiz-color-primary);
  box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
}

.yiz-form-item-error-status .yiz-date-picker:not(.yiz-date-picker-disabled) .yiz-date-picker-input {
  border-color: var(--yiz-color-error);

  &:hover {
    border-color: var(--yiz-color-error);
  }
}

.yiz-form-item-error-status .yiz-date-picker-open:not(.yiz-date-picker-disabled) .yiz-date-picker-input {
  border-color: var(--yiz-color-error);
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
}

.yiz-date-picker-disabled .yiz-date-picker-input {
  background: #f5f5f5;
  cursor: not-allowed;

  &:hover {
    border-color: var(--yiz-color-border, #d9d9d9);
  }

  input {
    cursor: not-allowed;
    color: #c0c4cc;
  }
}

.yiz-date-picker-small .yiz-date-picker-input {
  height: 24px;

  input {
    font-size: 13px;
  }
}

.yiz-date-picker-large .yiz-date-picker-input {
  height: 40px;

  input {
    font-size: 16px;
  }
}

.yiz-date-picker-clear {
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

.yiz-date-picker-prefix,
.yiz-date-picker-extra-suffix {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: #666;
  user-select: none;
}

.yiz-date-picker-suffix {
  flex-shrink: 0;
  color: #999;
  transition: opacity 0.2s;
}

.yiz-date-picker-suffix--hidden {
  opacity: 0;
}

// ==================== clear 缩放过渡 ====================

.yiz-date-picker-clear-zoom-enter-active,
.yiz-date-picker-clear-zoom-leave-active {
  transition:
    transform 0.2s,
    opacity 0.2s;
}

.yiz-date-picker-clear-zoom-enter-from,
.yiz-date-picker-clear-zoom-leave-to {
  transform: translateY(-50%) scale(0);
  opacity: 0;
}

// ==================== 面板 ====================

.yiz-date-picker-panel {
  position: fixed;
  background: #fff;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  width: 260px;
  user-select: none;
}

// 头部
.yiz-date-picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 2px;
}

.yiz-date-picker-nav {
  cursor: pointer;
  color: #666;
  border-radius: 2px;
  flex-shrink: 0;
  transition:
    color 0.2s,
    background 0.2s;

  &:hover {
    color: var(--yiz-color-primary);
    background: var(--yiz-color-hover-bg);
  }
}

.yiz-date-picker-month-year {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  padding: 2px 0;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: var(--yiz-color-hover-bg);
  }
}

// 年份选择
.yiz-date-picker-year-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 4px 0;
}

.yiz-date-picker-year-item {
  padding: 6px 0;
  text-align: center;
  font-size: 13px;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;

  &:hover {
    background: var(--yiz-color-hover-bg);
  }

  &--active {
    color: var(--yiz-color-primary);
    background: var(--yiz-color-primary-light8);
    font-weight: 600;
  }
}

// 星期
.yiz-date-picker-weekdays {
  display: flex;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  padding-bottom: 4px;
  margin-bottom: 4px;
}

.yiz-date-picker-weekday {
  flex: 1;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #999;
  height: 28px;
  line-height: 28px;
}

// 日期格子
.yiz-date-picker-dates {
  display: flex;
  flex-wrap: wrap;
}

.yiz-date-picker-cell {
  width: calc(100% / 7);
  text-align: center;
  cursor: pointer;
  padding: 2px 0;

  &--other {
    cursor: default;

    .yiz-date-picker-cell-inner {
      color: #d9d9d9;
    }
  }

  &--disabled {
    cursor: not-allowed;

    .yiz-date-picker-cell-inner {
      color: #d9d9d9;
    }
  }

  &--today .yiz-date-picker-cell-inner {
    color: var(--yiz-color-primary);
    font-weight: 600;
  }

  &--selected {
    .yiz-date-picker-cell-inner {
      background: var(--yiz-color-primary);
      color: #fff;
      border-radius: 4px;
    }
  }
}

.yiz-date-picker-cell-inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 13px;
  color: #333;
  border-radius: 4px;
  transition:
    background 0.2s,
    color 0.2s;

  &:hover {
    background: var(--yiz-color-hover-bg);
  }
}

.yiz-date-picker-cell--selected .yiz-date-picker-cell-inner:hover {
  background: var(--yiz-color-primary-heary);
}

.yiz-date-picker-cell--disabled .yiz-date-picker-cell-inner:hover,
.yiz-date-picker-cell--other .yiz-date-picker-cell-inner:hover {
  background: transparent;
}

// 底部
.yiz-date-picker-footer {
  text-align: center;
  padding-top: 8px;
  margin-top: 4px;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-date-picker-today {
  font-size: 13px;
  color: var(--yiz-color-primary);
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

// 过渡
.yiz-date-picker-panel-fade-enter-active,
.yiz-date-picker-panel-fade-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.yiz-date-picker-panel-fade-enter-from,
.yiz-date-picker-panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
