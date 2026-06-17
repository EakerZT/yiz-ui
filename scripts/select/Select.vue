<template>
  <div ref="triggerRef" class="yiz-select" :class="vClass" @click="onTriggerClick" v-bind="$attrs">
    <span class="yiz-select-prefix" v-if="$props.prefix || $slots.prefix">
      <template v-if="$props.prefix">{{ $props.prefix }}</template>
      <slot v-else name="prefix" />
    </span>
    <span class="yiz-select-label" :class="{ 'yiz-select-placeholder': !selectedLabel }">
      {{ selectedLabel || placeholderText }}
    </span>
    <span class="yiz-select-suffix">
      <span v-if="clearable && modelValue != null" class="yiz-select-clear" @click.stop="onClear">
        <Icon size="14" :icon="DismissCircle32Filled" />
      </span>
      <span class="yiz-select-extra-suffix" v-if="$props.suffix || $slots.suffix">
        <template v-if="$props.suffix">{{ $props.suffix }}</template>
        <slot v-else name="suffix" />
      </span>
      <svg class="yiz-select-arrow" :class="{ 'yiz-select-arrow-up': open }" viewBox="0 0 16 16" width="14" height="14">
        <path
          d="M4 6l4 4 4-4"
          stroke="currentColor"
          stroke-width="1.5"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
  </div>
  <Teleport to="body">
    <Transition name="yiz-select-dropdown-fade">
      <div v-if="open" class="yiz-select-dropdown" :style="dropdownStyle" ref="dropdownRef">
        <div v-if="search" class="yiz-select-search-wrap" @click.stop>
          <Input
            ref="searchInputRef"
            v-model:value="searchQuery"
            :placeholder="$t('select.searchPlaceholder')"
            @keydown.stop
          />
        </div>
        <ScrollBox :max-height="scrollBoxMaxHeight">
          <div
            v-for="(opt, idx) in filteredOptions"
            :key="idx"
            class="yiz-select-option"
            :class="{
              'yiz-select-option-selected': isSelected(opt),
              'yiz-select-option-hover': hoverIndex === idx
            }"
            @click.stop="onSelect(opt)"
            @mouseenter="hoverIndex = idx"
          >
            <slot name="option" :option="opt" :index="idx" :selected="isSelected(opt)">
              {{ opt.label }}
            </slot>
          </div>
          <div v-if="filteredOptions.length === 0" class="yiz-select-empty">{{ $t('common.noData') }}</div>
        </ScrollBox>
      </div>
    </Transition>
  </Teleport>
  <div style="display: none"><slot /></div>
</template>

<script lang="ts" setup>
import { computed, Fragment, nextTick, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue'
import { DismissCircle32Filled } from '@vicons/fluent'
import { Icon } from '../icon'
import { Input } from '../input'
import { $t } from '../locale'
import { ScrollBox } from '../scroll-box'
import SelectOptionComp from '../select-option/SelectOption.vue'
import { nextZIndex } from '../zIndex'

export interface SelectOption {
  label: string
  value: any
}

const props = withDefaults(
  defineProps<{
    options?: SelectOption[]
    placeholder?: string
    disabled?: boolean
    clearable?: boolean
    size?: 'default' | 'small'
    prefix?: string
    suffix?: string
    search?: (query: string) => SelectOption[] | Promise<SelectOption[]>
  }>(),
  {
    options: () => [],
    disabled: false,
    clearable: false,
    size: 'default'
  }
)

defineSlots<{
  default?: () => any
  prefix?: any
  suffix?: any
  option?: (props: { option: SelectOption; index: number; selected: boolean }) => any
}>()

const emit = defineEmits<{
  change: [option: SelectOption | null]
}>()

const modelValue = defineModel<any>('modelValue')

const slots = useSlots()

// 递归展平 Fragment，确保包裹组件或 v-for 生成的 SelectOption 能被正确提取
function collectOptionVNodes(nodes: any[]): any[] {
  const result: any[] = []
  for (const vnode of nodes) {
    if (vnode && (vnode as any).type === Fragment) {
      const children = (vnode as any).children as any[]
      if (children) {
        result.push(...collectOptionVNodes(children))
      }
    } else if (vnode && vnode.type === SelectOptionComp) {
      result.push(vnode)
    }
  }
  return result
}

const slotOptions = computed(() => {
  const nodes = collectOptionVNodes(slots.default?.() ?? [])
  const opts: SelectOption[] = []
  for (const vnode of nodes) {
    if (vnode.props) {
      const p = vnode.props as Record<string, any>
      if (p.item) {
        opts.push(p.item)
      } else {
        opts.push({ label: p.label, value: p.value })
      }
    }
  }
  return opts
})

const allOptions = computed(() => {
  return slotOptions.value.length > 0 ? slotOptions.value : props.options
})

const open = ref(false)
const currentZIndex = ref(0)
const triggerRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()
const hoverIndex = ref(-1)
const searchQuery = ref('')
const searchInputRef = ref<InstanceType<typeof Input>>()
const scrollBoxMaxHeight = ref(240)
const dropdownPos = ref<{ top?: string; bottom?: string; left?: string }>({})

const filteredOptions = ref<SelectOption[]>([...allOptions.value])

watch(searchQuery, async (q) => {
  if (!props.search || !q) {
    filteredOptions.value = [...allOptions.value]
    return
  }
  const result = props.search(q)
  if (result instanceof Promise) {
    filteredOptions.value = await result
  } else {
    filteredOptions.value = result
  }
})

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (open.value) c['yiz-select-open'] = true
  if (props.disabled) c['yiz-select-disabled'] = true
  if (props.size === 'small') c['yiz-select-small'] = true
  return c
})

const selectedLabel = computed(() => {
  const opt = allOptions.value.find((o) => o.value === modelValue.value)
  return opt ? opt.label : ''
})
const placeholderText = computed(() => props.placeholder ?? $t('select.placeholder'))

const dropdownStyle = computed(() => {
  const s: Record<string, string | number> = {
    zIndex: currentZIndex.value + 1
  }
  if (triggerRef.value) {
    s.minWidth = `${triggerRef.value.getBoundingClientRect().width}px`
  }
  return { ...s, ...dropdownPos.value }
})

function isSelected(opt: SelectOption) {
  return opt.value === modelValue.value
}

function onTriggerClick() {
  if (props.disabled) return
  open.value = !open.value
  if (open.value) {
    currentZIndex.value = nextZIndex()
    hoverIndex.value = -1
    searchQuery.value = ''
    filteredOptions.value = [...allOptions.value]
    if (props.search) {
      setTimeout(() => searchInputRef.value?.focus(), 50)
    }
  }
}

watch(allOptions, () => {
  filteredOptions.value = [...allOptions.value]
})

function repositionDropdown() {
  if (!dropdownRef.value || !triggerRef.value || !open.value) return
  const ddRect = dropdownRef.value.getBoundingClientRect()
  const triggerRect = triggerRef.value.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const gap = 4
  const margin = 8
  const maxDropdownHeight = 240

  const searchWrap = dropdownRef.value.querySelector('.yiz-select-search-wrap') as HTMLElement
  const searchHeight = searchWrap ? searchWrap.offsetHeight : 0
  const dropdownPaddingV = 8

  const spaceBelow = vh - triggerRect.bottom - gap - margin
  const spaceAbove = triggerRect.top - gap - margin

  const preferBelow = spaceBelow >= spaceAbove || spaceBelow >= maxDropdownHeight

  const pos: { top?: string; bottom?: string; left?: string } = {}

  if (preferBelow) {
    scrollBoxMaxHeight.value = Math.max(28, Math.min(maxDropdownHeight, spaceBelow) - searchHeight - dropdownPaddingV)
    pos.top = `${triggerRect.bottom + gap}px`
  } else {
    scrollBoxMaxHeight.value = Math.max(28, Math.min(maxDropdownHeight, spaceAbove) - searchHeight - dropdownPaddingV)
    pos.bottom = `${vh - triggerRect.top + gap}px`
  }

  // 水平方向：默认对齐触发器左边缘，右侧溢出时翻转
  let left = triggerRect.left
  if (left + ddRect.width > vw - margin) {
    // 右侧溢出：尝试右边缘对齐触发器右边缘
    left = triggerRect.right - ddRect.width
    if (left < margin) {
      left = margin
    }
  }
  if (left < margin) {
    left = margin
  }
  pos.left = `${left}px`

  dropdownPos.value = pos
}

// 打开后微调位置
watch(open, async (val) => {
  if (val) {
    await nextTick()
    repositionDropdown()
  }
})

function onSelect(opt: SelectOption) {
  modelValue.value = opt.value
  open.value = false
  emit('change', opt)
}

function onClear() {
  modelValue.value = undefined
  emit('change', null)
}

function onClickOutside(e: MouseEvent) {
  if (!open.value) return
  const target = e.target as HTMLElement
  if (triggerRef.value?.contains(target)) return
  if (dropdownRef.value?.contains(target)) return
  open.value = false
}

// keyboard
function onKeydown(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') {
    open.value = false
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    hoverIndex.value = Math.min(hoverIndex.value + 1, filteredOptions.value.length - 1)
    return
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    hoverIndex.value = Math.max(hoverIndex.value - 1, 0)
    return
  }
  if (e.key === 'Enter' && hoverIndex.value >= 0) {
    e.preventDefault()
    const opt = filteredOptions.value[hoverIndex.value]
    if (opt) onSelect(opt)
  }
}

// 滚动 / 窗口大小变化时重新定位
function onReposition() {
  if (open.value) {
    repositionDropdown()
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
.yiz-select {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  padding: 0 11px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  user-select: none;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  font-size: 14px;
  color: #333;
  min-width: 120px;
  box-sizing: border-box;
  position: relative;

  &:hover {
    border-color: var(--yiz-color-primary);
  }

  &.yiz-select-open {
    border-color: var(--yiz-color-primary);
    box-shadow: 0 0 0 2px rgba(5, 145, 255, 0.1);
  }

  &.yiz-select-disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    color: #c0c4cc;

    &:hover {
      border-color: var(--yiz-color-border, #d9d9d9);
    }
  }

  &.yiz-select-small {
    height: 24px;
    font-size: 13px;
  }

  .yiz-form-item-error-status &:not(.yiz-select-disabled) {
    border-color: var(--yiz-color-error);

    &:hover {
      border-color: var(--yiz-color-error);
    }

    &.yiz-select-open {
      border-color: var(--yiz-color-error);
      box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
    }
  }
}

.yiz-select-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.yiz-select-prefix,
.yiz-select-extra-suffix {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  color: #666;
  user-select: none;
}

.yiz-select-prefix {
  margin-right: 8px;
}

.yiz-select-extra-suffix {
  margin-right: 4px;
}

.yiz-select-placeholder {
  color: #c0c4cc;
}

.yiz-select-suffix {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
  flex-shrink: 0;
  color: #999;
}

.yiz-select-arrow {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.yiz-select-arrow-up {
    transform: rotate(180deg);
  }
}

.yiz-select-clear {
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

// dropdown
.yiz-select-dropdown {
  position: fixed;
  background: #fff;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 4px 0;
}

.yiz-select-search-wrap {
  padding: 6px 8px;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-select-option {
  margin: 4px;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;

  &:hover {
    background: var(--yiz-color-hover-bg);
  }

  &.yiz-select-option-hover {
    background: var(--yiz-color-hover-bg);
  }

  &.yiz-select-option-selected {
    color: var(--yiz-color-primary);
    background-color: var(--yiz-color-primary-light8);
    font-weight: 500;
  }
}

.yiz-select-empty {
  padding: 8px 12px;
  font-size: 14px;
  color: #c0c4cc;
  text-align: center;
}

// dropdown transition
.yiz-select-dropdown-fade-enter-active,
.yiz-select-dropdown-fade-leave-active {
  transition:
    opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.yiz-select-dropdown-fade-enter-from,
.yiz-select-dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
