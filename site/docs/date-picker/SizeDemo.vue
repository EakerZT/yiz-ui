<template>
  <div class="demo-picker-field">
    <y-radio-button-group v-model:value="datePickerSize" :options="sizeOptions" />
    <y-date-picker v-model:value="value4" :size="datePickerSize" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const value4 = ref<Date | null>(null)

const datePickerSize = ref<DemoSize>('default')

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

.demo-picker-field .yiz-date-picker {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
