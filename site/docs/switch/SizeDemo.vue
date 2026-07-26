<template>
  <div class="demo-switch-size-panel">
    <y-radio-button-group v-model:value="switchSize" :options="sizeOptions" />
    <y-switch v-model:value="v4" :size="switchSize" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const v4 = ref(true)

const switchSize = ref<DemoSize>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-switch-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
