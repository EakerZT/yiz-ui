<template>
  <div class="demo-input-row">
    <y-radio-button-group v-model:value="inputSize" :options="sizeOptions" />
    <y-input v-model:value="sizeText" :placeholder="$t('demo.common.pleaseInput')" :size="inputSize" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

type DemoSize = 'small' | 'default' | 'large'

const sizeText = ref('')

const inputSize = ref<DemoSize>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-input-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
