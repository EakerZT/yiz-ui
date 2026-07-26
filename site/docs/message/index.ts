import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import TypesDemo from './TypesDemo.vue'
import typesDemoSource from './TypesDemo.vue?raw'
import LoadingDemo from './LoadingDemo.vue'
import loadingDemoSource from './LoadingDemo.vue?raw'
import CustomContentDemo from './CustomContentDemo.vue'
import customContentDemoSource from './CustomContentDemo.vue?raw'
import CloseEventDemo from './CloseEventDemo.vue'
import closeEventDemoSource from './CloseEventDemo.vue?raw'
import CloseDemo from './CloseDemo.vue'
import closeDemoSource from './CloseDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'TypesDemo', titleKey: 'demo.message.types', component: TypesDemo, source: typesDemoSource },
  { id: 'LoadingDemo', titleKey: 'demo.message.loading', component: LoadingDemo, source: loadingDemoSource },
  {
    id: 'CustomContentDemo',
    titleKey: 'demo.common.customContent',
    component: CustomContentDemo,
    source: customContentDemoSource,
  },
  { id: 'CloseEventDemo', titleKey: 'demo.dialog.closeEvent', component: CloseEventDemo, source: closeEventDemoSource },
  { id: 'CloseDemo', titleKey: 'demo.common.close', component: CloseDemo, source: closeDemoSource },
]

export const apiComponents = ['message']
