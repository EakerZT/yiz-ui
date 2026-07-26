<template>
  <div class="demo-descriptions-panel">
    <y-radio-button-group v-model:value="size" :options="sizeOptions" />
    <y-descriptions bordered :size="size" :title="$t('demo.descriptions.sizeTitle')">
      <y-description-item :label="$t('demo.descriptions.username')">
        {{ $t('demo.common.personLisi') }}
      </y-description-item>
      <y-description-item :label="$t('demo.descriptions.role')">{{ $t('demo.common.rolePm') }}</y-description-item>
      <y-description-item :label="$t('demo.descriptions.department')">
        {{ $t('demo.common.deptProduct') }}
      </y-description-item>
    </y-descriptions>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

type DemoSize = 'small' | 'default' | 'large'

const size = ref<DemoSize>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-descriptions-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
