<template>
  <slot />
  <DocsPageApi v-if="!hasInlineApi" :page-name="pageName" />
</template>

<script lang="ts" setup>
import { computed, provide } from 'vue'
import demoSourceData from '../../generated/demo-sources.json'
import { demoSourcePageKey, type DemoSourcePage } from './demoSourceContext'
import DocsPageApi from './DocsPageApi.vue'

const props = defineProps<{ pageName: string }>()
const inlineApiPages = new Set(['ButtonDemo', 'SelectDemo', 'DialogDemo'])

const sourcePage = computed(() => (demoSourceData as Record<string, DemoSourcePage>)[props.pageName])
const hasInlineApi = computed(() => inlineApiPages.has(props.pageName))

provide(demoSourcePageKey, sourcePage)
</script>
