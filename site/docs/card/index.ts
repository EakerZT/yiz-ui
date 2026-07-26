import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import BorderDemo from './BorderDemo.vue'
import borderDemoSource from './BorderDemo.vue?raw'
import ShadowDemo from './ShadowDemo.vue'
import shadowDemoSource from './ShadowDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import ExtraHeaderDemo from './ExtraHeaderDemo.vue'
import extraHeaderDemoSource from './ExtraHeaderDemo.vue?raw'
import CoverDemo from './CoverDemo.vue'
import coverDemoSource from './CoverDemo.vue?raw'
import CustomTitleDemo from './CustomTitleDemo.vue'
import customTitleDemoSource from './CustomTitleDemo.vue?raw'
import FooterActionsDemo from './FooterActionsDemo.vue'
import footerActionsDemoSource from './FooterActionsDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'BorderDemo', titleKey: 'demo.card.border', component: BorderDemo, source: borderDemoSource },
  { id: 'ShadowDemo', titleKey: 'demo.card.shadow', component: ShadowDemo, source: shadowDemoSource },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  {
    id: 'ExtraHeaderDemo',
    titleKey: 'demo.card.extraHeader',
    component: ExtraHeaderDemo,
    source: extraHeaderDemoSource,
  },
  { id: 'CoverDemo', titleKey: 'demo.card.cover', component: CoverDemo, source: coverDemoSource },
  {
    id: 'CustomTitleDemo',
    titleKey: 'demo.common.customTitle',
    component: CustomTitleDemo,
    source: customTitleDemoSource,
  },
  {
    id: 'FooterActionsDemo',
    titleKey: 'demo.card.footerActions',
    component: FooterActionsDemo,
    source: footerActionsDemoSource,
  },
]

export const apiComponents = ['Card']
