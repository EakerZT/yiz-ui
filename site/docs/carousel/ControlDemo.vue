<template>
  <y-carousel
    ref="carouselRef"
    v-model:current-index="current"
    :autoplay="false"
    :loop="false"
    arrow="always"
    indicator-position="outside"
    height="200px"
  >
    <y-carousel-item v-for="item in 3" :key="item">
      <div class="control-slide">{{ $t('demo.carousel.slide', { index: item }) }}</div>
    </y-carousel-item>
  </y-carousel>
  <div class="carousel-actions">
    <y-button @click="carouselRef?.prev()">{{ $t('demo.carousel.previous') }}</y-button>
    <y-button @click="carouselRef?.next()">{{ $t('demo.carousel.next') }}</y-button>
    <span>{{ $t('demo.carousel.current', { index: current + 1 }) }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, type Carousel } from 'yiz-ui'

const current = ref(0)
const carouselRef = ref<InstanceType<typeof Carousel>>()
</script>

<style scoped>
.control-slide {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--yiz-color-primary-light9);
  color: var(--yiz-color-primary);
  font-size: 24px;
  font-weight: 600;
}
.carousel-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  color: #666;
  font-size: 13px;
}
</style>
