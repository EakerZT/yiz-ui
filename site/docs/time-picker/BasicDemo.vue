<template>
  <div class="demo-picker-field">
    <y-time-picker v-model:value="value1" />
    <span class="demo-item-hint">{{ value1 || t('demo.common.notSelected') }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const value1 = ref<string | null>(null)
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
