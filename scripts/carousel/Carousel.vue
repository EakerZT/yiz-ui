<template>
  <div
    class="yiz-carousel"
    :class="[`yiz-carousel-${direction}`, `yiz-carousel-arrow-${arrow}`, `yiz-carousel-indicator-${indicatorPosition}`]"
    role="region"
    aria-roledescription="carousel"
    :aria-label="ariaLabel || $t('carousel.ariaLabel')"
    tabindex="0"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @keydown="onKeydown"
  >
    <div class="yiz-carousel-viewport" :style="viewportStyle">
      <div class="yiz-carousel-track" :style="trackStyle">
        <slot />
      </div>

      <template v-if="arrow !== 'never' && itemCount > 1">
        <button
          class="yiz-carousel-arrow yiz-carousel-arrow-prev"
          type="button"
          :disabled="!loop && activeIndex === 0"
          :aria-label="$t('carousel.previous')"
          @click="prev"
        >
          <Icon size="20" :icon="direction === 'vertical' ? ChevronUp20Regular : ChevronLeft20Regular" />
        </button>
        <button
          class="yiz-carousel-arrow yiz-carousel-arrow-next"
          type="button"
          :disabled="!loop && activeIndex === itemCount - 1"
          :aria-label="$t('carousel.next')"
          @click="next"
        >
          <Icon size="20" :icon="direction === 'vertical' ? ChevronDown20Regular : ChevronRight20Regular" />
        </button>
      </template>
    </div>

    <div v-if="indicatorPosition !== 'none' && itemCount > 1" class="yiz-carousel-indicators">
      <button
        v-for="index in itemCount"
        :key="index"
        class="yiz-carousel-indicator"
        :class="{ 'yiz-carousel-indicator-active': index - 1 === activeIndex }"
        type="button"
        :aria-label="$t('carousel.goTo', { index })"
        :aria-current="index - 1 === activeIndex ? 'true' : undefined"
        @click="onIndicatorClick(index - 1)"
        @mouseenter="onIndicatorMouseenter(index - 1)"
      >
        <span />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  readonly,
  ref,
  toRef,
  watch,
  type CSSProperties,
} from 'vue'
import { ChevronDown20Regular, ChevronLeft20Regular, ChevronRight20Regular, ChevronUp20Regular } from '@vicons/fluent'
import { Icon } from '../icon'
import { $t } from '../locale'
import {
  carouselContextKey,
  type CarouselArrow,
  type CarouselDirection,
  type CarouselIndicatorPosition,
  type CarouselTrigger,
} from './types'

const props = withDefaults(
  defineProps<{
    /**
     * 初始激活项索引。
     * @en Initially active item index.
     */
    initialIndex?: number
    /**
     * 轮播区域高度。数字按像素处理。
     * @en Carousel viewport height; numbers are treated as pixels.
     */
    height?: string | number
    /**
     * 是否自动播放。
     * @en Whether to autoplay.
     */
    autoplay?: boolean
    /**
     * 自动播放间隔，单位毫秒。
     * @en Autoplay interval in milliseconds.
     */
    interval?: number
    /**
     * 是否循环播放。
     * @en Whether navigation wraps around.
     */
    loop?: boolean
    /**
     * 鼠标悬停时是否暂停自动播放。
     * @en Whether autoplay pauses on hover.
     */
    pauseOnHover?: boolean
    /**
     * 箭头显示方式。
     * @en Arrow visibility mode.
     */
    arrow?: CarouselArrow
    /**
     * 指示器位置。
     * @en Indicator position.
     */
    indicatorPosition?: CarouselIndicatorPosition
    /**
     * 指示器触发方式。
     * @en Indicator trigger mode.
     */
    trigger?: CarouselTrigger
    /**
     * 轮播方向。
     * @en Carousel direction.
     */
    direction?: CarouselDirection
    /**
     * 轮播区域的可访问名称。
     * @en Accessible label of the carousel region.
     */
    ariaLabel?: string
  }>(),
  {
    initialIndex: 0,
    height: 300,
    autoplay: true,
    interval: 3000,
    loop: true,
    pauseOnHover: true,
    arrow: 'hover',
    indicatorPosition: 'inside',
    trigger: 'click',
    direction: 'horizontal',
    ariaLabel: '',
  },
)

defineSlots<{
  /**
   * CarouselItem 列表。
   * @en CarouselItem list.
   */
  default?: any
}>()

const emit = defineEmits<{
  /**
   * 激活项变化时触发。
   * @en Emitted when the active item changes.
   */
  change: [current: number, previous: number]
}>()

/**
 * 当前激活项索引。
 * @en Currently active item index.
 */
const currentIndex = defineModel<number | undefined>('currentIndex')

interface RegisteredItem {
  id: symbol
  element: HTMLElement
}

const items = ref<RegisteredItem[]>([])
const activeIndex = ref(0)
const hovered = ref(false)
const pageVisible = ref(true)
const itemCount = computed(() => items.value.length)
let timer: ReturnType<typeof setInterval> | undefined

const viewportStyle = computed<CSSProperties>(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
}))

const trackStyle = computed<CSSProperties>(() => {
  const offset = `${-activeIndex.value * 100}%`
  return {
    transform: props.direction === 'vertical' ? `translate3d(0, ${offset}, 0)` : `translate3d(${offset}, 0, 0)`,
  }
})

function normalizeIndex(index: number) {
  const count = itemCount.value
  if (!count) return 0
  const integer = Math.trunc(index)
  if (props.loop) return ((integer % count) + count) % count
  return Math.min(Math.max(integer, 0), count - 1)
}

function setActiveItem(index: number) {
  if (!itemCount.value || !Number.isFinite(index)) return
  const nextIndex = normalizeIndex(index)
  const previous = activeIndex.value
  if (nextIndex === previous) return
  activeIndex.value = nextIndex
  currentIndex.value = nextIndex
  emit('change', nextIndex, previous)
}

function prev() {
  setActiveItem(activeIndex.value - 1)
}

function next() {
  setActiveItem(activeIndex.value + 1)
}

function stopTimer() {
  if (timer !== undefined) clearInterval(timer)
  timer = undefined
}

function startTimer() {
  stopTimer()
  if (!props.autoplay || itemCount.value < 2 || !pageVisible.value || (props.pauseOnHover && hovered.value)) return
  timer = setInterval(next, Math.max(props.interval, 100))
}

function registerItem(id: symbol, element: HTMLElement) {
  items.value.push({ id, element })
  void nextTick(() => {
    items.value.sort((left, right) => {
      const position = left.element.compareDocumentPosition(right.element)
      return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    })
  })
}

function unregisterItem(id: symbol) {
  const index = items.value.findIndex((item) => item.id === id)
  if (index >= 0) items.value.splice(index, 1)
}

function getItemIndex(id: symbol) {
  return items.value.findIndex((item) => item.id === id)
}

function onMouseEnter() {
  hovered.value = true
}

function onMouseLeave() {
  hovered.value = false
}

function onIndicatorClick(index: number) {
  if (props.trigger === 'click') setActiveItem(index)
}

function onIndicatorMouseenter(index: number) {
  if (props.trigger === 'hover') setActiveItem(index)
}

function onKeydown(event: KeyboardEvent) {
  const previousKey = props.direction === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  const nextKey = props.direction === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  if (event.key === previousKey) {
    event.preventDefault()
    prev()
  } else if (event.key === nextKey) {
    event.preventDefault()
    next()
  }
}

function onVisibilityChange() {
  pageVisible.value = !document.hidden
}

provide(carouselContextKey, {
  activeIndex: readonly(activeIndex),
  direction: toRef(props, 'direction'),
  registerItem,
  unregisterItem,
  getItemIndex,
})

watch(
  () => currentIndex.value,
  (value) => {
    if (value !== undefined && Number.isFinite(value) && itemCount.value) activeIndex.value = normalizeIndex(value)
  },
)

watch(itemCount, (count, previousCount) => {
  if (count && !previousCount) activeIndex.value = normalizeIndex(currentIndex.value ?? props.initialIndex)
  else if (activeIndex.value >= count) activeIndex.value = Math.max(count - 1, 0)
})

watch([() => props.autoplay, () => props.interval, itemCount, hovered, pageVisible, activeIndex], startTimer)

onMounted(() => {
  pageVisible.value = !document.hidden
  document.addEventListener('visibilitychange', onVisibilityChange)
  startTimer()
})

onBeforeUnmount(() => {
  stopTimer()
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

defineExpose({
  /**
   * 切换到上一项。
   * @en Switch to the previous item.
   */
  prev,
  /**
   * 切换到下一项。
   * @en Switch to the next item.
   */
  next,
  /**
   * 切换到指定索引。
   * @en Switch to a specified index.
   */
  setActiveItem,
})
</script>

<style lang="less">
.yiz-carousel {
  position: relative;
  width: 100%;
  outline: none;
  --yiz-carousel-arrow-size: 36px;
  --yiz-carousel-indicator-color: rgba(255, 255, 255, 0.55);
  --yiz-carousel-indicator-active-color: #fff;
}

.yiz-carousel:focus-visible {
  border-radius: var(--yiz-base-border-radius-default);
  box-shadow: 0 0 0 2px var(--yiz-color-primary-light8);
}

.yiz-carousel-viewport {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.yiz-carousel-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.4s ease;
  will-change: transform;
}

.yiz-carousel-vertical .yiz-carousel-track {
  flex-direction: column;
}

.yiz-carousel-arrow {
  position: absolute;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--yiz-carousel-arrow-size);
  height: var(--yiz-carousel-arrow-size);
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(31, 45, 61, 0.45);
  color: #fff;
  cursor: pointer;
  opacity: 0;
  transition:
    opacity 0.2s,
    background-color 0.2s;
}

.yiz-carousel-arrow:hover {
  background: rgba(31, 45, 61, 0.7);
}

.yiz-carousel-arrow:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 1px;
}

.yiz-carousel-arrow:disabled {
  cursor: not-allowed;
  opacity: 0.35 !important;
}

.yiz-carousel-arrow-always .yiz-carousel-arrow,
.yiz-carousel:hover .yiz-carousel-arrow,
.yiz-carousel:focus-within .yiz-carousel-arrow {
  opacity: 1;
}

.yiz-carousel-horizontal .yiz-carousel-arrow {
  top: 50%;
  transform: translateY(-50%);
}

.yiz-carousel-horizontal .yiz-carousel-arrow-prev {
  left: 16px;
}

.yiz-carousel-horizontal .yiz-carousel-arrow-next {
  right: 16px;
}

.yiz-carousel-vertical .yiz-carousel-arrow {
  left: 50%;
  transform: translateX(-50%);
}

.yiz-carousel-vertical .yiz-carousel-arrow-prev {
  top: 16px;
}

.yiz-carousel-vertical .yiz-carousel-arrow-next {
  bottom: 16px;
}

.yiz-carousel-indicators {
  position: absolute;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.yiz-carousel-horizontal .yiz-carousel-indicators {
  right: 0;
  bottom: 10px;
  left: 0;
}

.yiz-carousel-vertical .yiz-carousel-indicators {
  top: 0;
  right: 10px;
  bottom: 0;
  flex-direction: column;
}

.yiz-carousel-indicator-outside {
  padding-bottom: 26px;
}

.yiz-carousel-indicator-outside .yiz-carousel-indicators {
  bottom: 0;
}

.yiz-carousel-indicator-outside.yiz-carousel-vertical {
  padding-right: 26px;
  padding-bottom: 0;
}

.yiz-carousel-indicator-outside.yiz-carousel-vertical .yiz-carousel-indicators {
  right: 0;
}

.yiz-carousel-indicator {
  box-sizing: content-box;
  width: 28px;
  height: 3px;
  padding: 5px 4px;
  border: 0;
  background: transparent;
  cursor: pointer;
}

.yiz-carousel-vertical .yiz-carousel-indicator {
  width: 3px;
  height: 28px;
}

.yiz-carousel-indicator span {
  display: block;
  width: 100%;
  height: 100%;
  background: var(--yiz-carousel-indicator-color);
  transition: background-color 0.2s;
}

.yiz-carousel-indicator-active span {
  background: var(--yiz-carousel-indicator-active-color);
}

.yiz-carousel-indicator-outside {
  --yiz-carousel-indicator-color: var(--yiz-color-border);
  --yiz-carousel-indicator-active-color: var(--yiz-color-primary);
}
</style>
