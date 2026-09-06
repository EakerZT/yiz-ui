<template>
  <div
    ref="triggerRef"
    class="yiz-date-picker"
    :class="vClass"
    @click="onTriggerClick"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    v-bind="$attrs"
  >
    <div class="yiz-date-picker-input">
      <span class="yiz-date-picker-prefix" v-if="$props.prefix || $slots.prefix">
        <template v-if="$props.prefix">{{ $props.prefix }}</template>
        <slot v-else name="prefix" />
      </span>
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
      <Transition name="yiz-date-picker-clear-zoom">
        <span
          v-if="clearable && modelValue && !disabled && !readonly && (isHovering || open)"
          class="yiz-date-picker-clear"
          @click.stop="onClear"
        >
          <Icon size="16" :icon="DismissCircle16Filled" />
        </span>
      </Transition>
      <span class="yiz-date-picker-extra-suffix" v-if="$props.suffix || $slots.suffix">
        <template v-if="$props.suffix">{{ $props.suffix }}</template>
        <slot v-else name="suffix" />
      </span>
      <Icon
        :class="{
          'yiz-date-picker-suffix--hidden': clearable && modelValue && !disabled && !readonly && (isHovering || open),
        }"
        class="yiz-date-picker-suffix"
        size="16"
        :icon="CalendarLtr16Regular"
      />
    </div>
  </div>

  <AppTeleport>
    <Transition name="yiz-date-picker-panel-fade">
      <div v-if="open" ref="panelRef" class="yiz-date-picker-panel" :style="panelStyle" @click.stop>
        <!-- 年、月、日期面板导航 -->
        <div class="yiz-date-picker-header" @keydown.enter.stop>
          <Icon class="yiz-date-picker-nav" size="16" :icon="ChevronDoubleLeft16Regular" @click="prevYear" />
          <Icon
            v-if="panelMode === 'date'"
            class="yiz-date-picker-nav"
            size="16"
            :icon="ChevronLeft16Regular"
            @click="prevMonth"
          />
          <div class="yiz-date-picker-month-year">
            <span v-if="panelMode === 'year'" class="yiz-date-picker-year-range">
              {{ t('datePicker.yearRange', { start: decadeStart, end: decadeStart + 9 }) }}
            </span>
            <template v-else>
              <button type="button" class="yiz-date-picker-header-label" @click="panelMode = 'year'">
                {{ t('datePicker.year', { year }) }}
              </button>
              <button
                v-if="panelMode === 'date'"
                type="button"
                class="yiz-date-picker-header-label"
                @click="panelMode = 'month'"
              >
                {{ t('datePicker.month', { month }) }}
              </button>
            </template>
          </div>
          <Icon
            v-if="panelMode === 'date'"
            class="yiz-date-picker-nav"
            size="16"
            :icon="ChevronRight16Regular"
            @click="nextMonth"
          />
          <Icon class="yiz-date-picker-nav" size="16" :icon="ChevronDoubleRight16Regular" @click="nextYear" />
        </div>

        <!-- 年份快速选择 -->
        <div v-if="panelMode === 'year'" class="yiz-date-picker-year-grid" @keydown.enter.stop>
          <button
            v-for="y in yearRange"
            :key="y"
            type="button"
            class="yiz-date-picker-year-item"
            :class="{
              'yiz-date-picker-year-item--active': y === year,
              'yiz-date-picker-year-item--other': y < decadeStart || y > decadeStart + 9,
            }"
            @click="selectYear(y)"
          >
            {{ y }}
          </button>
        </div>

        <!-- 月份快速选择 -->
        <div v-else-if="panelMode === 'month'" class="yiz-date-picker-month-grid" @keydown.enter.stop>
          <button
            v-for="m in 12"
            :key="m"
            type="button"
            class="yiz-date-picker-month-item"
            :class="{ 'yiz-date-picker-month-item--active': m === month }"
            @click="selectMonth(m)"
          >
            {{ t('datePicker.month', { month: m }) }}
          </button>
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
                'yiz-date-picker-cell--disabled': cell.disabled,
              }"
              @click="onCellClick(cell)"
            >
              <span class="yiz-date-picker-cell-inner">{{ cell.day }}</span>
            </div>
          </div>
        </div>

        <!-- 底部 -->
        <div v-if="panelMode === 'date'" class="yiz-date-picker-footer">
          <LinkButton @click="onToday">{{ t('datePicker.today') }}</LinkButton>
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
  CalendarLtr16Regular,
  ChevronDoubleLeft16Regular,
  ChevronDoubleRight16Regular,
  ChevronLeft16Regular,
  ChevronRight16Regular,
  DismissCircle16Filled,
} from '@vicons/fluent'
import { Icon } from '../icon'
import { useInputStyle } from '../input-style'
import Button from '../button/Button.vue'
import LinkButton from '../link-button/LinkButton.vue'
import { useLocale } from '../locale'
import { useOverlayElement } from '../overlay/overlayScope'
import { useZIndexManager } from '../zIndex'

const t = useLocale()

const props = withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    clearable?: boolean
    size?: 'small' | 'default' | 'large'
    styleMode?: 'outlined' | 'filled'
    disabledDate?: (date: Date) => boolean
    format?: string
    valueFormat?: string
    prefix?: string
    suffix?: string
  }>(),
  {
    disabled: false,
    readonly: false,
    clearable: false,
    format: 'YYYY-MM-DD',
  },
)

type DatePickerValue = Date | string | null

const emit = defineEmits<{
  change: [date: DatePickerValue]
}>()

const modelValue = defineModel<DatePickerValue>('value')

// ==================== 状态 ====================

const open = ref(false)
const currentZIndex = ref(0)
const zIndexManager = useZIndexManager()
const triggerRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
useOverlayElement(panelRef, open)
const inputRef = ref<HTMLInputElement>()
const panelMode = ref<'date' | 'month' | 'year'>('date')
const isHovering = ref(false)
const inputFocused = ref(false)
const inputDirty = ref(false)
const inputText = ref('')
const draft = ref<Date | null>(null)

const now = new Date()
const viewYear = ref(now.getFullYear())
const viewMonth = ref(now.getMonth() + 1)

const weekDays = computed(() => t.list('datePicker.weekdays'))

// ==================== 计算属性 ====================

const year = computed(() => viewYear.value)
const month = computed(() => viewMonth.value)
const placeholderText = computed(() => props.placeholder ?? t('datePicker.placeholder'))

const decadeStart = computed(() => Math.floor(viewYear.value / 10) * 10)

const yearRange = computed(() => {
  const start = decadeStart.value - 1
  const result: number[] = []
  for (let i = 0; i < 12; i++) {
    result.push(start + i)
  }
  return result
})

const { styleMode: mergedStyleMode, size: mergedSize } = useInputStyle(
  () => props.styleMode,
  () => props.size,
)

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  c[`yiz-date-picker-${mergedStyleMode.value}`] = true
  if (open.value) c['yiz-date-picker-open'] = true
  if (props.disabled) c['yiz-date-picker-disabled'] = true
  if (props.readonly) c['yiz-date-picker-readonly'] = true
  if (mergedSize.value === 'small') c['yiz-date-picker-small'] = true
  if (mergedSize.value === 'large') c['yiz-date-picker-large'] = true
  return c
})

const confirmDisabled = computed(() => draft.value == null)

const panelStyle = computed(() => ({
  zIndex: currentZIndex.value + 1,
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
    isSelected: sameDate(draft.value, date),
    disabled: props.disabledDate ? props.disabledDate(date) : false,
    date,
  }
}

function sameDate(a: Date | null | undefined, b: Date): boolean {
  return !!a && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function cloneDate(date: Date | null | undefined): Date | null {
  return date ? new Date(date.getFullYear(), date.getMonth(), date.getDate()) : null
}

// ==================== 日期格式化 ====================

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
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
  return fmt.replace(/YYYY|yyyy|MM|DD|dd|M|D|d/g, (k) => map[k] || k)
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

function parseModelValue(value: DatePickerValue | undefined): Date | null {
  if (value == null) return null
  if (value instanceof Date) return cloneDate(value)
  return parseDate(value, props.valueFormat ?? props.format)
}

function formatModelValue(date: Date | null): DatePickerValue {
  if (!date) return null
  if (props.valueFormat) return formatDate(date, props.valueFormat)
  return cloneDate(date)
}

function formatInputText(date: Date | null): string {
  return date ? formatDate(date, props.format) : ''
}

function parseInputText(value: string): Date | null {
  const parsed = parseDate(value, props.format)
  if (!parsed) return null
  if (props.disabledDate?.(parsed)) return null
  return parsed
}

function syncInputTextFromModel() {
  inputText.value = formatInputText(parseModelValue(modelValue.value))
}

function syncInputTextFromDraft() {
  inputText.value = formatInputText(draft.value)
}

function applyInputText(value: string): Date | null {
  const parsed = parseInputText(value)
  if (!parsed) return null
  draft.value = cloneDate(parsed)
  viewYear.value = parsed.getFullYear()
  viewMonth.value = parsed.getMonth() + 1
  panelMode.value = 'date'
  return parsed
}

function openPanel() {
  if (props.disabled || props.readonly) return
  if (open.value) return
  currentZIndex.value = zIndexManager.next()
  panelMode.value = 'date'
  const currentDate = parseModelValue(modelValue.value)
  draft.value = cloneDate(currentDate)
  if (currentDate) {
    viewYear.value = currentDate.getFullYear()
    viewMonth.value = currentDate.getMonth() + 1
  }
  syncInputTextFromDraft()
  inputDirty.value = false
  open.value = true
}

// ==================== 操作 ====================

function onTriggerClick() {
  if (props.disabled || props.readonly) return
  openPanel()
  nextTick(() => inputRef.value?.focus())
}

function onInputFocus() {
  if (props.disabled || props.readonly) return
  inputFocused.value = true
  openPanel()
}

function onInput(e: Event) {
  if (props.disabled || props.readonly) return
  const value = (e.target as HTMLInputElement).value
  inputText.value = value
  inputDirty.value = true
  applyInputText(value)
}

function onInputBlur() {
  inputFocused.value = false
  if (!inputDirty.value) return

  applyInputText(inputText.value)
  syncInputTextFromDraft()
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
  draft.value = cloneDate(cell.date)
  syncInputTextFromDraft()
  inputDirty.value = false
}

function onToday() {
  if (props.disabled || props.readonly) return
  const today = new Date()
  const date = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  draft.value = date
  viewYear.value = date.getFullYear()
  viewMonth.value = date.getMonth() + 1
  syncInputTextFromDraft()
  inputDirty.value = false
}

function onConfirm() {
  if (props.disabled || props.readonly || panelMode.value !== 'date') return
  if (inputDirty.value) {
    if (!applyInputText(inputText.value)) return
    inputDirty.value = false
  }
  if (confirmDisabled.value) return
  modelValue.value = formatModelValue(draft.value)
  emit('change', modelValue.value)
  syncInputTextFromDraft()
  open.value = false
}

function confirmFromInput() {
  if (!open.value) {
    openPanel()
  }
  onConfirm()
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
  viewYear.value -= panelMode.value === 'year' ? 10 : 1
}

function nextYear() {
  viewYear.value += panelMode.value === 'year' ? 10 : 1
}

function selectYear(y: number) {
  viewYear.value = y
  panelMode.value = 'month'
}

function selectMonth(m: number) {
  viewMonth.value = m
  panelMode.value = 'date'
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
  } else {
    inputDirty.value = false
    syncInputTextFromModel()
  }
})

watch(panelMode, async () => {
  if (!open.value) return
  await nextTick()
  repositionPanel()
})

watch(
  () => [modelValue.value, props.format, props.valueFormat],
  () => {
    if (!open.value && !inputFocused.value) {
      syncInputTextFromModel()
    }
  },
  { immediate: true },
)

watch(
  () => [props.disabled, props.readonly],
  ([disabled, readonly]) => {
    if (disabled || readonly) {
      open.value = false
      panelMode.value = 'date'
    }
  },
)

function onClickOutside(e: MouseEvent) {
  if (!open.value) return
  const target = e.target as HTMLElement
  if (triggerRef.value?.contains(target)) return
  if (panelRef.value?.contains(target)) return
  open.value = false
  panelMode.value = 'date'
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
    panelMode.value = 'date'
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
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
})
</script>

<style lang="less">
.yiz-date-picker {
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
}

.yiz-date-picker-input {
  --yiz-date-picker-padding-inline: var(--yiz-control-padding-inline-default);
  --yiz-date-picker-affix-gap: var(--yiz-control-affix-gap-default);

  display: inline-flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  width: 100%;
  position: relative;
  height: var(--yiz-control-height-default);
  padding: 0 var(--yiz-date-picker-padding-inline);
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-base-border-radius-default);
  background: var(--yiz-color-bg-container);
  cursor: pointer;
  font-size: var(--yiz-font-size-default);
  line-height: 1;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  box-sizing: border-box;
  gap: var(--yiz-date-picker-affix-gap);

  &:hover {
    border-color: var(--yiz-color-primary);
  }

  input {
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    box-sizing: border-box;
    background: transparent;
    font-size: var(--yiz-font-size-default);
    color: var(--yiz-color-text-primary);
    cursor: text;
    min-width: 0;

    &::placeholder {
      color: var(--yiz-color-text-disabled);
    }

    &:disabled {
      cursor: not-allowed;
      color: var(--yiz-color-text-disabled);
    }
  }
}

.yiz-date-picker-open .yiz-date-picker-input {
  border-color: var(--yiz-color-primary);
  box-shadow: var(--yiz-control-focus-shadow);
}

.yiz-form-item-error-status .yiz-date-picker:not(.yiz-date-picker-disabled) .yiz-date-picker-input {
  border-color: var(--yiz-color-error);

  &:hover {
    border-color: var(--yiz-color-error);
  }
}

.yiz-form-item-error-status .yiz-date-picker-open:not(.yiz-date-picker-disabled) .yiz-date-picker-input {
  border-color: var(--yiz-color-error);
  box-shadow: var(--yiz-control-error-focus-shadow);
}

.yiz-date-picker-disabled .yiz-date-picker-input {
  background: var(--yiz-color-bg-muted);
  cursor: not-allowed;

  &:hover {
    border-color: var(--yiz-color-border, #d9d9d9);
  }

  input {
    cursor: not-allowed;
    color: var(--yiz-color-text-disabled);
  }
}

.yiz-date-picker-small .yiz-date-picker-input {
  --yiz-date-picker-padding-inline: var(--yiz-control-padding-inline-small);
  --yiz-date-picker-affix-gap: var(--yiz-control-affix-gap-small);

  height: var(--yiz-control-height-small);
  border-radius: var(--yiz-base-border-radius-small);
  font-size: var(--yiz-font-size-small);

  input {
    font-size: var(--yiz-font-size-small);
  }
}

.yiz-date-picker-large .yiz-date-picker-input {
  --yiz-date-picker-padding-inline: var(--yiz-control-padding-inline-large);
  --yiz-date-picker-affix-gap: var(--yiz-control-affix-gap-large);

  height: var(--yiz-control-height-large);
  border-radius: var(--yiz-base-border-radius-large);
  font-size: var(--yiz-font-size-large);

  input {
    font-size: var(--yiz-font-size-large);
  }
}

.yiz-date-picker-clear {
  position: absolute;
  right: var(--yiz-date-picker-padding-inline);
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  align-items: center;
  user-select: none;
  cursor: pointer;
  color: var(--yiz-color-text-tertiary);
  transition: color 0.3s;
  z-index: 1;

  &:hover {
    color: var(--yiz-color-text-primary);
  }
}

.yiz-date-picker-prefix,
.yiz-date-picker-extra-suffix {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: var(--yiz-color-text-secondary);
  user-select: none;
}

.yiz-date-picker-suffix {
  flex-shrink: 0;
  color: var(--yiz-color-text-tertiary);
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
  background: var(--yiz-color-bg-elevated);
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-pane-border-radius);
  box-shadow: var(--yiz-shadow-popup);
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
  color: var(--yiz-color-text-secondary);
  border-radius: 2px;
  flex-shrink: 0;
  transition: color 0.2s;

  &:hover {
    color: var(--yiz-color-primary);
  }
}

.yiz-date-picker-month-year {
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

.yiz-date-picker-header-label {
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

.yiz-date-picker-year-range {
  padding: 2px 0;
  color: var(--yiz-color-primary);
}

// 年份和月份选择：三列四行
.yiz-date-picker-year-grid,
.yiz-date-picker-month-grid {
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

.yiz-date-picker-year-item,
.yiz-date-picker-month-item {
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

  &--other {
    color: var(--yiz-color-text-disabled);
  }

  &--active,
  &--active:hover {
    color: var(--yiz-color-primary);
    background: var(--yiz-color-primary-bg-hover);
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
  color: var(--yiz-color-text-tertiary);
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
      color: var(--yiz-color-text-disabled);
    }
  }

  &--disabled {
    cursor: not-allowed;

    .yiz-date-picker-cell-inner {
      color: var(--yiz-color-text-disabled);
    }
  }

  &--today .yiz-date-picker-cell-inner {
    color: var(--yiz-color-primary);
    font-weight: 600;
  }

  &--selected {
    .yiz-date-picker-cell-inner,
    .yiz-date-picker-cell-inner:hover {
      background: var(--yiz-color-primary);
      color: var(--yiz-color-on-primary);
      border-radius: var(--yiz-pane-item-border-radius);
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
  color: var(--yiz-color-text-primary);
  border-radius: var(--yiz-pane-item-border-radius);
  transition:
    background 0.2s,
    color 0.2s;

  &:hover {
    background: var(--yiz-color-hover-bg);
  }
}

.yiz-date-picker-cell--disabled .yiz-date-picker-cell-inner:hover,
.yiz-date-picker-cell--other .yiz-date-picker-cell-inner:hover {
  background: transparent;
}

// 底部
.yiz-date-picker-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  margin: 8px -12px -8px;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
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

.yiz-date-picker-readonly .yiz-date-picker-input,
.yiz-date-picker-readonly .yiz-date-picker-input input {
  cursor: default;
}
</style>
