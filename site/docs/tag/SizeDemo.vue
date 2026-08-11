<template>
  <div class="demo-tag-size-panel">
    <y-radio-button-group v-model:value="tagSize" :options="sizeOptions" />
    <y-button-group>
      <y-tag :size="tagSize">{{ t('demo.tag.defaultTag') }}</y-tag>
      <y-tag color="primary" :size="tagSize">{{ t('demo.common.primary') }}</y-tag>
      <y-tag color="success" :size="tagSize">{{ t('demo.common.success') }}</y-tag>
    </y-button-group>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

type DemoSize = 'small' | 'default' | 'large'

const tagSize = ref<DemoSize>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-tag-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
