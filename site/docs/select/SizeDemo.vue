<template>
  <div class="select-size-demo">
    <y-radio-button-group v-model:value="size" :options="sizeOptions" />
    <y-select v-model:value="value" :options="options" :size="size" />
    <y-select v-model:value="multipleValue" :options="options" :size="size" multiple />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

const value = ref()
const multipleValue = ref(['beijing', 'shanghai'])
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
