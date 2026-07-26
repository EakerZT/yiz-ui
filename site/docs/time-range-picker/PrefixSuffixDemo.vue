<template>
  <div class="demo-picker-field">
    <y-time-range-picker v-model:start="affixStart" v-model:end="affixEnd" prefix="Work" suffix="UTC+8" clearable />
    <span class="demo-item-hint">{{
      (affixStart ?? $t('demo.common.empty')) + ' - ' + (affixEnd ?? $t('demo.common.empty'))
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const affixStart = ref<string | null>('09:00:00')

const affixEnd = ref<string | null>('18:00:00')
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
