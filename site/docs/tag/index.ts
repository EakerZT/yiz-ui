import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import ModeDemo from './ModeDemo.vue'
import modeDemoSource from './ModeDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import ClosableDemo from './ClosableDemo.vue'
import closableDemoSource from './ClosableDemo.vue?raw'
import CheckableDemo from './CheckableDemo.vue'
import checkableDemoSource from './CheckableDemo.vue?raw'
import CustomColorDemo from './CustomColorDemo.vue'
import customColorDemoSource from './CustomColorDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'ModeDemo', titleKey: 'demo.tag.mode', component: ModeDemo, source: modeDemoSource },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  { id: 'ClosableDemo', titleKey: 'demo.common.closable', component: ClosableDemo, source: closableDemoSource },
  { id: 'CheckableDemo', titleKey: 'demo.tag.checkable', component: CheckableDemo, source: checkableDemoSource },
  {
    id: 'CustomColorDemo',
    titleKey: 'demo.common.customColor',
    component: CustomColorDemo,
    source: customColorDemoSource,
  },
]

export const apiComponents = ['Tag']
