<template>
  <div class="demo-picker-field">
    <y-color-picker v-model:value="color" />
    <span class="demo-color-value">{{ color }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const color = ref('#1677ff')
</script>

<style scoped>
.demo-picker-field {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.demo-picker-field .yiz-color-picker {
  width: 100%;
}

.demo-color-value {
  color: #666;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  text-transform: uppercase;
}
</style>
