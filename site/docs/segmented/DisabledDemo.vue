<template>
  <div class="demo-segmented-stack">
    <y-segmented v-model:value="disabledItem" :options="disabledOptions" />
    <y-segmented v-model:value="disabledGroup" :options="periodOptions" disabled />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

const periodOptions = computed(() => [
  { label: $t('demo.segmented.day'), value: 'day' },
  { label: $t('demo.segmented.week'), value: 'week' },
  { label: $t('demo.segmented.month'), value: 'month' },
  { label: $t('demo.segmented.year'), value: 'year' },
])

const disabledOptions = computed(() => [
  { label: $t('demo.segmented.day'), value: 'day' },
  { label: $t('demo.segmented.week'), value: 'week', disabled: true },
  { label: $t('demo.segmented.month'), value: 'month' },
])

const disabledItem = ref('month')

const disabledGroup = ref('week')
</script>

<style scoped>
.demo-segmented-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
