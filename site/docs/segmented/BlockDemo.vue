<template>
  <div class="demo-segmented-block">
    <y-segmented v-model:value="block" :options="viewOptions" block />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const viewOptions = computed(() => [
  { label: t('demo.segmented.list'), value: 'list' },
  { label: t('demo.segmented.card'), value: 'card' },
  { label: t('demo.segmented.chart'), value: 'chart' },
])

const block = ref('card')
</script>

<style scoped>
.demo-segmented-block {
  width: 360px;
  max-width: 100%;
}
</style>
