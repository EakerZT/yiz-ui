import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import AllowSingleDemo from './AllowSingleDemo.vue'
import allowSingleDemoSource from './AllowSingleDemo.vue?raw'
import RequiredRangeDemo from './RequiredRangeDemo.vue'
import requiredRangeDemoSource from './RequiredRangeDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'
import ShowSecondsDemo from './ShowSecondsDemo.vue'
import showSecondsDemoSource from './ShowSecondsDemo.vue?raw'
import PrefixSuffixDemo from './PrefixSuffixDemo.vue'
import prefixSuffixDemoSource from './PrefixSuffixDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  {
    id: 'AllowSingleDemo',
    titleKey: 'demo.dateRangePicker.allowSingle',
    component: AllowSingleDemo,
    source: allowSingleDemoSource,
  },
  {
    id: 'RequiredRangeDemo',
    titleKey: 'demo.dateRangePicker.requiredRange',
    component: RequiredRangeDemo,
    source: requiredRangeDemoSource,
  },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
  {
    id: 'ShowSecondsDemo',
    titleKey: 'demo.timePicker.showSeconds',
    component: ShowSecondsDemo,
    source: showSecondsDemoSource,
  },
  {
    id: 'PrefixSuffixDemo',
    titleKey: 'demo.common.prefixSuffix',
    component: PrefixSuffixDemo,
    source: prefixSuffixDemoSource,
  },
]

export const apiComponents = ['TimeRangePicker']
