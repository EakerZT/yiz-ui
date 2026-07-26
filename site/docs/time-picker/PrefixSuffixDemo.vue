<template>
  <div class="demo-picker-field">
    <y-time-picker v-model:value="value7" prefix="Start" suffix="UTC+8" clearable />
    <span class="demo-item-hint">{{ value7 || $t('demo.common.notSelected') }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const value7 = ref<string | null>('09:30:00')
</script>

<style scoped>
.demo-picker-field {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.demo-picker-field .yiz-time-picker {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
