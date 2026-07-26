<template>
  <div class="demo-loading-size-panel">
    <y-radio-button-group v-model:value="loadingSize" :options="sizeOptions" />
    <span class="demo-loading-item">
      <y-loading :size="loadingSize" />
      <em>{{ loadingSize }}</em>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const loadingSize = ref<DemoSize>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-loading-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}
.demo-loading-item em {
  font-style: normal;
  color: #bbb;
}
.demo-loading-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
