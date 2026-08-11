<template>
  <y-descriptions bordered layout="vertical" :title="t('demo.descriptions.projectInfo')">
    <y-description-item :label="t('demo.descriptions.projectName')">Yiz UI</y-description-item>
    <y-description-item>
      <template #label>
        <span class="demo-descriptions-label">{{ t('demo.descriptions.version') }}</span>
      </template>
      1.0.0
    </y-description-item>
    <y-description-item :label="t('demo.descriptions.license')">MIT</y-description-item>
  </y-descriptions>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>

<style scoped>
.demo-descriptions-label {
  color: var(--yiz-color-primary);
}
</style>
