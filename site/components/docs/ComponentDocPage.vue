<template>
  <section class="demo-section docs-component-page">
    <h2 class="demo-section-title">{{ $t(titleKey) }}</h2>
    <p class="demo-section-desc">{{ $t(descriptionKey) }}</p>

    <slot />

    <demo-block
      v-for="demo in demos"
      :key="demo.id"
      :title-key="demo.titleKey"
      :description-key="demo.descriptionKey"
      :component="demo.component"
      :source="demo.source"
    />

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

defineSlots<{
  default?: () => any
}>()

const selectedApis = computed(() => {
  const byName = new Map((apiData as ComponentApi[]).map((api) => [api.name, api]))
  return props.apiComponents.map((name) => byName.get(name)).filter((api): api is ComponentApi => Boolean(api))
})
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
