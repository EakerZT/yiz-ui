import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import PlacementDemo from './PlacementDemo.vue'
import placementDemoSource from './PlacementDemo.vue?raw'
import AsyncDemo from './AsyncDemo.vue'
import asyncDemoSource from './AsyncDemo.vue?raw'
import NestedOverlayDemo from './NestedOverlayDemo.vue'
import nestedOverlayDemoSource from './NestedOverlayDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'PlacementDemo', titleKey: 'demo.common.placement', component: PlacementDemo, source: placementDemoSource },
  { id: 'AsyncDemo', titleKey: 'demo.popconfirm.async', component: AsyncDemo, source: asyncDemoSource },
  {
    id: 'NestedOverlayDemo',
    titleKey: 'demo.popconfirm.nestedOverlay',
    component: NestedOverlayDemo,
    source: nestedOverlayDemoSource,
  },
]

export const apiComponents = ['Popconfirm']
