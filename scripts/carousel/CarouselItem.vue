<template>
  <div
    ref="itemRef"
    class="yiz-carousel-item"
    :class="{ 'yiz-carousel-item-active': active }"
    role="group"
    :aria-hidden="!active"
    :aria-label="name || t('carousel.item', { index: index + 1, total: total })"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLocale } from '../locale'
import { carouselContextKey } from './types'

const t = useLocale()

defineProps<{
  /**
   * 轮播项的可访问名称。
   * @en Accessible name of the carousel item.
   */
  name?: string
}>()

defineSlots<{
  /**
   * 轮播项内容。
   * @en Carousel item content.
   */
  default?: any
}>()

const carousel = inject(carouselContextKey, null)
const itemRef = ref<HTMLElement>()
const id = Symbol('carouselItem')
const index = computed(() => carousel?.getItemIndex(id) ?? -1)
const total = computed(() => itemRef.value?.parentElement?.children.length ?? 0)
const active = computed(() => index.value === carousel?.activeIndex.value)

onMounted(() => {
  if (carousel && itemRef.value) carousel.registerItem(id, itemRef.value)
})

onBeforeUnmount(() => {
  carousel?.unregisterItem(id)
})
</script>

<style lang="less">
.yiz-carousel-item {
  width: 100%;
  height: 100%;
  min-width: 100%;
  flex: 0 0 100%;
  overflow: hidden;
}

.yiz-carousel-vertical .yiz-carousel-item {
  min-width: 0;
  min-height: 100%;
}
</style>
