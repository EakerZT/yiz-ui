<template>
  <y-rate v-model:value="value" show-text :texts="texts" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const value = ref(3)
const texts = computed(() => [
  t('demo.rate.level1'),
  t('demo.rate.level2'),
  t('demo.rate.level3'),
  t('demo.rate.level4'),
  t('demo.rate.level5'),
])
</script>
