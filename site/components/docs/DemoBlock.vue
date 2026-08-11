<template>
  <DemoCard :title="t(titleKey)" :source="source" style="margin-top: 8px">
    <p v-if="descriptionKey" class="docs-demo-description">{{ t(descriptionKey) }}</p>
    <component :is="component" />
  </DemoCard>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import { useLocale } from '../../i18n'
import DemoCard from './DemoCard.vue'

const t = useLocale()

defineProps<{
  titleKey: string
  descriptionKey?: string
  component: Component
  source: string
}>()
</script>

<style scoped>
.docs-demo-description {
  margin-bottom: 12px;
  color: var(--yiz-color-text-tertiary);
  font-size: 13px;
  line-height: 1.6;
}
</style>
