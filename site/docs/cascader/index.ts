import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicSource from './BasicDemo.vue?raw'
import AnyLevelDemo from './AnyLevelDemo.vue'
import anyLevelSource from './AnyLevelDemo.vue?raw'
import StatesDemo from './StatesDemo.vue'
import statesSource from './StatesDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicSource },
  { id: 'AnyLevelDemo', titleKey: 'demo.cascader.anyLevel', component: AnyLevelDemo, source: anyLevelSource },
  { id: 'StatesDemo', titleKey: 'demo.cascader.states', component: StatesDemo, source: statesSource }
]
export const apiComponents = ['Cascader']
