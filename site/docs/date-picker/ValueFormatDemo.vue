<template>
  <div class="demo-picker-field">
    <y-date-picker v-model:value="value8" value-format="YYYY-MM-DD 00:00:00" clearable />
    <span class="demo-item-hint">{{ value8 ?? $t('demo.common.notSelected') }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const value8 = ref<string | null>('2026-06-17 00:00:00')
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
