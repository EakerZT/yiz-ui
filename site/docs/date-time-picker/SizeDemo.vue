<template>
  <div class="demo-picker-field">
    <y-radio-button-group v-model:value="pickerSize" :options="sizeOptions" />
    <y-date-time-picker v-model:value="value3" :size="pickerSize" clearable />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const value3 = ref<Date | null>(null)

const pickerSize = ref<DemoSize>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-picker-field {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.demo-picker-field .yiz-datetime-picker {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
