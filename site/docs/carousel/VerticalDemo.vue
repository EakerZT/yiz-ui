<template>
  <y-carousel direction="vertical" trigger="hover" height="240px" arrow="always">
    <y-carousel-item v-for="item in 4" :key="item">
      <div class="vertical-slide">
        <span>0{{ item }}</span>
        {{ $t('demo.carousel.verticalItem') }}
      </div>
    </y-carousel-item>
  </y-carousel>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>

<style scoped>
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
