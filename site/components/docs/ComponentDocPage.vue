<template>
  <section class="demo-section docs-component-page">
    <h2 class="demo-section-title">{{ $t(titleKey) }}</h2>
    <p class="demo-section-desc">{{ $t(descriptionKey) }}</p>

    <demo-block v-for="demo in demos" :key="demo.titleKey" v-bind="demo" />

    <section class="docs-api-section">
      <h2>{{ $t('demo.docs.api') }}</h2>
      <api-section v-for="api in selectedApis" :key="api.name" :api="api" />
    </section>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { $t } from '../../i18n'
import apiData from '../../generated/component-api.json'
import type { ComponentApi, DemoDefinition } from '../../docs/types'
import ApiSection from './ApiSection.vue'
import DemoBlock from './DemoBlock.vue'

const props = defineProps<{
  titleKey: string
  descriptionKey: string
  demos: DemoDefinition[]
  apiComponents: string[]
}>()

const selectedApis = computed(() => (apiData as ComponentApi[]).filter((api) => props.apiComponents.includes(api.name)))
</script>

<style scoped>
.docs-component-page {
  width: min(1100px, 100%);
  margin: 0 auto;
  padding-bottom: 64px;
}

.docs-api-section {
  margin-top: 40px;
}

.docs-api-section > h2 {
  font-size: 22px;
}
</style>
