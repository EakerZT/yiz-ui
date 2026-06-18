<template>
  <div ref="triggerRef" class="yiz-time-range-picker" :class="vClass" @click="onTriggerClick" v-bind="$attrs">
    <div class="yiz-time-range-picker-input">
      <span class="yiz-time-range-picker-prefix" v-if="$props.prefix || $slots.prefix">
        <template v-if="$props.prefix">{{ $props.prefix }}</template>
        <slot v-else name="prefix" />
      </span>
      <button
        class="yiz-time-range-picker-segment"
        :class="{ 'yiz-time-range-picker-segment-active': open && activeSide === 'start' }"
        type="button"
        :disabled="disabled"
        @click.stop="onSegmentClick('start')"
      >
        <span :class="{ 'yiz-time-range-picker-placeholder': !displayStart }">
          {{ displayStart || startPlaceholder }}
        </span>
      </button>
      <span class="yiz-time-range-picker-separator">{{ separator }}</span>
      <button
        class="yiz-time-range-picker-segment"
        :class="{ 'yiz-time-range-picker-segment-active': open && activeSide === 'end' }"
        type="button"
        :disabled="disabled"
        @click.stop="onSegmentClick('end')"
      >
        <span :class="{ 'yiz-time-range-picker-placeholder': !displayEnd }">
          {{ displayEnd || endPlaceholder }}
        </span>
      </button>
      <span
        v-if="clearable && (startModel != null || endModel != null) && !disabled"
        class="yiz-time-range-picker-clear"
        @click.stop="onClear"
      >
        <Icon size="14" :icon="DismissCircle32Filled" />
      </span>
      <span class="yiz-time-range-picker-extra-suffix" v-if="$props.suffix || $slots.suffix">
        <template v-if="$props.suffix">{{ $props.suffix }}</template>
        <slot v-else name="suffix" />
      </span>
      <Icon class="yiz-time-range-picker-suffix" size="16" :icon="Clock16Regular" />
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
            <div class="yiz-time-range-picker-side-title" @click="activeSide = 'start'">{{ startLabel }}</div>
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
            <div class="yiz-time-range-picker-side-title" @click="activeSide = 'end'">{{ endLabel }}</div>
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
import { Clock16Regular, DismissCircle32Filled } from '@vicons/fluent'
import Button from '../button/Button.vue'
import { Icon } from '../icon'
import LinkButton from '../link-button/LinkButton.vue'
import { $t } from '../locale'
import { nextZIndex } from '../zIndex'

type TimeRangeSide = 'start' | 'end'
type TimeUnit = 'hour' | 'minute' | 'second'

const startModel = defineModel<string | null>('start')
const endModel = defineModel<string | null>('end')

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    clearable?: boolean
    forceRange?: boolean
    size?: 'default' | 'small'
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
const activeSide = ref<TimeRangeSide>('start')
const currentZIndex = ref(0)
const triggerRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
const startHourListRef = ref<HTMLElement>()
const startMinuteListRef = ref<HTMLElement>()
const startSecondListRef = ref<HTMLElement>()
const endHourListRef = ref<HTMLElement>()
const endMinuteListRef = ref<HTMLElement>()
const endSecondListRef = ref<HTMLElement>()

const draftStart = ref<string | null>(null)
const draftEnd = ref<string | null>(null)

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
const startLabel = computed(() => props.startLabel ?? $t('timeRangePicker.startLabel'))
const endLabel = computed(() => props.endLabel ?? $t('timeRangePicker.endLabel'))
const separator = computed(() => props.separator)
const disabled = computed(() => props.disabled)
const clearable = computed(() => props.clearable)
const showSeconds = computed(() => props.showSeconds)
const confirmDisabled = computed(() => props.forceRange && (draftStart.value == null || draftEnd.value == null))
const displayStart = computed(() => (open.value ? draftStart.value : startModel.value) ?? '')
const displayEnd = computed(() => (open.value ? draftEnd.value : endModel.value) ?? '')

const panelStyle = computed(() => ({
  zIndex: currentZIndex.value + 1,
  ...dropdownPos.value
}))

const vClass = computed(() => ({
  'yiz-time-range-picker-open': open.value,
  'yiz-time-range-picker-disabled': props.disabled,
  'yiz-time-range-picker-small': props.size === 'small'
}))

watch(open, async (val) => {
  if (val) {
    await nextTick()
    repositionPanel()
    scrollToSelected()
  }
})

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) open.value = false
  }
)

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

function parseValue(value: string | null | undefined) {
  if (!value) return null
  const parts = value.split(/[:：]/)
  if (parts.length < 2) return null
  return {
    hour: Math.min(23, Math.max(0, parseInt(parts[0]) || 0)),
    minute: Math.min(59, Math.max(0, parseInt(parts[1]) || 0)),
    second: Math.min(59, Math.max(0, parseInt(parts[2]) || 0))
  }
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

function applyParsed(side: TimeRangeSide, value: string | null | undefined) {
  const parsed = parseValue(value)
  const fallback = parsed ?? getNowParts()
  if (side === 'start') {
    startHour.value = fallback.hour
    startMinute.value = fallback.minute
    startSecond.value = fallback.second
  } else {
    endHour.value = fallback.hour
    endMinute.value = fallback.minute
    endSecond.value = fallback.second
  }
}

function getNowParts() {
  const now = new Date()
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds()
  }
}

function openPanel(side: TimeRangeSide) {
  if (props.disabled) return
  activeSide.value = side
  draftStart.value = startModel.value ?? null
  draftEnd.value = endModel.value ?? null
  applyParsed('start', draftStart.value)
  applyParsed('end', draftEnd.value)
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
    return
  }
  activeSide.value = side
  scrollToSelected()
}

function setPicked(side: TimeRangeSide, unit: TimeUnit, value: number) {
  if (props.disabled) return
  activeSide.value = side
  if (side === 'start') {
    if (unit === 'hour') startHour.value = value
    if (unit === 'minute') startMinute.value = value
    if (unit === 'second') startSecond.value = value
    draftStart.value = buildValue('start')
  } else {
    if (unit === 'hour') endHour.value = value
    if (unit === 'minute') endMinute.value = value
    if (unit === 'second') endSecond.value = value
    draftEnd.value = buildValue('end')
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
  } else {
    endHour.value = now.hour
    endMinute.value = now.minute
    endSecond.value = now.second
    draftEnd.value = buildValue('end')
  }
  scrollToSelected()
}

function onConfirm() {
  if (props.disabled) return
  if (confirmDisabled.value) return
  startModel.value = draftStart.value
  endModel.value = draftEnd.value
  emit('change', draftStart.value, draftEnd.value)
  open.value = false
}

function onClear() {
  if (props.disabled) return
  startModel.value = null
  endModel.value = null
  draftStart.value = null
  draftEnd.value = null
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
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 4px;
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
  height: 24px;
  padding: 0 4px;
  border: none;
  border-radius: 3px;
  background: transparent;
  color: #333;
  cursor: pointer;
  font: inherit;
  text-align: center;
  transition:
    background 0.2s,
    color 0.2s;
}

.yiz-time-range-picker-segment:disabled {
  color: #c0c4cc;
  cursor: not-allowed;
}

.yiz-time-range-picker-segment:not(:disabled):hover,
.yiz-time-range-picker-segment-active {
  background: var(--yiz-color-primary-light9);
  color: var(--yiz-color-primary);
}

.yiz-time-range-picker-placeholder {
  color: #c0c4cc;
}

.yiz-time-range-picker-separator {
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

.yiz-time-range-picker-prefix,
.yiz-time-range-picker-extra-suffix {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  color: #666;
  user-select: none;
}

.yiz-time-range-picker-clear {
  margin-left: 8px;
  margin-right: 4px;
  user-select: none;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  transition: 0.3s all;
}

.yiz-time-range-picker-clear:hover {
  color: rgba(0, 0, 0, 0.88);
}

.yiz-time-range-picker-small .yiz-time-range-picker-input {
  height: 24px;
  font-size: 13px;
}

.yiz-time-range-picker-panel {
  position: fixed;
  width: 520px;
  background: #fff;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 6px;
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

.yiz-time-range-picker-side-title {
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  color: #666;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s;
}

.yiz-time-range-picker-side-active .yiz-time-range-picker-side-title,
.yiz-time-range-picker-side-title:hover {
  background: var(--yiz-color-primary-light9);
  color: var(--yiz-color-primary);
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
  border-radius: 4px;
  transition:
    background 0.15s,
    color 0.15s;
}

.yiz-time-range-picker-col-item:hover {
  background: var(--yiz-color-hover-bg);
}

.yiz-time-range-picker-col-item-active {
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
</style>
