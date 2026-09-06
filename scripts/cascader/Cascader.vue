<script lang="ts" setup>
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ChevronDown16Regular, ChevronRight16Regular, DismissCircle16Filled } from '@vicons/fluent'
import AppTeleport from '../app/AppTeleport.vue'
import { Icon } from '../icon'
import { InputCustom } from '../input-custom'
import { useLocale } from '../locale'
import { useOverlayElement } from '../overlay/overlayScope'
import { ScrollBox } from '../scroll-box'
import { useZIndexManager } from '../zIndex'
import type { CascaderOption, CascaderValue } from './types'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    /** 级联选项，同级 value 必须唯一。
     * @en Hierarchical options with unique values among siblings.
     */
    options?: CascaderOption[]
    /** 占位文本。
     * @en Placeholder text.
     */
    placeholder?: string
    /** 禁用选择器。
     * @en Disables the cascader.
     */
    disabled?: boolean
    /** 只读，允许聚焦。
     * @en Read-only while remaining focusable.
     */
    readonly?: boolean
    /** 允许清空为 undefined。
     * @en Allows clearing the value to undefined.
     */
    clearable?: boolean
    /** 允许选择任意层级，选择父节点后继续展开。
     * @en Allows selecting any level while expanding parent nodes.
     */
    changeOnSelect?: boolean
    /** 展开子级的方式。
     * @en How child columns are expanded.
     */
    expandTrigger?: 'click' | 'hover'
    /** 是否显示完整路径。
     * @en Whether to display the full selected path.
     */
    showAllLevels?: boolean
    /** 路径显示分隔符。
     * @en Separator between path labels.
     */
    separator?: string
    /** 控件尺寸，继承 InputGroup 或 App。
     * @en Control size, inherited from InputGroup or App.
     */
    size?: 'small' | 'default' | 'large'
    /** 输入框显示风格。
     * @en Input appearance.
     */
    styleMode?: 'outlined' | 'filled'
  }>(),
  {
    options: () => [],
    disabled: false,
    readonly: false,
    clearable: false,
    changeOnSelect: false,
    expandTrigger: 'click',
    showAllLevels: true,
    separator: ' / '
  }
)

/** 从根节点到选中节点的 value 数组。
 * @en Values from the root to the selected node.
 */
const value = defineModel<CascaderValue[]>('value')
const emit = defineEmits<{
  /** 用户选择或清空时触发，清空返回空路径。
   * @en Emitted on user selection or clear, with an empty path on clear.
   */
  change: [path: CascaderOption[]]
}>()
defineSlots<{
  /** 自定义选项内容。
   * @en Custom option content.
   */
  option?: (props: { option: CascaderOption; level: number; selected: boolean }) => unknown
}>()

const t = useLocale()
const trigger = ref<InstanceType<typeof InputCustom>>()
const panel = ref<HTMLElement>()
const open = ref(false)
const expanded = ref<CascaderValue[]>([])
const position = ref<Record<string, string | number>>({})
const columnHeight = ref(240)
const zIndex = ref(0)
const zIndexManager = useZIndexManager()
const id = `yiz-cascader-${getCurrentInstance()?.uid}`
useOverlayElement(panel, open)

function resolvePath(values: CascaderValue[], enabledOnly = false) {
  const path: CascaderOption[] = []
  let options = props.options
  for (const current of values) {
    const option = options.find((item) => item.value === current)
    if (!option || (enabledOnly && option.disabled)) break
    path.push(option)
    options = option.children ?? []
  }
  return path
}

const selectedPath = computed(() => resolvePath(value.value ?? []))
const label = computed(() => {
  if (!value.value?.length || selectedPath.value.length !== value.value.length) return ''
  const labels = selectedPath.value.map((item) => item.label)
  return (props.showAllLevels ? labels : labels.slice(-1)).join(props.separator)
})
const columns = computed(() => {
  const result = [props.options]
  for (const option of resolvePath(expanded.value, true)) {
    if (option.children?.length) result.push(option.children)
    else break
  }
  return result
})

function columnKey(level: number) {
  return JSON.stringify(expanded.value.slice(0, level))
}

function onColumnLeave(element: Element) {
  const column = element as HTMLElement
  // 退出列脱离布局，避免切换分支时新旧列同时占位；退出期间不可交互。
  column.style.left = `${column.offsetLeft}px`
  column.style.top = `${column.offsetTop}px`
  column.style.position = 'absolute'
  column.inert = true
}

function onColumnLeaveCancelled(element: Element) {
  const column = element as HTMLElement
  column.style.removeProperty('left')
  column.style.removeProperty('top')
  column.style.removeProperty('position')
  column.inert = false
}

function triggerElement(): HTMLElement | undefined {
  return trigger.value?.$el
}
function focus() {
  if (!props.disabled) triggerElement()?.focus()
}
function close(restoreFocus = false) {
  open.value = false
  if (restoreFocus) focus()
}
function show() {
  if (props.disabled || props.readonly || open.value) return
  expanded.value = resolvePath(value.value ?? [], true).map((item) => item.value)
  zIndex.value = zIndexManager.next()
  open.value = true
}
function toggle() {
  if (open.value) close()
  else show()
}
function expand(option: CascaderOption, level: number) {
  if (option.disabled || props.disabled || props.readonly) return
  expanded.value = [...expanded.value.slice(0, level), option.value]
}
function select(option: CascaderOption, level: number) {
  if (option.disabled || props.disabled || props.readonly) return
  expand(option, level)
  if (!option.children?.length || props.changeOnSelect) {
    const path = resolvePath(expanded.value, true)
    const next = path.map((item) => item.value)
    if (next.length !== value.value?.length || next.some((item, i) => item !== value.value?.[i])) {
      value.value = next
      emit('change', path)
    }
  }
  if (!option.children?.length) close(true)
}
function clear() {
  if (props.disabled || props.readonly) return
  value.value = undefined
  expanded.value = []
  emit('change', [])
  close(true)
}
function isSelected(option: CascaderOption, level: number) {
  return (
    selectedPath.value[level]?.value === option.value &&
    selectedPath.value.slice(0, level).every((item, i) => item.value === expanded.value[i])
  )
}
async function focusOption(level: number, index?: number) {
  await nextTick()
  if (!open.value) return
  const options = columns.value[level] ?? []
  const target = index ?? options.findIndex((item) => !item.disabled)
  const element = panel.value?.querySelector<HTMLElement>(
    `.yiz-cascader-column:not([inert]) [data-level="${level}"][data-index="${target}"]`
  )
  element?.focus({ preventScroll: true })
  element?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}
function onKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) return
  if (event.key === 'Tab') {
    if (panel.value?.contains(event.target as Node)) focus()
    close()
    return
  }
  if (event.key === 'Escape' && open.value) {
    event.preventDefault()
    event.stopPropagation()
    close(true)
    return
  }
  if (!open.value) {
    if (['Enter', ' ', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      event.preventDefault()
      show()
      void focusOption(0)
    }
    return
  }
  const target = event.target as HTMLElement
  const level = Number(target.dataset.level ?? 0)
  const index = Number(target.dataset.index ?? -1)
  const options = columns.value[level] ?? []
  const option = options[index]
  if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault()
    const direction = event.key === 'ArrowUp' || event.key === 'End' ? -1 : 1
    let next = event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : index + direction
    if (index < 0 && direction < 0) next = options.length - 1
    for (; next >= 0 && next < options.length; next += direction) {
      if (!options[next].disabled) {
        void focusOption(level, next)
        break
      }
    }
  } else if (event.key === 'ArrowRight' && option?.children?.length) {
    event.preventDefault()
    expand(option, level)
    void focusOption(level + 1)
  } else if (event.key === 'ArrowLeft' && level > 0) {
    event.preventDefault()
    const parentIndex = columns.value[level - 1].findIndex((item) => item.value === expanded.value[level - 1])
    expanded.value = expanded.value.slice(0, level - 1)
    void focusOption(level - 1, parentIndex)
  } else if ((event.key === 'Enter' || event.key === ' ') && index < 0) {
    event.preventDefault()
    void focusOption(0)
  }
}

function reposition() {
  const anchor = triggerElement()
  if (!open.value || !anchor || !panel.value) return
  const rect = anchor.getBoundingClientRect()
  const below = window.innerHeight - rect.bottom - 12
  const above = rect.top - 12
  const down = below >= 248 || below >= above
  columnHeight.value = Math.max(0, Math.min(240, (down ? below : above) - 10))
  const width = panel.value.getBoundingClientRect().width
  position.value = {
    left: `${Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))}px`,
    ...(down ? { top: `${rect.bottom + 4}px` } : { bottom: `${window.innerHeight - rect.top + 4}px` }),
    zIndex: zIndex.value + 1
  }
}
function onOutside(event: Event) {
  const target = event.target as Node | null
  if (open.value && target && !triggerElement()?.contains(target) && !panel.value?.contains(target)) close()
}
watch([open, columns], async () => {
  await nextTick()
  reposition()
})
watch(
  () => [props.disabled, props.readonly],
  () => {
    if (props.disabled || props.readonly) close()
  }
)
watch(
  () => [value.value, props.options],
  () => {
    expanded.value = resolvePath(value.value ?? [], true).map((item) => item.value)
  },
  { deep: true }
)
onMounted(() => {
  document.addEventListener('click', onOutside, true)
  document.addEventListener('focusin', onOutside)
  window.addEventListener('scroll', reposition, true)
  window.addEventListener('resize', reposition)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onOutside, true)
  document.removeEventListener('focusin', onOutside)
  window.removeEventListener('scroll', reposition, true)
  window.removeEventListener('resize', reposition)
})
defineExpose({
  /** 聚焦控件。
   * @en Focuses the control.
   */
  focus,
  /** 关闭面板并移除焦点。
   * @en Closes the panel and removes focus.
   */
  blur: () => {
    close()
    trigger.value?.blur()
    if (panel.value?.contains(document.activeElement)) (document.activeElement as HTMLElement)?.blur()
  }
})
</script>

<template>
  <InputCustom
    ref="trigger"
    class="yiz-cascader"
    :class="{ 'yiz-cascader-readonly': readonly }"
    :disabled="disabled"
    :size="size"
    :style-mode="styleMode"
    :active="open"
    role="combobox"
    aria-haspopup="dialog"
    :aria-expanded="open"
    :aria-controls="open ? id : undefined"
    :aria-readonly="readonly || undefined"
    :aria-label="placeholder ?? t('cascader.placeholder')"
    v-bind="$attrs"
    @click="toggle"
    @keydown="onKeydown"
  >
    <span class="yiz-cascader-label" :class="{ 'yiz-cascader-placeholder': !label }" :title="label">
      {{ label || placeholder || t('cascader.placeholder') }}
    </span>
    <template #suffix>
      <button
        v-if="clearable && value?.length && !disabled && !readonly"
        type="button"
        class="yiz-cascader-clear"
        :aria-label="t('cascader.clear')"
        @click.stop="clear"
        @keydown.enter.stop
        @keydown.space.stop
      >
        <Icon :icon="DismissCircle16Filled" size="16" />
      </button>
      <Icon v-else :icon="ChevronDown16Regular" size="16" class="yiz-cascader-arrow" :class="{ 'is-open': open }" />
    </template>
  </InputCustom>
  <AppTeleport>
    <Transition name="yiz-cascader-fade">
      <div
        v-if="open"
        :id="id"
        ref="panel"
        class="yiz-cascader-panel"
        :style="position"
        role="dialog"
        :aria-label="placeholder ?? t('cascader.placeholder')"
        @keydown="onKeydown"
      >
        <TransitionGroup
          name="yiz-cascader-column-fade"
          @before-leave="onColumnLeave"
          @leave-cancelled="onColumnLeaveCancelled"
          @after-enter="reposition"
          @after-leave="reposition"
        >
          <ScrollBox
            v-for="(options, level) in columns"
            :key="columnKey(level)"
            class="yiz-cascader-column"
            :max-height="columnHeight"
            overflow-x="hidden"
          >
            <button
              v-for="(option, index) in options"
              :key="option.value"
              type="button"
              class="yiz-cascader-option"
              :class="{ 'is-active': expanded[level] === option.value, 'is-selected': isSelected(option, level) }"
              :disabled="option.disabled"
              :title="option.label"
              :data-level="level"
              :data-index="index"
              tabindex="-1"
              :aria-pressed="isSelected(option, level)"
              :aria-expanded="option.children?.length ? expanded[level] === option.value : undefined"
              @click="select(option, level)"
              @mouseenter="expandTrigger === 'hover' && expand(option, level)"
            >
              <span class="yiz-cascader-option-label"
                ><slot name="option" :option="option" :level="level" :selected="isSelected(option, level)">{{
                  option.label
                }}</slot></span
              >
              <Icon v-if="option.children?.length" :icon="ChevronRight16Regular" size="16" />
            </button>
            <div v-if="!options.length" class="yiz-cascader-empty">{{ t('common.noData') }}</div>
          </ScrollBox>
        </TransitionGroup>
      </div>
    </Transition>
  </AppTeleport>
</template>

<style lang="less">
.yiz-cascader {
  display: flex;
  cursor: pointer;
  color: var(--yiz-color-text-primary);
  &-readonly {
    cursor: default;
  }
  &-label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &-placeholder {
    color: var(--yiz-color-text-disabled);
  }
  &-arrow {
    transition: transform var(--yiz-motion-duration-default);
    &.is-open {
      transform: rotate(180deg);
    }
  }
  &-clear {
    display: inline-flex;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--yiz-color-text-tertiary);
    cursor: pointer;
    &:hover {
      color: var(--yiz-color-text-primary);
    }
  }
}
.yiz-cascader-panel {
  position: fixed;
  display: flex;
  max-width: calc(100vw - 16px);
  overflow-x: auto;
  background: var(--yiz-color-bg-elevated);
  border: 1px solid var(--yiz-color-border);
  border-radius: var(--yiz-pane-border-radius);
  box-shadow: var(--yiz-shadow-popup);
}
.yiz-cascader-column {
  width: var(--yiz-cascader-column-width, 160px);
  flex: 0 0 auto;
  box-sizing: border-box;
  & + & {
    border-left: 1px solid var(--yiz-color-border);
  }
}
.yiz-cascader-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: calc(100% - 8px);
  margin: 4px;
  padding: 6px 8px;
  border: 0;
  border-radius: var(--yiz-pane-item-border-radius);
  background: transparent;
  color: var(--yiz-color-text-primary);
  font: inherit;
  font-size: var(--yiz-font-size-default);
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  &:hover,
  &:focus-visible {
    background: var(--yiz-color-hover-bg);
  }
  &:focus-visible {
    outline: 1px solid var(--yiz-color-primary);
    outline-offset: -1px;
  }
  &.is-active,
  &.is-selected {
    color: var(--yiz-color-primary);
    background: var(--yiz-color-primary-bg-hover);
    font-weight: 500;
  }
  &:disabled {
    color: var(--yiz-color-text-disabled);
    background: transparent;
    cursor: not-allowed;
  }
  &-label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.yiz-cascader-empty {
  padding: 8px 12px;
  text-align: center;
  color: var(--yiz-color-text-disabled);
  font-size: var(--yiz-font-size-default);
}
.yiz-cascader-fade-enter-active,
.yiz-cascader-fade-leave-active {
  transition:
    opacity var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard),
    transform var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard);
}
.yiz-cascader-fade-enter-from,
.yiz-cascader-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.yiz-cascader-column-fade-enter-active,
.yiz-cascader-column-fade-leave-active {
  transition:
    opacity var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard),
    transform var(--yiz-motion-duration-default) var(--yiz-motion-easing-standard);
}
.yiz-cascader-column-fade-leave-active {
  pointer-events: none;
}
.yiz-cascader-column-fade-enter-from,
.yiz-cascader-column-fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}
</style>
