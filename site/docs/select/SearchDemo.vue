<template>
  <y-select v-model:value="value" :options="options" :search="search" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const value = ref()
const options = computed(() => [
  { label: t('demo.common.beijing'), value: 'beijing' },
  { label: t('demo.common.shanghai'), value: 'shanghai' },
  { label: t('demo.common.guangzhou'), value: 'guangzhou' },
  { label: t('demo.common.shenzhen'), value: 'shenzhen' },
])

function search(query: string) {
  return options.value.filter((option) => option.label.includes(query))
}
</script>
