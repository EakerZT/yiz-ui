<template>
  <div class="demo-picker-field">
    <y-date-time-range-picker
      v-model:start="stringStart"
      v-model:end="stringEnd"
      start-value-format="YYYY-MM-DD HH:mm:ss"
      end-value-format="YYYY-MM-DD HH:mm:ss"
      clearable
    />
    <span class="demo-item-hint"
      >{{ stringStart ?? $t('demo.common.empty') }} - {{ stringEnd ?? $t('demo.common.empty') }}</span
    >
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const stringStart = ref<string | null>('2026-06-01 00:00:00')

const stringEnd = ref<string | null>('2026-06-12 23:59:59')
</script>

<style scoped>
.demo-picker-field {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.demo-picker-field .yiz-datetime-range-picker {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
