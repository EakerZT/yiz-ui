<template>
  <Select v-model:value="value" :options="options" :placeholder="$t('demo.select.cityPlaceholder')" />
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
