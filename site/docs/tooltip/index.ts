import type { DemoDefinition } from '../types'
import PlacementDemo from './PlacementDemo.vue'
import placementDemoSource from './PlacementDemo.vue?raw'
import LongTextDemo from './LongTextDemo.vue'
import longTextDemoSource from './LongTextDemo.vue?raw'
import InlineDemo from './InlineDemo.vue'
import inlineDemoSource from './InlineDemo.vue?raw'
import CustomContentDemo from './CustomContentDemo.vue'
import customContentDemoSource from './CustomContentDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'PlacementDemo', titleKey: 'demo.common.placement', component: PlacementDemo, source: placementDemoSource },
  { id: 'LongTextDemo', titleKey: 'demo.tooltip.longText', component: LongTextDemo, source: longTextDemoSource },
  { id: 'InlineDemo', titleKey: 'demo.tooltip.inline', component: InlineDemo, source: inlineDemoSource },
  {
    id: 'CustomContentDemo',
    titleKey: 'demo.common.customContent',
    component: CustomContentDemo,
    source: customContentDemoSource,
  },
]

export const apiComponents = ['Tooltip']
