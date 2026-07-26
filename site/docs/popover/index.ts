import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import PlacementDemo from './PlacementDemo.vue'
import placementDemoSource from './PlacementDemo.vue?raw'
import TriggerDemo from './TriggerDemo.vue'
import triggerDemoSource from './TriggerDemo.vue?raw'
import CustomContentDemo from './CustomContentDemo.vue'
import customContentDemoSource from './CustomContentDemo.vue?raw'
import NestedOverlayDemo from './NestedOverlayDemo.vue'
import nestedOverlayDemoSource from './NestedOverlayDemo.vue?raw'
import ControlledDemo from './ControlledDemo.vue'
import controlledDemoSource from './ControlledDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'PlacementDemo', titleKey: 'demo.common.placement', component: PlacementDemo, source: placementDemoSource },
  { id: 'TriggerDemo', titleKey: 'demo.popover.trigger', component: TriggerDemo, source: triggerDemoSource },
  {
    id: 'CustomContentDemo',
    titleKey: 'demo.common.customContent',
    component: CustomContentDemo,
    source: customContentDemoSource,
  },
  {
    id: 'NestedOverlayDemo',
    titleKey: 'demo.popover.nestedOverlay',
    component: NestedOverlayDemo,
    source: nestedOverlayDemoSource,
  },
  { id: 'ControlledDemo', titleKey: 'demo.common.controlled', component: ControlledDemo, source: controlledDemoSource },
]

export const apiComponents = ['Popover']
