import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import ClearableDemo from './ClearableDemo.vue'
import clearableDemoSource from './ClearableDemo.vue?raw'
import ShowSecondsDemo from './ShowSecondsDemo.vue'
import showSecondsDemoSource from './ShowSecondsDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import DefaultValueDemo from './DefaultValueDemo.vue'
import defaultValueDemoSource from './DefaultValueDemo.vue?raw'
import PrefixSuffixDemo from './PrefixSuffixDemo.vue'
import prefixSuffixDemoSource from './PrefixSuffixDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'ClearableDemo', titleKey: 'demo.common.clearable', component: ClearableDemo, source: clearableDemoSource },
  {
    id: 'ShowSecondsDemo',
    titleKey: 'demo.timePicker.showSeconds',
    component: ShowSecondsDemo,
    source: showSecondsDemoSource,
  },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  {
    id: 'DefaultValueDemo',
    titleKey: 'demo.timePicker.defaultValue',
    component: DefaultValueDemo,
    source: defaultValueDemoSource,
  },
  {
    id: 'PrefixSuffixDemo',
    titleKey: 'demo.common.prefixSuffix',
    component: PrefixSuffixDemo,
    source: prefixSuffixDemoSource,
  },
]

export const apiComponents = ['TimePicker']
