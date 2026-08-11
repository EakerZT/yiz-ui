<template>
  <div class="demo-input-row">
    <y-radio-button-group v-model:value="passwordSize" :options="sizeOptions" />
    <y-input-password
      v-model:value="sizePassword"
      :placeholder="t('demo.inputPassword.placeholder')"
      :size="passwordSize"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

type DemoSize = 'small' | 'default' | 'large'

const sizePassword = ref('')

const passwordSize = ref<DemoSize>('default')

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
