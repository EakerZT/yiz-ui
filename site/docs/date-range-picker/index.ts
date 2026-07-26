import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import AllowSingleDemo from './AllowSingleDemo.vue'
import allowSingleDemoSource from './AllowSingleDemo.vue?raw'
import RequiredRangeDemo from './RequiredRangeDemo.vue'
import requiredRangeDemoSource from './RequiredRangeDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'
import DisableAutoSortDemo from './DisableAutoSortDemo.vue'
import disableAutoSortDemoSource from './DisableAutoSortDemo.vue?raw'
import DisableDatesDemo from './DisableDatesDemo.vue'
import disableDatesDemoSource from './DisableDatesDemo.vue?raw'
import ValueFormatDemo from './ValueFormatDemo.vue'
import valueFormatDemoSource from './ValueFormatDemo.vue?raw'
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
    id: 'DisableAutoSortDemo',
    titleKey: 'demo.dateRangePicker.disableAutoSort',
    component: DisableAutoSortDemo,
    source: disableAutoSortDemoSource,
  },
  {
    id: 'DisableDatesDemo',
    titleKey: 'demo.dateRangePicker.disableDates',
    component: DisableDatesDemo,
    source: disableDatesDemoSource,
  },
  {
    id: 'ValueFormatDemo',
    titleKey: 'demo.dateRangePicker.valueFormat',
    component: ValueFormatDemo,
    source: valueFormatDemoSource,
  },
  {
    id: 'PrefixSuffixDemo',
    titleKey: 'demo.common.prefixSuffix',
    component: PrefixSuffixDemo,
    source: prefixSuffixDemoSource,
  },
]

export const apiComponents = ['DateRangePicker']
