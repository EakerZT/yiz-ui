<template>
  <y-carousel height="260px">
    <y-carousel-item v-for="item in 4" :key="item">
      <div class="carousel-slide" :class="`carousel-slide-${item}`">
        <strong>{{ t('demo.carousel.slide', { index: item }) }}</strong>
        <span>{{ t('demo.carousel.slideDesc') }}</span>
      </div>
    </y-carousel-item>
  </y-carousel>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>

<style scoped>
.carousel-slide {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  font-size: 15px;
}
.carousel-slide strong {
  font-size: 28px;
}
.carousel-slide-1 {
  background: linear-gradient(135deg, #1677ff, #69b1ff);
}
.carousel-slide-2 {
  background: linear-gradient(135deg, #13c2c2, #5cdbd3);
}
.carousel-slide-3 {
  background: linear-gradient(135deg, #722ed1, #b37feb);
}
.carousel-slide-4 {
  background: linear-gradient(135deg, #fa8c16, #ffc069);
}
</style>
