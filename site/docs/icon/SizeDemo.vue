<template>
  <div class="demo-icon-size-panel">
    <y-radio-button-group v-model:value="iconSize" :options="sizeOptions" />
    <span class="demo-icon-item">
      <y-icon :icon="Flash20Regular" :size="iconSize" />
      <em>{{ iconSize }}px</em>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { Flash20Regular } from '@vicons/fluent'
import { ref } from 'vue'

const iconSize = ref(20)

const sizeOptions = [
  { label: '12px', value: 12 },
  { label: '20px', value: 20 },
  { label: '36px', value: 36 },
]
</script>

<style scoped>
.demo-icon-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}
.demo-icon-item em {
  font-style: normal;
  color: #bbb;
}

.demo-icon-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
