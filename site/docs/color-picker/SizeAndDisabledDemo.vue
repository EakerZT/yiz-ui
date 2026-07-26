<template>
  <div class="demo-picker-field">
    <y-radio-button-group v-model:value="colorPickerSize" :options="sizeOptions" />
    <y-color-picker v-model:value="sizeColor" :size="colorPickerSize" />
    <y-color-picker v-model:value="disabledColor" disabled />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const sizeColor = ref('#52c41a')

const disabledColor = ref('#d9d9d9')

const colorPickerSize = ref<DemoSize>('default')

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

.demo-picker-field .yiz-color-picker {
  width: 100%;
}
</style>
