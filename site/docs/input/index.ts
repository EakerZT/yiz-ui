import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import ClearableDemo from './ClearableDemo.vue'
import clearableDemoSource from './ClearableDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'
import PrefixSuffixDemo from './PrefixSuffixDemo.vue'
import prefixSuffixDemoSource from './PrefixSuffixDemo.vue?raw'
import StyleModeDemo from './StyleModeDemo.vue'
import styleModeDemoSource from './StyleModeDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  { id: 'StyleModeDemo', titleKey: 'demo.common.styleMode', component: StyleModeDemo, source: styleModeDemoSource },
  { id: 'ClearableDemo', titleKey: 'demo.common.clearable', component: ClearableDemo, source: clearableDemoSource },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
  {
    id: 'PrefixSuffixDemo',
    titleKey: 'demo.common.prefixSuffix',
    component: PrefixSuffixDemo,
    source: prefixSuffixDemoSource,
  },
]

export const apiComponents = ['Input']
