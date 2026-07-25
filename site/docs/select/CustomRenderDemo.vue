<template>
  <Select v-model:value="value" :options="options">
    <template #option="{ option, selected }">
      <span :style="{ color: selected ? 'var(--yiz-color-primary)' : '#333' }">
        {{ option.label }}
        <span v-if="selected" style="margin-left: 4px; font-size: 12px">✓</span>
      </span>
    </template>
  </Select>
  <span class="demo-hint">{{ $t('demo.select.value', { value }) }}</span>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t, Select } from 'yiz-ui'

const value = ref()
const options = computed(() => [
  { label: $t('demo.common.beijing'), value: 'beijing' },
  { label: $t('demo.common.shanghai'), value: 'shanghai' },
  { label: $t('demo.common.guangzhou'), value: 'guangzhou' },
])
</script>

<style scoped>
.demo-hint {
  display: block;
  margin-top: 6px;
  color: #888;
  font-size: 13px;
}
</style>
