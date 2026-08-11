<template>
  <div class="carousel-position-control">
    <y-segmented v-model:value="dotPosition" :options="positionOptions" />
  </div>
  <y-carousel :dot-position="dotPosition" trigger="hover" height="240px" arrow="always">
    <y-carousel-item v-for="item in 4" :key="item">
      <div class="vertical-slide">
        <span>0{{ item }}</span>
        {{ t('demo.carousel.positionItem') }}
      </div>
    </y-carousel-item>
  </y-carousel>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale, type CarouselDotPosition } from 'yiz-ui'

const t = useLocale()

const dotPosition = ref<CarouselDotPosition>('right')
const positionOptions = computed(() => [
  { label: t('demo.carousel.positionTop'), value: 'top' },
  { label: t('demo.carousel.positionBottom'), value: 'bottom' },
  { label: t('demo.carousel.positionLeft'), value: 'left' },
  { label: t('demo.carousel.positionRight'), value: 'right' },
])
</script>

<style scoped>
.carousel-position-control {
  margin-bottom: 12px;
}
.vertical-slide {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: #263445;
  color: #fff;
  font-size: 18px;
}
.vertical-slide span {
  color: #69b1ff;
  font-size: 34px;
  font-weight: 700;
}
</style>
