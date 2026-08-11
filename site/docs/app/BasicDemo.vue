<template>
  <YizApp class="app-demo-scope" :theme="localTheme">
    <y-input :placeholder="t('demo.common.pleaseInput')" />
    <y-input-number :value="8" />
    <y-button type="primary">{{ t('demo.common.confirm') }}</y-button>
    <y-button color="success">{{ t('demo.common.success') }}</y-button>
  </YizApp>
</template>

<script lang="ts" setup>
import { App as YizApp, useLocale, type DeepPartial, type Theme } from 'yiz-ui'

const t = useLocale()
const localTheme: DeepPartial<Theme> = {
  size: 'small',
  styleMode: 'filled',
  inputNumber: {
    controls: 'separate',
  },
  colors: {
    primary: '#722ed1',
  },
}
</script>

<style scoped>
.app-demo-scope {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--yiz-color-border);
  border-radius: var(--yiz-radius-container);
}

.app-demo-scope :deep(.yiz-input-wrapper) {
  width: 220px;
}
</style>
