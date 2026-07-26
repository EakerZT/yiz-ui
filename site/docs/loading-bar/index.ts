import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import Set40Demo from './Set40Demo.vue'
import set40DemoSource from './Set40Demo.vue?raw'
import PauseResumeDemo from './PauseResumeDemo.vue'
import pauseResumeDemoSource from './PauseResumeDemo.vue?raw'
import IndeterminateDemo from './IndeterminateDemo.vue'
import indeterminateDemoSource from './IndeterminateDemo.vue?raw'
import CustomColorDemo from './CustomColorDemo.vue'
import customColorDemoSource from './CustomColorDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'Set40Demo', titleKey: 'demo.loadingBar.set40', component: Set40Demo, source: set40DemoSource },
  {
    id: 'PauseResumeDemo',
    titleKey: 'demo.loadingBar.pauseResume',
    component: PauseResumeDemo,
    source: pauseResumeDemoSource,
  },
  {
    id: 'IndeterminateDemo',
    titleKey: 'demo.loadingBar.indeterminate',
    component: IndeterminateDemo,
    source: indeterminateDemoSource,
  },
  {
    id: 'CustomColorDemo',
    titleKey: 'demo.loadingBar.customColor',
    component: CustomColorDemo,
    source: customColorDemoSource,
  },
]

export const apiComponents = ['loadingBar']
