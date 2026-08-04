import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicSource from './BasicDemo.vue?raw'
import ClearableDemo from './ClearableDemo.vue'
import clearableSource from './ClearableDemo.vue?raw'
import CustomRenderDemo from './CustomRenderDemo.vue'
import customRenderSource from './CustomRenderDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledSource from './DisabledDemo.vue?raw'
import EventDemo from './EventDemo.vue'
import eventSource from './EventDemo.vue?raw'
import MultipleDemo from './MultipleDemo.vue'
import multipleSource from './MultipleDemo.vue?raw'
import PlaceholderDemo from './PlaceholderDemo.vue'
import placeholderSource from './PlaceholderDemo.vue?raw'
import PrefixSuffixDemo from './PrefixSuffixDemo.vue'
import prefixSuffixSource from './PrefixSuffixDemo.vue?raw'
import SearchDemo from './SearchDemo.vue'
import searchSource from './SearchDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeSource from './SizeDemo.vue?raw'
import SlotDemo from './SlotDemo.vue'
import slotSource from './SlotDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicSource },
  { id: 'PlaceholderDemo', titleKey: 'demo.select.placeholder', component: PlaceholderDemo, source: placeholderSource },
  { id: 'ClearableDemo', titleKey: 'demo.common.clearable', component: ClearableDemo, source: clearableSource },
  { id: 'MultipleDemo', titleKey: 'demo.select.multiple', component: MultipleDemo, source: multipleSource },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledSource },
  {
    id: 'PrefixSuffixDemo',
    titleKey: 'demo.common.prefixSuffix',
    component: PrefixSuffixDemo,
    source: prefixSuffixSource,
  },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeSource },
  { id: 'EventDemo', titleKey: 'demo.common.event', component: EventDemo, source: eventSource },
  { id: 'SearchDemo', titleKey: 'demo.select.search', component: SearchDemo, source: searchSource },
  { id: 'SlotDemo', titleKey: 'demo.common.slot', component: SlotDemo, source: slotSource },
  {
    id: 'CustomRenderDemo',
    titleKey: 'demo.common.customRender',
    component: CustomRenderDemo,
    source: customRenderSource,
  },
]

export const apiComponents = ['Select', 'SelectOption']
