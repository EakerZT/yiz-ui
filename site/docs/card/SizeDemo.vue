<template>
  <div class="demo-card-size-panel">
    <y-radio-button-group v-model:value="cardSize" :options="sizeOptions" />
    <y-card :title="t('demo.card.defaultSize')" :size="cardSize" style="width: 280px">
      <p>{{ t('demo.card.defaultSizeHint') }}</p>
    </y-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

type DemoSize = 'small' | 'default' | 'large'

const cardSize = ref<DemoSize>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-card-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
