import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import DescriptionDemo from './DescriptionDemo.vue'
import descriptionDemoSource from './DescriptionDemo.vue?raw'
import ClosableDemo from './ClosableDemo.vue'
import closableDemoSource from './ClosableDemo.vue?raw'
import CustomContentDemo from './CustomContentDemo.vue'
import customContentDemoSource from './CustomContentDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  {
    id: 'DescriptionDemo',
    titleKey: 'demo.info.description',
    component: DescriptionDemo,
    source: descriptionDemoSource,
  },
  { id: 'ClosableDemo', titleKey: 'demo.info.closable', component: ClosableDemo, source: closableDemoSource },
  {
    id: 'CustomContentDemo',
    titleKey: 'demo.common.customContent',
    component: CustomContentDemo,
    source: customContentDemoSource,
  },
]

export const apiComponents = ['Info']
