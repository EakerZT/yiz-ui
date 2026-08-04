<template>
  <div
    ref="triggerRef"
    class="yiz-select"
    :class="vClass"
    :tabindex="disabled ? -1 : 0"
    role="combobox"
    aria-haspopup="listbox"
    :aria-expanded="open"
    :aria-controls="listboxId"
    :aria-activedescendant="activeOptionId"
    :aria-disabled="disabled || undefined"
    :aria-readonly="readonly || undefined"
    @click="onTriggerClick"
    @keydown.stop="onTriggerKeydown"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    v-bind="$attrs"
  >
    <span class="yiz-select-prefix" v-if="$props.prefix || $slots.prefix">
      <template v-if="$props.prefix">{{ $props.prefix }}</template>
      <slot v-else name="prefix" />
    </span>
    <span
      class="yiz-select-label"
      :class="{
        'yiz-select-label-multiple': multiple,
        'yiz-select-placeholder': !hasSelection,
      }"
    >
      <template v-if="multiple && selectedOptions.length > 0">
        <template v-for="(option, index) in selectedOptions" :key="index">
          <Tag
            class="yiz-select-selection-tag"
            :size="size"
            :closable="!disabled && !readonly"
            @close="onRemoveSelected(option)"
          >
            <SelectContentRenderer :content="option.label" />
          </Tag>
        </template>
      </template>
      <SelectContentRenderer v-else-if="selectedOption" :content="selectedOption.label" />
      <template v-else>{{ placeholderText }}</template>
    </span>
    <span class="yiz-select-suffix">
      <span class="yiz-select-extra-suffix" v-if="$props.suffix || $slots.suffix">
        <template v-if="$props.suffix">{{ $props.suffix }}</template>
        <slot v-else name="suffix" />
      </span>
      <Icon
        class="yiz-select-arrow"
        :class="{
          'yiz-select-arrow-up': open,
          'yiz-select-arrow--hidden': clearable && hasClearValue && !disabled && !readonly && (isHovering || open),
        }"
        size="16"
        :icon="ChevronDown16Regular"
      />
    </span>
    <Transition name="yiz-select-clear-zoom">
      <span
        v-if="clearable && hasClearValue && !disabled && !readonly && (isHovering || open)"
        class="yiz-select-clear"
        @click.stop="onClear"
      >
        <Icon size="16" :icon="DismissCircle16Filled" />
      </span>
    </Transition>
  </div>
  <Teleport to="body">
    <Transition name="yiz-select-dropdown-fade">
      <div
        v-if="open"
        :id="listboxId"
        ref="dropdownRef"
        class="yiz-select-dropdown"
        role="listbox"
        :aria-multiselectable="multiple || undefined"
        :style="dropdownStyle"
      >
        <div v-if="search" class="yiz-select-search-wrap" @click.stop>
          <Input
            ref="searchInputRef"
            v-model:value="searchQuery"
            :placeholder="$t('select.searchPlaceholder')"
            @keydown.stop="onKeydown"
          />
        </div>
        <ScrollBox :max-height="scrollBoxMaxHeight">
          <div
            v-for="(opt, idx) in filteredOptions"
            :key="idx"
            :id="getOptionId(idx)"
            class="yiz-select-option"
            role="option"
            :class="{
              'yiz-select-option-selected': isSelected(opt),
              'yiz-select-option-hover': hoverIndex === idx && !isOptionDisabled(opt),
              'yiz-select-option-disabled': isOptionDisabled(opt),
            }"
            :aria-selected="isSelected(opt)"
            :aria-disabled="isOptionDisabled(opt) || undefined"
            @click.stop="onSelect(opt)"
            @mouseenter="onOptionMouseenter(opt, idx)"
          >
            <span class="yiz-select-option-content">
              <slot name="option" :option="opt" :index="idx" :selected="isSelected(opt)">
                <SelectContentRenderer :content="opt.label" />
              </slot>
            </span>
            <Icon
              v-if="multiple && isSelected(opt)"
              class="yiz-select-option-check"
              size="16"
              :icon="Checkmark16Regular"
              aria-hidden="true"
            />
          </div>
          <div v-if="filteredOptions.length === 0" class="yiz-select-empty">{{ $t('common.noData') }}</div>
        </ScrollBox>
      </div>
    </Transition>
  </Teleport>
  <div style="display: none"><slot /></div>
</template>

<script lang="ts" setup>
import {
  computed,
  defineComponent,
  Fragment,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  useSlots,
  watch,
  type PropType,
  type VNodeChild,
} from 'vue'
import { Checkmark16Regular, ChevronDown16Regular, DismissCircle16Filled } from '@vicons/fluent'
import { Icon } from '../icon'
import { Input } from '../input'
import { useInputStyleMode } from '../input-style'
import { $t } from '../locale'
import { useOverlayElement } from '../overlay/overlayScope'
import { ScrollBox } from '../scroll-box'
import SelectOptionComp from '../select-option/SelectOption.vue'
import { Tag } from '../tag'
import { nextZIndex } from '../zIndex'

export type SelectOptionContent = VNodeChild | (() => VNodeChild)

export interface SelectOption {
  label: SelectOptionContent
  value: any
  disabled?: boolean
}

const SelectContentRenderer = defineComponent({
  props: {
    content: { type: null as unknown as PropType<SelectOptionContent>, default: undefined },
  },
  setup(props) {
    return () => (typeof props.content === 'function' ? props.content() : props.content)
  },
})

const props = withDefaults(
  defineProps<{
    /**
     * 选项数据。
     * @en Options displayed in the dropdown.
     */
    options?: SelectOption[]
    /**
     * 未选择时的占位文本。
     * @en Placeholder shown when no option is selected.
     */
    placeholder?: string
    /**
     * 是否禁用选择器。
     * @en Whether the select is disabled.
     */
    disabled?: boolean
    /**
     * 是否为只读状态。
     * @en Whether the select is read-only.
     */
    readonly?: boolean
    /**
     * 是否允许清空当前值。
     * @en Whether the current value can be cleared.
     */
    clearable?: boolean
    /**
     * 是否允许选择多个选项。多选时 v-model:value 应为数组。
     * @en Whether multiple options can be selected. v-model:value should be an array in multiple mode.
     */
    multiple?: boolean
    /**
     * 多选时最多可选择的数量，为空时不限制。
     * @en Maximum number of selections in multiple mode. No limit when omitted.
     */
    max?: number
    /**
     * 选择器尺寸。
     * @en Size of the select.
     */
    size?: 'small' | 'default' | 'large'
    /**
     * 输入框显示风格。
     * @en Visual style of the input control.
     */
    styleMode?: 'outlined' | 'filled'
    /**
     * 前缀文本。
     * @en Prefix text.
     */
    prefix?: string
    /**
     * 后缀文本。
     * @en Suffix text.
     */
    suffix?: string
    /**
     * 搜索处理函数，可同步或异步返回匹配选项。
     * @en Search handler that synchronously or asynchronously returns matching options.
     */
    search?: (query: string) => SelectOption[] | Promise<SelectOption[]>
  }>(),
  {
    options: () => [],
    disabled: false,
    readonly: false,
    clearable: false,
    multiple: false,
    size: 'default',
    styleMode: 'outlined',
  },
)

defineSlots<{
  /**
   * 通过 SelectOption 声明选项。
   * @en Declares options with SelectOption components.
   */
  default?: () => any
  /**
   * 自定义前缀内容。
   * @en Custom prefix content.
   */
  prefix?: any
  /**
   * 自定义后缀内容。
   * @en Custom suffix content.
   */
  suffix?: any
  /**
   * 自定义选项渲染内容。
   * @en Custom option rendering content.
   */
  option?: (props: { option: SelectOption; index: number; selected: boolean }) => any
}>()

const emit = defineEmits<{
  /**
   * 选择项变化时触发，多选模式返回选项数组。
   * @en Emitted when the selection changes. Returns an option array in multiple mode.
   */
  change: [option: SelectOption | SelectOption[] | null]
}>()

/**
 * 当前选中值。
 * @en Currently selected value.
 */
const modelValue = defineModel<any>('value')

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
      const vnodeSlots = vnode.children
      const defaultSlot =
        vnodeSlots && typeof vnodeSlots === 'object' && typeof vnodeSlots.default === 'function'
          ? vnodeSlots.default
          : undefined
      if (p.item) {
        opts.push(defaultSlot ? { ...p.item, label: defaultSlot } : p.item)
      } else {
        opts.push({
          label: defaultSlot ?? p.label,
          value: p.value,
          disabled: p.disabled === '' || p.disabled === true,
        })
      }
    }
  }
  return opts
})

const allOptions = computed(() => {
  return slotOptions.value.length > 0 ? slotOptions.value : props.options
})

const open = ref(false)
const isHovering = ref(false)
const currentZIndex = ref(0)
const triggerRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()
const hoverIndex = ref(-1)
const searchQuery = ref('')
const searchInputRef = ref<InstanceType<typeof Input>>()
const scrollBoxMaxHeight = ref(240)
const dropdownPos = ref<{ top?: string; bottom?: string; left?: string }>({})
const listboxId = `yiz-select-listbox-${getCurrentInstance()?.uid}`
useOverlayElement(dropdownRef, open)

const filteredOptions = shallowRef<SelectOption[]>([...allOptions.value])

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

const mergedStyleMode = useInputStyleMode(() => props.styleMode)

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  c[`yiz-select-${mergedStyleMode.value}`] = true
  if (open.value) c['yiz-select-open'] = true
  if (props.disabled) c['yiz-select-disabled'] = true
  if (props.readonly) c['yiz-select-readonly'] = true
  if (props.size === 'small') c['yiz-select-small'] = true
  if (props.size === 'large') c['yiz-select-large'] = true
  return c
})

const multipleValues = computed<any[]>(() =>
  props.multiple && Array.isArray(modelValue.value) ? modelValue.value : [],
)
const selectedOptions = computed<SelectOption[]>(() => {
  return multipleValues.value
    .map((value) => allOptions.value.find((option) => option.value === value))
    .filter((option): option is SelectOption => option !== undefined)
})
const selectedOption = computed(() => {
  if (props.multiple) return undefined
  return allOptions.value.find((option) => option.value === modelValue.value)
})
const hasSelection = computed(() =>
  props.multiple ? selectedOptions.value.length > 0 : selectedOption.value !== undefined,
)
const hasClearValue = computed(() =>
  props.multiple ? Array.isArray(modelValue.value) && modelValue.value.length > 0 : modelValue.value != null,
)
const selectionLimit = computed(() => {
  if (props.max == null || !Number.isFinite(props.max)) return undefined
  return Math.max(0, Math.floor(props.max))
})
const selectionLimitReached = computed(() => {
  return props.multiple && selectionLimit.value !== undefined && multipleValues.value.length >= selectionLimit.value
})
const placeholderText = computed(() => props.placeholder ?? $t('select.placeholder'))
const activeOptionId = computed(() => {
  const option = filteredOptions.value[hoverIndex.value]
  return open.value && option && !isOptionDisabled(option) ? getOptionId(hoverIndex.value) : undefined
})

const dropdownStyle = computed(() => {
  const s: Record<string, string | number> = {
    zIndex: currentZIndex.value + 1,
  }
  if (triggerRef.value) {
    s.minWidth = `${triggerRef.value.getBoundingClientRect().width}px`
  }
  return { ...s, ...dropdownPos.value }
})

function isSelected(opt: SelectOption) {
  if (props.multiple) return multipleValues.value.some((value) => value === opt.value)
  return opt.value === modelValue.value
}

function isOptionDisabled(opt: SelectOption) {
  return Boolean(opt.disabled || (selectionLimitReached.value && !isSelected(opt)))
}

function getOptionId(index: number) {
  return `${listboxId}-option-${index}`
}

function openDropdown() {
  if (props.disabled || props.readonly || open.value) return
  open.value = true
  currentZIndex.value = nextZIndex()
  hoverIndex.value = -1
  searchQuery.value = ''
  filteredOptions.value = [...allOptions.value]
  if (props.search) {
    setTimeout(() => searchInputRef.value?.focus(), 50)
  }
}

function onTriggerClick() {
  if (props.disabled || props.readonly) return
  if (open.value) {
    open.value = false
    return
  }
  openDropdown()
}

watch(allOptions, () => {
  filteredOptions.value = [...allOptions.value]
})

watch(
  () => [props.disabled, props.readonly],
  ([disabled, readonly]) => {
    if (disabled || readonly) open.value = false
  },
)

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
  if (props.disabled || props.readonly || isOptionDisabled(opt)) return
  if (props.multiple) {
    const values = [...multipleValues.value]
    const selectedIndex = values.findIndex((value) => value === opt.value)
    if (selectedIndex >= 0) {
      values.splice(selectedIndex, 1)
    } else {
      values.push(opt.value)
    }
    modelValue.value = values
    emit(
      'change',
      values
        .map((value) => allOptions.value.find((option) => option.value === value))
        .filter((option): option is SelectOption => option !== undefined),
    )
    return
  }
  modelValue.value = opt.value
  open.value = false
  emit('change', opt)
}

function onOptionMouseenter(opt: SelectOption, index: number) {
  if (!isOptionDisabled(opt)) hoverIndex.value = index
}

function onRemoveSelected(opt: SelectOption) {
  if (!props.multiple || !isSelected(opt)) return
  onSelect(opt)
}

function onClear() {
  if (props.disabled || props.readonly) return
  if (props.multiple) {
    modelValue.value = []
    emit('change', [])
  } else {
    modelValue.value = undefined
    emit('change', null)
  }
}

function onClickOutside(e: MouseEvent) {
  if (!open.value) return
  const target = e.target as HTMLElement
  if (triggerRef.value?.contains(target)) return
  if (dropdownRef.value?.contains(target)) return
  open.value = false
}

// keyboard
function findEnabledOptionIndex(startIndex: number, direction: 1 | -1): number {
  for (let index = startIndex; index >= 0 && index < filteredOptions.value.length; index += direction) {
    const option = filteredOptions.value[index]
    if (option && !isOptionDisabled(option)) return index
  }
  return -1
}

function onTriggerKeydown(e: KeyboardEvent) {
  if (props.disabled || props.readonly) return
  if (open.value) {
    onKeydown(e)
    return
  }
  if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return

  e.preventDefault()
  openDropdown()

  const selectedIndex = filteredOptions.value.findIndex((option) => isSelected(option) && !isOptionDisabled(option))
  if (selectedIndex >= 0) {
    hoverIndex.value = selectedIndex
  } else if (e.key === 'ArrowUp') {
    hoverIndex.value = findEnabledOptionIndex(filteredOptions.value.length - 1, -1)
  } else {
    hoverIndex.value = findEnabledOptionIndex(0, 1)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (!open.value) return
  if (e.key === 'Escape') {
    e.preventDefault()
    open.value = false
    nextTick(() => triggerRef.value?.focus())
    return
  }
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    const nextIndex = findEnabledOptionIndex(hoverIndex.value + 1, 1)
    if (nextIndex >= 0) hoverIndex.value = nextIndex
    return
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    const startIndex = hoverIndex.value < 0 ? filteredOptions.value.length - 1 : hoverIndex.value - 1
    const nextIndex = findEnabledOptionIndex(startIndex, -1)
    if (nextIndex >= 0) hoverIndex.value = nextIndex
    return
  }
  if (e.key === 'Enter' && hoverIndex.value >= 0) {
    e.preventDefault()
    const opt = filteredOptions.value[hoverIndex.value]
    if (opt) {
      onSelect(opt)
      if (!props.multiple) nextTick(() => triggerRef.value?.focus())
    }
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

defineExpose({
  /**
   * 聚焦选择器。
   * @en Focuses the select.
   */
  focus: () => {
    if (!props.disabled) triggerRef.value?.focus()
  },
  /**
   * 移除选择器焦点。
   * @en Removes focus from the select.
   */
  blur: () => triggerRef.value?.blur(),
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
  border-radius: var(--yiz-base-border-radius-default);
  background: #fff;
  cursor: pointer;
  user-select: none;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  font-size: var(--yiz-font-size-default);
  color: #333;
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

  &.yiz-select-readonly {
    cursor: default;
  }

  &.yiz-select-small {
    height: 24px;
    border-radius: var(--yiz-base-border-radius-small);
    font-size: var(--yiz-font-size-small);
  }

  &.yiz-select-large {
    height: 40px;
    border-radius: var(--yiz-base-border-radius-large);
    font-size: var(--yiz-font-size-large);
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

.yiz-select-label-multiple {
  display: flex;
  align-items: center;
  gap: 4px;
}

.yiz-select-selection-tag {
  flex-shrink: 0;
  max-width: 100%;
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
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s;

  &.yiz-select-arrow-up {
    transform: rotate(180deg);
  }

  &.yiz-select-arrow--hidden {
    opacity: 0;
  }
}

.yiz-select-clear {
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

// ==================== clear 缩放过渡 ====================

.yiz-select-clear-zoom-enter-active,
.yiz-select-clear-zoom-leave-active {
  transition:
    transform 0.2s,
    opacity 0.2s;
}

.yiz-select-clear-zoom-enter-from,
.yiz-select-clear-zoom-leave-to {
  transform: translateY(-50%) scale(0);
  opacity: 0;
}

// dropdown
.yiz-select-dropdown {
  position: fixed;
  background: #fff;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: var(--yiz-pane-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.yiz-select-search-wrap {
  padding: 6px 8px;
  border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
}

.yiz-select-option {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px;
  padding: 6px 8px;
  border-radius: var(--yiz-pane-item-border-radius);
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

  &.yiz-select-option-disabled {
    color: #c0c4cc;
    cursor: not-allowed;
    background: transparent;
  }
}

.yiz-select-option-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.yiz-select-option-check {
  flex-shrink: 0;
  color: var(--yiz-color-primary);
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
