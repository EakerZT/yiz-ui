<template>
  <y-input-group>
    <y-select v-model:value="city" :options="cityOptions" style="width: 128px" />
    <y-input v-model:value="keyword" :placeholder="t('demo.inputGroup.keyword')" style="width: 220px" />
    <y-button type="primary">{{ t('demo.inputGroup.searchButton') }}</y-button>
  </y-input-group>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const city = ref('beijing')

const keyword = ref('')

const cityOptions = computed(() => [
  { label: t('demo.common.beijing'), value: 'beijing' },
  { label: t('demo.common.shanghai'), value: 'shanghai' },
  { label: t('demo.common.guangzhou'), value: 'guangzhou' },
  { label: t('demo.common.shenzhen'), value: 'shenzhen' },
])
</script>
