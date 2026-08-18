import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import PlacementDemo from './PlacementDemo.vue'
import placementDemoSource from './PlacementDemo.vue?raw'
import NoMaskDemo from './NoMaskDemo.vue'
import noMaskDemoSource from './NoMaskDemo.vue?raw'
import MaskClosableDemo from './MaskClosableDemo.vue'
import maskClosableDemoSource from './MaskClosableDemo.vue?raw'
import HideCloseButtonDemo from './HideCloseButtonDemo.vue'
import hideCloseButtonDemoSource from './HideCloseButtonDemo.vue?raw'
import ClosePlacementDemo from './ClosePlacementDemo.vue'
import closePlacementDemoSource from './ClosePlacementDemo.vue?raw'
import CustomWidthHeightDemo from './CustomWidthHeightDemo.vue'
import customWidthHeightDemoSource from './CustomWidthHeightDemo.vue?raw'
import ResizeDemo from './ResizeDemo.vue'
import resizeDemoSource from './ResizeDemo.vue?raw'
import FooterDemo from './FooterDemo.vue'
import footerDemoSource from './FooterDemo.vue?raw'
import CustomTitleDemo from './CustomTitleDemo.vue'
import customTitleDemoSource from './CustomTitleDemo.vue?raw'
import SecondLevelDemo from './SecondLevelDemo.vue'
import secondLevelDemoSource from './SecondLevelDemo.vue?raw'
import CloseEventDemo from './CloseEventDemo.vue'
import closeEventDemoSource from './CloseEventDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'PlacementDemo', titleKey: 'demo.common.placement', component: PlacementDemo, source: placementDemoSource },
  { id: 'NoMaskDemo', titleKey: 'demo.common.noMask', component: NoMaskDemo, source: noMaskDemoSource },
  {
    id: 'MaskClosableDemo',
    titleKey: 'demo.common.maskClosable',
    component: MaskClosableDemo,
    source: maskClosableDemoSource,
  },
  {
    id: 'HideCloseButtonDemo',
    titleKey: 'demo.common.hideCloseButton',
    component: HideCloseButtonDemo,
    source: hideCloseButtonDemoSource,
  },
  {
    id: 'ClosePlacementDemo',
    titleKey: 'demo.drawer.closePlacement',
    component: ClosePlacementDemo,
    source: closePlacementDemoSource,
  },
  {
    id: 'CustomWidthHeightDemo',
    titleKey: 'demo.common.customWidthHeight',
    component: CustomWidthHeightDemo,
    source: customWidthHeightDemoSource,
  },
  { id: 'ResizeDemo', titleKey: 'demo.common.resize', component: ResizeDemo, source: resizeDemoSource },
  { id: 'FooterDemo', titleKey: 'demo.common.footer', component: FooterDemo, source: footerDemoSource },
  {
    id: 'CustomTitleDemo',
    titleKey: 'demo.common.customTitle',
    component: CustomTitleDemo,
    source: customTitleDemoSource,
  },
  {
    id: 'SecondLevelDemo',
    titleKey: 'demo.drawer.secondLevel',
    component: SecondLevelDemo,
    source: secondLevelDemoSource,
  },
  { id: 'CloseEventDemo', titleKey: 'demo.dialog.closeEvent', component: CloseEventDemo, source: closeEventDemoSource },
]

export const apiComponents = ['Drawer']
