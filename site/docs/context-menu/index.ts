import type { DemoDefinition } from '../types'
import FnCallDemo from './FnCallDemo.vue'
import fnCallDemoSource from './FnCallDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'FnCallDemo', titleKey: 'demo.contextMenu.fnCall', component: FnCallDemo, source: fnCallDemoSource },
]

export const apiComponents = ['showContextMenu']
