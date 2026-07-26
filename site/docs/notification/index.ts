import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import TypesDemo from './TypesDemo.vue'
import typesDemoSource from './TypesDemo.vue?raw'
import PositionsDemo from './PositionsDemo.vue'
import positionsDemoSource from './PositionsDemo.vue?raw'
import StackDemo from './StackDemo.vue'
import stackDemoSource from './StackDemo.vue?raw'
import NoAutoCloseDemo from './NoAutoCloseDemo.vue'
import noAutoCloseDemoSource from './NoAutoCloseDemo.vue?raw'
import CustomContentDemo from './CustomContentDemo.vue'
import customContentDemoSource from './CustomContentDemo.vue?raw'
import CloseEventDemo from './CloseEventDemo.vue'
import closeEventDemoSource from './CloseEventDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'TypesDemo', titleKey: 'demo.notification.types', component: TypesDemo, source: typesDemoSource },
  {
    id: 'PositionsDemo',
    titleKey: 'demo.notification.positions',
    component: PositionsDemo,
    source: positionsDemoSource,
  },
  { id: 'StackDemo', titleKey: 'demo.notification.stack', component: StackDemo, source: stackDemoSource },
  {
    id: 'NoAutoCloseDemo',
    titleKey: 'demo.notification.noAutoClose',
    component: NoAutoCloseDemo,
    source: noAutoCloseDemoSource,
  },
  {
    id: 'CustomContentDemo',
    titleKey: 'demo.common.customContent',
    component: CustomContentDemo,
    source: customContentDemoSource,
  },
  { id: 'CloseEventDemo', titleKey: 'demo.dialog.closeEvent', component: CloseEventDemo, source: closeEventDemoSource },
]

export const apiComponents = ['notification']
