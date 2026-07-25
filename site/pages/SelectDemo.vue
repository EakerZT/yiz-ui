<template>
  <ComponentDocPage
    title-key="demo.nav.select"
    description-key="demo.select.desc"
    :demos="demos"
    :api-components="['Select', 'SelectOption']"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import type { DemoDefinition } from '../docs/types'
import BasicDemo from '../docs/select/BasicDemo.vue'
import basicSource from '../docs/select/BasicDemo.vue?raw'
import ClearableDemo from '../docs/select/ClearableDemo.vue'
import clearableSource from '../docs/select/ClearableDemo.vue?raw'
import CustomRenderDemo from '../docs/select/CustomRenderDemo.vue'
import customRenderSource from '../docs/select/CustomRenderDemo.vue?raw'
import DisabledDemo from '../docs/select/DisabledDemo.vue'
import disabledSource from '../docs/select/DisabledDemo.vue?raw'
import EventDemo from '../docs/select/EventDemo.vue'
import eventSource from '../docs/select/EventDemo.vue?raw'
import PlaceholderDemo from '../docs/select/PlaceholderDemo.vue'
import placeholderSource from '../docs/select/PlaceholderDemo.vue?raw'
import PrefixSuffixDemo from '../docs/select/PrefixSuffixDemo.vue'
import prefixSuffixSource from '../docs/select/PrefixSuffixDemo.vue?raw'
import SearchDemo from '../docs/select/SearchDemo.vue'
import searchSource from '../docs/select/SearchDemo.vue?raw'
import SizeDemo from '../docs/select/SizeDemo.vue'
import sizeSource from '../docs/select/SizeDemo.vue?raw'
import SlotDemo from '../docs/select/SlotDemo.vue'
import slotSource from '../docs/select/SlotDemo.vue?raw'

const demos: DemoDefinition[] = [
  { titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicSource },
  { titleKey: 'demo.select.placeholder', component: PlaceholderDemo, source: placeholderSource },
  { titleKey: 'demo.common.clearable', component: ClearableDemo, source: clearableSource },
  { titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledSource },
  { titleKey: 'demo.common.prefixSuffix', component: PrefixSuffixDemo, source: prefixSuffixSource },
  { titleKey: 'demo.common.size', component: SizeDemo, source: sizeSource },
  { titleKey: 'demo.common.event', component: EventDemo, source: eventSource },
  { titleKey: 'demo.select.search', component: SearchDemo, source: searchSource },
  { titleKey: 'demo.common.slot', component: SlotDemo, source: slotSource },
  { titleKey: 'demo.common.customRender', component: CustomRenderDemo, source: customRenderSource },
]
</script>
