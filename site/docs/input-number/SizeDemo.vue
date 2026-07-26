<template>
  <div class="demo-input-number-size-panel">
    <y-radio-button-group v-model:value="inputNumberSize" :options="sizeOptions" />
    <y-input-number v-model:value="v5" :size="inputNumberSize" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const v5 = ref<number | null>(0)

const inputNumberSize = ref<DemoSize>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-input-number-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
