<template>
  <div class="demo-input-group-stack">
    <y-radio-button-group v-model:value="groupSize" :options="sizeOptions" />
    <y-input-group :size="groupSize">
      <y-select v-model:value="city" :options="cityOptions" style="width: 128px" />
      <y-input v-model:value="keyword" :placeholder="$t('demo.inputGroup.keyword')" style="width: 220px" />
      <y-button type="primary">{{ $t('demo.inputGroup.searchButton') }}</y-button>
    </y-input-group>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

type DemoSize = 'small' | 'default' | 'large'

const city = ref('beijing')

const keyword = ref('')

const groupSize = ref<DemoSize>('default')

const cityOptions = computed(() => [
  { label: $t('demo.common.beijing'), value: 'beijing' },
  { label: $t('demo.common.shanghai'), value: 'shanghai' },
  { label: $t('demo.common.guangzhou'), value: 'guangzhou' },
  { label: $t('demo.common.shenzhen'), value: 'shenzhen' },
])

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-input-group-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
