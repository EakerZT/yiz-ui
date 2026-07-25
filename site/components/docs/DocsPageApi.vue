<template>
  <section v-if="selectedApis.length" class="demo-section docs-generated-api">
    <h2>{{ $t('demo.docs.api') }}</h2>
    <ApiSection v-for="api in selectedApis" :key="api.name" :api="api" />
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { $t } from '../../i18n'
import apiData from '../../generated/component-api.json'
import type { ComponentApi } from '../../docs/types'
import ApiSection from './ApiSection.vue'

const props = defineProps<{ pageName: string }>()

const relatedApis: Record<string, string[]> = {
  Breadcrumb: ['Breadcrumb', 'BreadcrumbItem'],
  Checkbox: ['Checkbox', 'CheckboxGroup'],
  Collapse: ['Collapse', 'CollapseItem'],
  ContextMenu: ['showContextMenu'],
  Descriptions: ['Descriptions', 'DescriptionItem'],
  Dropmenu: ['Dropmenu', 'DropmenuItem'],
  Emitter: ['Emitter'],
  Form: ['Form', 'FormItem'],
  LayerManager: ['LayerManager'],
  LoadingBar: ['loadingBar'],
  Menu: ['Menu', 'MenuOption'],
  Message: ['message'],
  Notification: ['notification'],
  Radio: ['Radio', 'RadioGroup', 'RadioButton', 'RadioButtonGroup'],
  Tab: ['Tab', 'TabPane'],
  Table: ['Table', 'TableColumn'],
  Timeline: ['Timeline', 'TimelineItem'],
}

const selectedApis = computed(() => {
  const componentName = props.pageName.replace(/Demo$/, '')
  const names = relatedApis[componentName] ?? [componentName]
  const byName = new Map((apiData as ComponentApi[]).map((api) => [api.name, api]))
  return names.map((name) => byName.get(name)).filter((api): api is ComponentApi => Boolean(api))
})
</script>

<style scoped>
.docs-generated-api {
  width: min(1100px, 100%);
  margin: 0 auto;
  padding-top: 16px;
  padding-bottom: 64px;
}

.docs-generated-api > h2 {
  font-size: 22px;
}
</style>
