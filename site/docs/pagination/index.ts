import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import TotalAndSizeDemo from './TotalAndSizeDemo.vue'
import totalAndSizeDemoSource from './TotalAndSizeDemo.vue?raw'
import QuickJumperDemo from './QuickJumperDemo.vue'
import quickJumperDemoSource from './QuickJumperDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import SimpleDemo from './SimpleDemo.vue'
import simpleDemoSource from './SimpleDemo.vue?raw'
import DisabledDemo from './DisabledDemo.vue'
import disabledDemoSource from './DisabledDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  {
    id: 'TotalAndSizeDemo',
    titleKey: 'demo.pagination.totalAndSize',
    component: TotalAndSizeDemo,
    source: totalAndSizeDemoSource,
  },
  {
    id: 'QuickJumperDemo',
    titleKey: 'demo.pagination.quickJumper',
    component: QuickJumperDemo,
    source: quickJumperDemoSource,
  },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  { id: 'SimpleDemo', titleKey: 'demo.pagination.simple', component: SimpleDemo, source: simpleDemoSource },
  { id: 'DisabledDemo', titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledDemoSource },
]

export const apiComponents = ['Pagination']
