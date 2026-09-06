<script lang="ts" setup>
import { ref } from 'vue'
import { Input, InputAddon, InputGroup, InputNumber, useLocale } from 'yiz-ui'

const t = useLocale()
const minimum = ref(100)
const maximum = ref(500)
const account = ref('hello')
const domain = ref('example.com')
const width = ref(1920)
const height = ref(1080)
</script>

<template>
  <div class="demo-inline-addon">
    <InputGroup>
      <InputAddon>{{ t('demo.inputGroup.price') }}</InputAddon>
      <InputNumber v-model:value="minimum" controls="none" :aria-label="t('demo.inputGroup.minimum')" />
      <InputAddon>{{ t('demo.inputGroup.to') }}</InputAddon>
      <InputNumber v-model:value="maximum" controls="none" :aria-label="t('demo.inputGroup.maximum')" />
      <InputAddon>{{ t('demo.inputGroup.currency') }}</InputAddon>
    </InputGroup>
    <InputGroup size="small">
      <Input v-model:value="account" :aria-label="t('demo.inputGroup.account')" />
      <InputAddon>@</InputAddon>
      <Input v-model:value="domain" :aria-label="t('demo.inputGroup.domain')" />
    </InputGroup>
    <InputGroup size="large" style-mode="filled">
      <InputAddon>{{ t('demo.inputGroup.dimensions') }}</InputAddon>
      <InputNumber v-model:value="width" controls="none" :aria-label="t('demo.inputGroup.width')" />
      <InputAddon>×</InputAddon>
      <InputNumber v-model:value="height" controls="none" :aria-label="t('demo.inputGroup.height')" />
      <InputAddon>px</InputAddon>
    </InputGroup>
  </div>
</template>

<style scoped>
.demo-inline-addon {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  overflow-x: auto;
}
.demo-inline-addon :deep(.yiz-input),
.demo-inline-addon :deep(.yiz-input-number) {
  width: 140px;
}
</style>
