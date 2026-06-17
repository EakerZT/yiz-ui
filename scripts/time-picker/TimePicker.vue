<template>
  <div ref="triggerRef" class="yiz-time-picker" :class="vClass" @click="onTriggerClick">
    <div class="yiz-time-picker-input">
      <span class="yiz-time-picker-prefix" v-if="$props.prefix || $slots.prefix">
        <template v-if="$props.prefix">{{ $props.prefix }}</template>
        <slot v-else name="prefix" />
      </span>
      <input
        ref="inputRef"
        :value="displayText"
        :placeholder="placeholderText"
        :disabled="disabled"
        readonly
      />
      <span v-if="clearable && modelValue != null" class="yiz-time-picker-clear" @click.stop="onClear">
        <Icon size="14" :icon="DismissCircle32Filled" />
      </span>
      <span class="yiz-time-picker-extra-suffix" v-if="$props.suffix || $slots.suffix">
        <template v-if="$props.suffix">{{ $props.suffix }}</template>
        <slot v-else name="suffix" />
      </span>
      <svg class="yiz-time-picker-suffix" viewBox="0 0 16 16" width="14" height="14">
        <path d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1zm0 3a.5.5 0 0 0-.5.5v3.5h-3a.5.5 0 0 0 0 1h3.5v3.5a.5.5 0 0 0 1 0V8.5H12a.5.5 0 0 0 0-1H8.5V4.5A.5.5 0 0 0 8 4z" fill="currentColor" />
      </svg>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="yiz-time-picker-panel-fade">
      <div
        v-if="open"
        ref="panelRef"
        class="yiz-time-picker-panel"
        :style="panelStyle"
        @click.stop
      >
        <div class="yiz-time-picker-body">
          <!-- 时 -->
          <div class="yiz-time-picker-col">
            <div class="yiz-time-picker-col-header">{{ $t('timePicker.hour') }}</div>
            <div class="yiz-time-picker-col-list" ref="hourListRef">
              <div
                v-for="h in hours"
                :key="h"
                class="yiz-time-picker-col-item"
                :class="{ 'yiz-time-picker-col-item--active': h === pickedHour }"
                @click="pickedHour = h"
              >
                {{ pad(h) }}
              </div>
            </div>
          </div>
          <!-- 分 -->
          <div class="yiz-time-picker-col">
            <div class="yiz-time-picker-col-header">{{ $t('timePicker.minute') }}</div>
            <div class="yiz-time-picker-col-list" ref="minuteListRef">
              <div
                v-for="m in minutes"
                :key="m"
                class="yiz-time-picker-col-item"
                :class="{ 'yiz-time-picker-col-item--active': m === pickedMinute }"
                @click="pickedMinute = m"
              >
                {{ pad(m) }}
              </div>
            </div>
          </div>
          <!-- 秒 -->
          <div v-if="showSeconds" class="yiz-time-picker-col">
            <div class="yiz-time-picker-col-header">{{ $t('timePicker.second') }}</div>
            <div class="yiz-time-picker-col-list">
              <div
                v-for="s in 60"
                :key="s - 1"
                class="yiz-time-picker-col-item"
                :class="{ 'yiz-time-picker-col-item--active': (s - 1) === pickedSecond }"
                @click="pickedSecond = s - 1"
              >
                {{ pad(s - 1) }}
              </div>
            </div>
          </div>
        </div>
        <div class="yiz-time-picker-footer">
          <LinkButton @click="onNow">{{ $t('timePicker.now') }}</LinkButton>
          <Button type="primary" size="small" @click="onConfirm">{{ $t('common.confirm') }}</Button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { DismissCircle32Filled } from '@vicons/fluent'
import Button from '../button/Button.vue'
import { Icon } from '../icon'
import LinkButton from '../link-button/LinkButton.vue'
import { $t } from '../locale'
import { nextZIndex } from '../zIndex'

const props = withDefaults(
  defineProps<{
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    size?: 'default' | 'small'
    showSeconds?: boolean
    format?: string
    prefix?: string
    suffix?: string
  }>(),
  {
    disabled: false,
    clearable: false,
    size: 'default',
    showSeconds: false,
    format: 'HH:mm:ss'
  }
)

const emit = defineEmits<{
  change: [value: string | null]
}>()

const modelValue = defineModel<string | null>('modelValue')

// ==================== 状态 ====================

const open = ref(false)
const currentZIndex = ref(0)
const triggerRef = ref<HTMLElement>()
const panelRef = ref<HTMLElement>()
const inputRef = ref<HTMLInputElement>()
const hourListRef = ref<HTMLElement>()
const minuteListRef = ref<HTMLElement>()

const pickedHour = ref(0)
const pickedMinute = ref(0)
const pickedSecond = ref(0)

const hours = Array.from({ length: 24 }, (_, i) => i)
const minutes = Array.from({ length: 60 }, (_, i) => i)
const placeholderText = computed(() => props.placeholder ?? $t('timePicker.placeholder'))

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

// ==================== 定位 ====================

const dropdownPos = ref<{ top?: string; bottom?: string; left?: string }>({})

const panelStyle = computed(() => ({
  zIndex: currentZIndex.value + 1,
  ...dropdownPos.value
}))

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

watch(open, async (val) => {
  if (val) {
    await nextTick()
    repositionPanel()
    // 滚动到选中项
    scrollToSelected()
  }
})

// ==================== 滚动到选中项 ====================

function scrollToSelected() {
  nextTick(() => {
    const hourEl = hourListRef.value
    const minuteEl = minuteListRef.value
    if (hourEl) {
      const item = hourEl.children[pickedHour.value] as HTMLElement
      if (item) {
        hourEl.scrollTop = item.offsetTop - hourEl.offsetHeight / 2 + item.offsetHeight / 2
      }
    }
    if (minuteEl) {
      const item = minuteEl.children[pickedMinute.value] as HTMLElement
      if (item) {
        minuteEl.scrollTop = item.offsetTop - minuteEl.offsetHeight / 2 + item.offsetHeight / 2
      }
    }
  })
}

// ==================== 计算属性 ====================

const displayText = computed(() => {
  if (open.value) return buildValue()
  if (modelValue.value == null) return ''
  return modelValue.value
})

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (open.value) c['yiz-time-picker-open'] = true
  if (props.disabled) c['yiz-time-picker-disabled'] = true
  if (props.size === 'small') c['yiz-time-picker-small'] = true
  return c
})

function buildValue(): string {
  const hh = pad(pickedHour.value)
  const mm = pad(pickedMinute.value)
  const ss = pad(pickedSecond.value)

  let result = props.format
    .replace(/HH/g, hh)
    .replace(/mm/g, mm)
    .replace(/ss/g, ss)
    .replace(/H/g, `${pickedHour.value}`)
    .replace(/m/g, `${pickedMinute.value}`)
    .replace(/s/g, `${pickedSecond.value}`)
  return result
}

function parseValue(val: string) {
  if (val.length >= 5) {
    const parts = val.split(/[:：]/)
    if (parts.length >= 2) {
      pickedHour.value = Math.min(23, Math.max(0, parseInt(parts[0]) || 0))
      pickedMinute.value = Math.min(59, Math.max(0, parseInt(parts[1]) || 0))
      if (parts.length >= 3) {
        pickedSecond.value = Math.min(59, Math.max(0, parseInt(parts[2]) || 0))
      }
    }
  }
}

// ==================== 操作 ====================

function onTriggerClick() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    currentZIndex.value = nextZIndex()
    if (modelValue.value) {
      parseValue(modelValue.value)
    } else {
      const now = new Date()
      pickedHour.value = now.getHours()
      pickedMinute.value = now.getMinutes()
      pickedSecond.value = now.getSeconds()
    }
  }
}

function onClear() {
  modelValue.value = null
  emit('change', null)
}

function onNow() {
  const now = new Date()
  pickedHour.value = now.getHours()
  pickedMinute.value = now.getMinutes()
  pickedSecond.value = now.getSeconds()
  scrollToSelected()
}

function onConfirm() {
  modelValue.value = buildValue()
  emit('change', modelValue.value)
  open.value = false
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
  focus: () => inputRef.value?.focus()
})
</script>

<style lang="less">
.yiz-time-picker {
  display: flex;
  align-items: center;
  position: relative;
  min-width: 140px;
  box-sizing: border-box;
}

.yiz-time-picker-input {
  display: inline-flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 32px;
  padding: 0 11px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.3s, box-shadow 0.3s;
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

.yiz-time-picker-open .yiz-time-picker-input {
  border-color: var(--yiz-color-primary);
  box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
}

.yiz-form-item-error-status .yiz-time-picker:not(.yiz-time-picker-disabled) .yiz-time-picker-input {
  border-color: var(--yiz-color-error);

  &:hover {
    border-color: var(--yiz-color-error);
  }
}

.yiz-form-item-error-status .yiz-time-picker-open:not(.yiz-time-picker-disabled) .yiz-time-picker-input {
  border-color: var(--yiz-color-error);
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
}

.yiz-time-picker-disabled .yiz-time-picker-input {
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

.yiz-time-picker-small .yiz-time-picker-input {
  height: 24px;

  input {
    font-size: 13px;
  }
}

.yiz-time-picker-clear {
  display: inline-flex;
  align-items: center;
  margin-left: 8px;
  margin-right: 4px;
  user-select: none;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  transition: 0.3s all;

  &:hover {
    color: rgba(0, 0, 0, 0.88);
  }
}

.yiz-time-picker-prefix,
.yiz-time-picker-extra-suffix {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: #666;
  user-select: none;
}

.yiz-time-picker-suffix {
  flex-shrink: 0;
  color: #999;
}

// ==================== 面板 ====================

.yiz-time-picker-panel {
  position: fixed;
  background: #fff;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  user-select: none;
  width: 200px;
}

.yiz-time-picker-body {
  display: flex;
  padding: 8px;
  gap: 4px;
}

.yiz-time-picker-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.yiz-time-picker-col-header {
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 4px 0;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
  margin-bottom: 2px;
  flex-shrink: 0;
}

.yiz-time-picker-col-list {
  flex: 1;
  overflow-y: auto;
  max-height: 180px;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.yiz-time-picker-col-item {
  text-align: center;
  padding: 6px 0;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: var(--yiz-color-hover-bg);
  }

  &--active {
    color: var(--yiz-color-primary);
    background: var(--yiz-color-primary-light8);
    font-weight: 600;
  }
}

// 底部
.yiz-time-picker-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
}

// 过渡
.yiz-time-picker-panel-fade-enter-active,
.yiz-time-picker-panel-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.yiz-time-picker-panel-fade-enter-from,
.yiz-time-picker-panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
