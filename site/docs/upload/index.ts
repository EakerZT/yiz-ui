import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import MultipleImageDemo from './MultipleImageDemo.vue'
import multipleImageDemoSource from './MultipleImageDemo.vue?raw'
import DragDemo from './DragDemo.vue'
import dragDemoSource from './DragDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  {
    id: 'MultipleImageDemo',
    titleKey: 'demo.upload.multipleImage',
    component: MultipleImageDemo,
    source: multipleImageDemoSource,
  },
  { id: 'DragDemo', titleKey: 'demo.common.drag', component: DragDemo, source: dragDemoSource },
]

export const apiComponents = ['Upload']
