<template>
  <div class="demo-picker-field">
    <y-time-range-picker v-model:start="requiredStart" v-model:end="requiredEnd" force-range clearable />
    <span class="demo-item-hint">{{
      (requiredStart ?? t('demo.common.empty')) + ' - ' + (requiredEnd ?? t('demo.common.empty'))
    }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const requiredStart = ref<string | null>(null)

const requiredEnd = ref<string | null>(null)
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
