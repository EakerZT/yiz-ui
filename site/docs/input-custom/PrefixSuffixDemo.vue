<template>
  <div class="demo-input-custom-stack">
    <y-radio-button-group v-model:value="customSize" :options="sizeOptions" />
    <y-input-custom :size="customSize" style="width: 280px">
      <template #prefix>
        <y-icon :icon="Search20Regular" />
      </template>
      <input v-model="keyword" class="demo-input-custom-native" :placeholder="t('demo.inputCustom.keyword')" />
      <template #suffix>{{ keyword.length }}</template>
    </y-input-custom>
  </div>
</template>

<script lang="ts" setup>
import { Search20Regular } from '@vicons/fluent'
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

type DemoSize = 'small' | 'default' | 'large'

const keyword = ref('')

const customSize = ref<DemoSize>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-input-custom-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.demo-input-custom-native {
  flex: 1;
  min-width: 0;
  width: 100%;
  height: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: #333;
  font: inherit;
}

.demo-input-custom-native::placeholder {
  color: #c0c4cc;
}
</style>
