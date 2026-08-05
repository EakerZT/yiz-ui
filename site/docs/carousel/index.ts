import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import ControlDemo from './ControlDemo.vue'
import controlDemoSource from './ControlDemo.vue?raw'
import VerticalDemo from './VerticalDemo.vue'
import verticalDemoSource from './VerticalDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'ControlDemo', titleKey: 'demo.carousel.control', component: ControlDemo, source: controlDemoSource },
  { id: 'VerticalDemo', titleKey: 'demo.carousel.dotPosition', component: VerticalDemo, source: verticalDemoSource },
]

export const apiComponents = ['Carousel', 'CarouselItem']
