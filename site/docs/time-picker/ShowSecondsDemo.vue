<template>
  <div class="demo-picker-field">
    <y-time-picker v-model:value="value3" :show-seconds="true" />
    <span class="demo-item-hint">{{ value3 || t('demo.common.notSelected') }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const value3 = ref<string | null>('09:15:30')
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
