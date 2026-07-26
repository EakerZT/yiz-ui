import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import AccordionDemo from './AccordionDemo.vue'
import accordionDemoSource from './AccordionDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'
import CustomTitleDemo from './CustomTitleDemo.vue'
import customTitleDemoSource from './CustomTitleDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  { id: 'AccordionDemo', titleKey: 'demo.collapse.accordion', component: AccordionDemo, source: accordionDemoSource },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
  {
    id: 'CustomTitleDemo',
    titleKey: 'demo.common.customTitle',
    component: CustomTitleDemo,
    source: customTitleDemoSource,
  },
]

export const apiComponents = ['Collapse', 'CollapseItem']
