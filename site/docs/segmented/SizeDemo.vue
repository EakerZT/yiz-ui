<template>
  <div class="demo-segmented-stack">
    <y-radio-button-group v-model:value="segmentedSize" :options="sizeOptions" />
    <y-segmented v-model:value="sizeValue" :options="periodOptions" :size="segmentedSize" />
  </div>
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

const sizeValue = ref('week')

const segmentedSize = ref<'small' | 'default' | 'large'>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-segmented-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
