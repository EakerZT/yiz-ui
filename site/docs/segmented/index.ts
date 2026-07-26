import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import ShapeDemo from './ShapeDemo.vue'
import shapeDemoSource from './ShapeDemo.vue?raw'
import BlockDemo from './BlockDemo.vue'
import blockDemoSource from './BlockDemo.vue?raw'
import CustomRenderDemo from './CustomRenderDemo.vue'
import customRenderDemoSource from './CustomRenderDemo.vue?raw'
import EventDemo from './EventDemo.vue'
import eventDemoSource from './EventDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  { id: 'ShapeDemo', titleKey: 'demo.segmented.shape', component: ShapeDemo, source: shapeDemoSource },
  { id: 'BlockDemo', titleKey: 'demo.segmented.block', component: BlockDemo, source: blockDemoSource },
  {
    id: 'CustomRenderDemo',
    titleKey: 'demo.common.customRender',
    component: CustomRenderDemo,
    source: customRenderDemoSource,
  },
  { id: 'EventDemo', titleKey: 'demo.common.event', component: EventDemo, source: eventDemoSource },
]

export const apiComponents = ['Segmented']
