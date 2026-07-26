<template>
  <div class="demo-picker-field">
    <y-time-range-picker v-model:start="secondStart" v-model:end="secondEnd" show-seconds clearable />
    <span class="demo-item-hint">{{
      (secondStart ?? $t('demo.common.empty')) + ' - ' + (secondEnd ?? $t('demo.common.empty'))
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const secondStart = ref<string | null>('08:15:30')

const secondEnd = ref<string | null>('12:45:00')
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
