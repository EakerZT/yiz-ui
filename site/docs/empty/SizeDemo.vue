<template>
  <div class="demo-empty-size-panel">
    <y-radio-button-group v-model:value="emptySize" :options="sizeOptions" />
    <y-empty :size="emptySize" :description="t('demo.empty.listEmpty')" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

type DemoSize = 'small' | 'default' | 'large'

const emptySize = ref<DemoSize>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-empty-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
