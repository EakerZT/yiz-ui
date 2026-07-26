<template>
  <y-select v-model:value="value" :options="options" clearable />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

const value = ref('beijing')
const options = computed(() => [
  { label: $t('demo.common.beijing'), value: 'beijing' },
  { label: $t('demo.common.shanghai'), value: 'shanghai' },
  { label: $t('demo.common.guangzhou'), value: 'guangzhou' },
])
</script>
