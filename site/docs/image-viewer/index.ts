import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.imageViewer.basic', component: BasicDemo, source: basicDemoSource },
]

export const apiComponents = ['useImageViewer']
