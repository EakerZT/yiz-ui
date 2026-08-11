<template>
  <div
    ref="rateRef"
    class="yiz-rate"
    :class="{ 'yiz-rate-disabled': disabled, 'yiz-rate-readonly': readonly }"
    :style="rateStyle"
    role="slider"
    :tabindex="disabled ? -1 : 0"
    :aria-label="ariaLabel || t('rate.ariaLabel')"
    aria-valuemin="0"
    :aria-valuemax="normalizedCount"
    :aria-valuenow="normalizedValue"
    :aria-valuetext="t('rate.value', { value: normalizedValue, total: normalizedCount })"
    :aria-disabled="disabled || undefined"
    :aria-readonly="readonly || undefined"
    @keydown="onKeydown"
    @mouseleave="clearHover"
  >
    <div class="yiz-rate-items">
      <button
        v-for="index in normalizedCount"
        :key="index"
        class="yiz-rate-item"
        type="button"
        tabindex="-1"
        :disabled="disabled"
        :aria-hidden="true"
        @pointermove="onPointerMove($event, index)"
        @focus="clearHover"
        @click="onItemClick($event, index)"
      >
        <span class="yiz-rate-character yiz-rate-character-void">
          <slot name="character" :index="index" :active="false">
            <Icon :icon="Star24Regular" />
          </slot>
        </span>
        <span class="yiz-rate-character yiz-rate-character-fill" :style="{ width: `${getFillPercent(index)}%` }">
          <slot name="character" :index="index" :active="true">
            <Icon :icon="Star24Filled" />
          </slot>
        </span>
      </button>
    </div>
    <span v-if="displayText" class="yiz-rate-text">{{ displayText }}</span>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, type CSSProperties } from 'vue'
import { Star24Filled, Star24Regular } from '@vicons/fluent'
import { Icon } from '../icon'
import { useLocale } from '../locale'

const t = useLocale()

const props = withDefaults(
  defineProps<{
    /**
     * 评分总数。
     * @en Maximum rating value.
     */
    count?: number
    /**
     * 是否允许选择半星。
     * @en Whether half ratings are allowed.
     */
    allowHalf?: boolean
    /**
     * 再次选择相同值时是否允许清空。
     * @en Whether selecting the same value again clears the rating.
     */
    allowClear?: boolean
    /**
     * 是否禁用。
     * @en Whether the rating is disabled.
     */
    disabled?: boolean
    /**
     * 是否只读。
     * @en Whether the rating is read-only.
     */
    readonly?: boolean
    /**
     * 图标尺寸，数字按像素处理。
     * @en Icon size; numbers are treated as pixels.
     */
    size?: string | number
    /**
     * 激活颜色。
     * @en Active character color.
     */
    color?: string
    /**
     * 未激活颜色。
     * @en Inactive character color.
     */
    voidColor?: string
    /**
     * 各评分对应的提示文本。
     * @en Text labels corresponding to each rating.
     */
    texts?: string[]
    /**
     * 是否显示提示文本。
     * @en Whether to display the matching text label.
     */
    showText?: boolean
    /**
     * 是否显示当前分数。
     * @en Whether to display the current score.
     */
    showScore?: boolean
    /**
     * 分数显示模板，使用 {value} 和 {total} 占位。
     * @en Score template using {value} and {total} placeholders.
     */
    scoreTemplate?: string
    /**
     * 组件的可访问名称。
     * @en Accessible label of the component.
     */
    ariaLabel?: string
  }>(),
  {
    count: 5,
    allowHalf: false,
    allowClear: true,
    disabled: false,
    readonly: false,
    size: 24,
    texts: () => [],
    showText: false,
    showScore: false,
    scoreTemplate: '{value} / {total}',
    ariaLabel: '',
  },
)

defineSlots<{
  /**
   * 自定义评分字符。
   * @en Custom rating character.
   */
  character?: (props: { index: number; active: boolean }) => any
}>()

const emit = defineEmits<{
  /**
   * 评分值变化时触发。
   * @en Emitted when the rating changes.
   */
  change: [value: number]
}>()

/**
 * 当前评分值。
 * @en Current rating value.
 */
const modelValue = defineModel<number>('value', { default: 0 })

const rateRef = ref<HTMLElement>()
const hoverValue = ref<number | null>(null)
const normalizedCount = computed(() => {
  const count = Math.trunc(props.count)
  return Number.isFinite(count) ? Math.max(count, 1) : 5
})
const step = computed(() => (props.allowHalf ? 0.5 : 1))
const normalizedValue = computed(() => normalizeValue(modelValue.value))
const previewValue = computed(() => hoverValue.value ?? normalizedValue.value)
const rateStyle = computed<CSSProperties>(() => ({
  '--yiz-rate-size': typeof props.size === 'number' ? `${props.size}px` : props.size,
  '--yiz-rate-color': props.color,
  '--yiz-rate-void-color': props.voidColor,
}))
const displayText = computed(() => {
  const value = previewValue.value
  if (props.showScore) {
    return props.scoreTemplate.replace('{value}', String(value)).replace('{total}', String(normalizedCount.value))
  }
  if (!props.showText || value <= 0) return ''
  return props.texts[Math.min(Math.ceil(value), props.texts.length) - 1] ?? ''
})

function normalizeValue(value: number) {
  if (!Number.isFinite(value)) return 0
  const clamped = Math.min(Math.max(value, 0), normalizedCount.value)
  return Math.round(clamped / step.value) * step.value
}

function getPointerValue(event: PointerEvent | MouseEvent, index: number) {
  if (!props.allowHalf) return index
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  return index - (event.clientX - rect.left <= rect.width / 2 ? 0.5 : 0)
}

function getFillPercent(index: number) {
  return Math.min(Math.max(previewValue.value - (index - 1), 0), 1) * 100
}

function setValue(value: number) {
  if (props.disabled || props.readonly) return
  const nextValue = normalizeValue(value)
  if (nextValue === normalizedValue.value) return
  modelValue.value = nextValue
  emit('change', nextValue)
}

function onPointerMove(event: PointerEvent, index: number) {
  if (props.disabled || props.readonly) return
  hoverValue.value = getPointerValue(event, index)
}

function onItemClick(event: MouseEvent, index: number) {
  if (props.disabled || props.readonly) return
  const clickedValue = getPointerValue(event, index)
  const nextValue = props.allowClear && clickedValue === normalizedValue.value ? 0 : clickedValue
  hoverValue.value = null
  setValue(nextValue)
  rateRef.value?.focus()
}

function clearHover() {
  hoverValue.value = null
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled || props.readonly) return
  let nextValue: number
  if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') nextValue = normalizedValue.value - step.value
  else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') nextValue = normalizedValue.value + step.value
  else if (event.key === 'Home' || event.key === 'Delete' || event.key === 'Backspace') nextValue = 0
  else if (event.key === 'End') nextValue = normalizedCount.value
  else return
  event.preventDefault()
  setValue(nextValue)
}

function focus() {
  if (!props.disabled) rateRef.value?.focus()
}

function blur() {
  rateRef.value?.blur()
}

watch([normalizedCount, step], () => {
  const value = normalizedValue.value
  if (value !== modelValue.value) modelValue.value = value
})

defineExpose({ focus, blur })
</script>

<style lang="less">
.yiz-rate {
  --yiz-rate-size: 24px;
  --yiz-rate-color: var(--yiz-color-warning);
  --yiz-rate-void-color: var(--yiz-color-text-disabled);

  display: inline-flex;
  align-items: center;
  gap: 10px;
  outline: none;
  vertical-align: middle;
}

.yiz-rate-items {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.yiz-rate-item {
  position: relative;
  display: inline-flex;
  width: var(--yiz-rate-size);
  height: var(--yiz-rate-size);
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  outline: none;
  transition: transform 0.15s ease;
}

.yiz-rate-item:hover {
  transform: scale(1.12);
}

.yiz-rate-character {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  font-size: var(--yiz-rate-size);
  line-height: 1;
}

.yiz-rate-character-void {
  color: var(--yiz-rate-void-color);
}

.yiz-rate-character-fill {
  color: var(--yiz-rate-color);
  overflow: hidden;
  white-space: nowrap;
  pointer-events: none;
}

.yiz-rate:focus-visible .yiz-rate-items {
  border-radius: var(--yiz-base-border-radius-default);
  box-shadow: 0 0 0 2px var(--yiz-color-primary-bg-hover);
}

.yiz-rate-text {
  color: var(--yiz-color-text-secondary);
  font-size: var(--yiz-font-size-default);
  line-height: var(--yiz-rate-size);
  white-space: nowrap;
}

.yiz-rate-disabled,
.yiz-rate-readonly {
  .yiz-rate-item {
    cursor: default;
  }

  .yiz-rate-item:hover {
    transform: none;
  }
}

.yiz-rate-disabled {
  opacity: 0.55;
}
</style>
