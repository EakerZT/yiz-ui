import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import ClearableDemo from './ClearableDemo.vue'
import clearableDemoSource from './ClearableDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import DisableDatesDemo from './DisableDatesDemo.vue'
import disableDatesDemoSource from './DisableDatesDemo.vue?raw'
import CustomFormatDemo from './CustomFormatDemo.vue'
import customFormatDemoSource from './CustomFormatDemo.vue?raw'
import ValueFormatDemo from './ValueFormatDemo.vue'
import valueFormatDemoSource from './ValueFormatDemo.vue?raw'
import PrefixSuffixDemo from './PrefixSuffixDemo.vue'
import prefixSuffixDemoSource from './PrefixSuffixDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'ClearableDemo', titleKey: 'demo.common.clearable', component: ClearableDemo, source: clearableDemoSource },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  {
    id: 'DisableDatesDemo',
    titleKey: 'demo.datePicker.disableDates',
    component: DisableDatesDemo,
    source: disableDatesDemoSource,
  },
  {
    id: 'CustomFormatDemo',
    titleKey: 'demo.common.customFormat',
    component: CustomFormatDemo,
    source: customFormatDemoSource,
  },
  {
    id: 'ValueFormatDemo',
    titleKey: 'demo.datePicker.valueFormat',
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

export const apiComponents = ['DatePicker']
