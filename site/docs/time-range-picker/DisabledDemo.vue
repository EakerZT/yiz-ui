<template>
  <div class="demo-picker-field">
    <y-time-range-picker v-model:start="disabledStart" v-model:end="disabledEnd" disabled />
    <span class="demo-item-hint">{{
      (disabledStart ?? t('demo.common.empty')) + ' - ' + (disabledEnd ?? t('demo.common.empty'))
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const disabledStart = ref<string | null>('09:30:00')

const disabledEnd = ref<string | null>('17:30:00')
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
