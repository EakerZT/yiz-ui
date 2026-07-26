import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import CustomColorDemo from './CustomColorDemo.vue'
import customColorDemoSource from './CustomColorDemo.vue?raw'
import LoadingDemo from './LoadingDemo.vue'
import loadingDemoSource from './LoadingDemo.vue?raw'
import EventDemo from './EventDemo.vue'
import eventDemoSource from './EventDemo.vue?raw'
import CustomValueDemo from './CustomValueDemo.vue'
import customValueDemoSource from './CustomValueDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  {
    id: 'CustomColorDemo',
    titleKey: 'demo.button.customColor',
    component: CustomColorDemo,
    source: customColorDemoSource,
  },
  { id: 'LoadingDemo', titleKey: 'demo.common.loading', component: LoadingDemo, source: loadingDemoSource },
  { id: 'EventDemo', titleKey: 'demo.common.event', component: EventDemo, source: eventDemoSource },
  {
    id: 'CustomValueDemo',
    titleKey: 'demo.switch.customValue',
    component: CustomValueDemo,
    source: customValueDemoSource,
  },
]

export const apiComponents = ['Switch']
