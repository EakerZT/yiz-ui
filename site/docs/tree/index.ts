import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import SelectableDemo from './SelectableDemo.vue'
import selectableDemoSource from './SelectableDemo.vue?raw'
import CheckableDemo from './CheckableDemo.vue'
import checkableDemoSource from './CheckableDemo.vue?raw'
import BeforeAfterSlotsDemo from './BeforeAfterSlotsDemo.vue'
import beforeAfterSlotsDemoSource from './BeforeAfterSlotsDemo.vue?raw'
import ControlledExpandDemo from './ControlledExpandDemo.vue'
import controlledExpandDemoSource from './ControlledExpandDemo.vue?raw'
import DisabledNodeDemo from './DisabledNodeDemo.vue'
import disabledNodeDemoSource from './DisabledNodeDemo.vue?raw'
import EmptyStateDemo from './EmptyStateDemo.vue'
import emptyStateDemoSource from './EmptyStateDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'SelectableDemo', titleKey: 'demo.tree.selectable', component: SelectableDemo, source: selectableDemoSource },
  { id: 'CheckableDemo', titleKey: 'demo.tree.checkable', component: CheckableDemo, source: checkableDemoSource },
  {
    id: 'BeforeAfterSlotsDemo',
    titleKey: 'demo.tree.beforeAfterSlots',
    component: BeforeAfterSlotsDemo,
    source: beforeAfterSlotsDemoSource,
  },
  {
    id: 'ControlledExpandDemo',
    titleKey: 'demo.tree.controlledExpand',
    component: ControlledExpandDemo,
    source: controlledExpandDemoSource,
  },
  {
    id: 'DisabledNodeDemo',
    titleKey: 'demo.tree.disabledNode',
    component: DisabledNodeDemo,
    source: disabledNodeDemoSource,
  },
  { id: 'EmptyStateDemo', titleKey: 'demo.tree.emptyState', component: EmptyStateDemo, source: emptyStateDemoSource },
]

export const apiComponents = ['Tree']
