import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import DefaultCheckedDemo from './DefaultCheckedDemo.vue'
import defaultCheckedDemoSource from './DefaultCheckedDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'
import SlotDemo from './SlotDemo.vue'
import slotDemoSource from './SlotDemo.vue?raw'
import BorderDemo from './BorderDemo.vue'
import borderDemoSource from './BorderDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import HorizontalDemo from './HorizontalDemo.vue'
import horizontalDemoSource from './HorizontalDemo.vue?raw'
import VerticalDemo from './VerticalDemo.vue'
import verticalDemoSource from './VerticalDemo.vue?raw'
import FreeDemo from './FreeDemo.vue'
import freeDemoSource from './FreeDemo.vue?raw'
import CheckboxGroupDisabledDemo from './CheckboxGroupDisabledDemo.vue'
import checkboxGroupDisabledDemoSource from './CheckboxGroupDisabledDemo.vue?raw'
import CheckboxGroupSlotDemo from './CheckboxGroupSlotDemo.vue'
import checkboxGroupSlotDemoSource from './CheckboxGroupSlotDemo.vue?raw'
import CheckboxGroupBorderDemo from './CheckboxGroupBorderDemo.vue'
import checkboxGroupBorderDemoSource from './CheckboxGroupBorderDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  {
    id: 'DefaultCheckedDemo',
    titleKey: 'demo.checkbox.defaultChecked',
    component: DefaultCheckedDemo,
    source: defaultCheckedDemoSource,
  },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
  { id: 'SlotDemo', titleKey: 'demo.common.slot', component: SlotDemo, source: slotDemoSource },
  { id: 'BorderDemo', titleKey: 'demo.card.border', component: BorderDemo, source: borderDemoSource },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  { id: 'HorizontalDemo', titleKey: 'demo.common.horizontal', component: HorizontalDemo, source: horizontalDemoSource },
  { id: 'VerticalDemo', titleKey: 'demo.common.vertical', component: VerticalDemo, source: verticalDemoSource },
  { id: 'FreeDemo', titleKey: 'demo.checkbox.free', component: FreeDemo, source: freeDemoSource },
  {
    id: 'CheckboxGroupDisabledDemo',
    titleKey: 'demo.common.disabled',
    component: CheckboxGroupDisabledDemo,
    source: checkboxGroupDisabledDemoSource,
  },
  {
    id: 'CheckboxGroupSlotDemo',
    titleKey: 'demo.common.slot',
    component: CheckboxGroupSlotDemo,
    source: checkboxGroupSlotDemoSource,
  },
  {
    id: 'CheckboxGroupBorderDemo',
    titleKey: 'demo.card.border',
    component: CheckboxGroupBorderDemo,
    source: checkboxGroupBorderDemoSource,
  },
]

export const apiComponents = ['Checkbox', 'CheckboxGroup']
