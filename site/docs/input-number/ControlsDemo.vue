<template>
  <div class="input-number-controls-demo">
    <div v-for="control in controls" :key="control" class="input-number-controls-item">
      <code>{{ control }}</code>
      <y-input-number v-model:value="values[control]" :controls="control" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

type InputNumberControls = 'left' | 'right' | 'separate' | 'none'

const controls: InputNumberControls[] = ['left', 'right', 'separate', 'none']
const values = reactive<Record<InputNumberControls, number | null>>({
  left: 0,
  right: 0,
  separate: 0,
  none: 0,
})
</script>

<style scoped>
.input-number-controls-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.input-number-controls-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
