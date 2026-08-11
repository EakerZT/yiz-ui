import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import ThemeConfigDemo from './ThemeConfigDemo.vue'
import themeConfigDemoSource from './ThemeConfigDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.app.scope', component: BasicDemo, source: basicDemoSource },
  {
    id: 'ThemeConfigDemo',
    titleKey: 'demo.app.theme.allOptions',
    component: ThemeConfigDemo,
    source: themeConfigDemoSource,
  },
]

export const apiComponents = ['App']
