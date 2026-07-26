<template>
  <div class="demo-picker-field">
    <y-time-range-picker v-model:start="optionalStart" v-model:end="optionalEnd" clearable />
    <span class="demo-item-hint">{{
      (optionalStart ?? $t('demo.common.empty')) + ' - ' + (optionalEnd ?? $t('demo.common.empty'))
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const optionalStart = ref<string | null>('10:30:00')

const optionalEnd = ref<string | null>(null)
</script>

<style scoped>
.demo-picker-field {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.demo-picker-field .yiz-time-range-picker {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
