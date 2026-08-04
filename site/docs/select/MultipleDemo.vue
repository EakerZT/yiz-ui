<template>
  <y-select v-model:value="value" :options="options" multiple :max="2" clearable />
  <span class="demo-hint">
    {{ $t('demo.select.value', { value: value.join(', ') || $t('demo.common.empty') }) }}
  </span>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

const value = ref<string[]>(['beijing'])
const options = computed(() => [
  { label: $t('demo.common.beijing'), value: 'beijing' },
  { label: $t('demo.common.shanghai'), value: 'shanghai' },
  { label: $t('demo.common.guangzhou'), value: 'guangzhou' },
  { label: $t('demo.common.shenzhen'), value: 'shenzhen' },
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
