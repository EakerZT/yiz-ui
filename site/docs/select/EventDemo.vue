<template>
  <y-select v-model:value="value" :options="options" @change="changeCount++" />
  <span class="demo-hint">{{ $t('demo.select.changeCount', { count: changeCount }) }}</span>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

const value = ref()
const changeCount = ref(0)
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
