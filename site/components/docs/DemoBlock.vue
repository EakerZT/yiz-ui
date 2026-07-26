<template>
  <DemoCard :title="$t(titleKey)" :source="source" style="margin-top: 8px">
    <p v-if="descriptionKey" class="docs-demo-description">{{ $t(descriptionKey) }}</p>
    <component :is="component" />
  </DemoCard>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import { $t } from '../../i18n'
import DemoCard from './DemoCard.vue'

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
  color: #888;
  font-size: 13px;
  line-height: 1.6;
}
</style>
