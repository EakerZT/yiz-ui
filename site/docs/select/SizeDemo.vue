<template>
  <div class="select-size-demo">
    <RadioButtonGroup v-model:value="size" :options="sizeOptions" />
    <Select v-model:value="value" :options="options" :size="size" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t, RadioButtonGroup, Select } from 'yiz-ui'

const value = ref()
const size = ref<'small' | 'default' | 'large'>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
const options = computed(() => [
  { label: $t('demo.common.beijing'), value: 'beijing' },
  { label: $t('demo.common.shanghai'), value: 'shanghai' },
  { label: $t('demo.common.guangzhou'), value: 'guangzhou' },
])
</script>

<style scoped>
.select-size-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
