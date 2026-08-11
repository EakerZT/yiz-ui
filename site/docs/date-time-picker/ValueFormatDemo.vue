<template>
  <div class="demo-picker-field">
    <y-date-time-picker v-model:value="value2" value-format="YYYY-MM-DD HH:mm:ss" clearable />
    <span class="demo-item-hint">{{ value2 ?? t('demo.common.empty') }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const value2 = ref<string | null>('2026-06-17 09:30:00')
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
