<template>
  <y-segmented v-model:value="basic" :options="periodOptions" /><span class="demo-hint">{{
    t('demo.segmented.currentValue', { value: basic })
  }}</span>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const periodOptions = computed(() => [
  { label: t('demo.segmented.day'), value: 'day' },
  { label: t('demo.segmented.week'), value: 'week' },
  { label: t('demo.segmented.month'), value: 'month' },
  { label: t('demo.segmented.year'), value: 'year' },
])

const basic = ref('week')
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
  vertical-align: middle;
}
</style>
