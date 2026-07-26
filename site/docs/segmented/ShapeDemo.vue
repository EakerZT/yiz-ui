<template>
  <div class="demo-segmented-stack">
    <y-radio-button-group v-model:value="shapeSize" :options="sizeOptions" />
    <y-segmented v-model:value="shapeBlock" :options="periodOptions" :size="shapeSize" />
    <y-segmented v-model:value="shapeRound" :options="periodOptions" shape="round" :size="shapeSize" />
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

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]

const shapeBlock = ref('day')

const shapeRound = ref('week')

const shapeSize = ref<'small' | 'default' | 'large'>('default')
</script>

<style scoped>
.demo-segmented-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
