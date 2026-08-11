<template>
  <y-scroll-box :height="80" style="width: 360px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
    <div style="white-space: nowrap">
      <span v-for="i in 12" :key="i" class="demo-h-item">{{ t('demo.scrollBox.item', { index: i }) }}</span>
    </div>
  </y-scroll-box>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>

<style>
/* ScrollBox custom theme - blue */
</style>

<style scoped>
.demo-h-item {
  display: inline-block;
  width: 80px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #f0f5ff;
  margin-right: 8px;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
}
</style>
