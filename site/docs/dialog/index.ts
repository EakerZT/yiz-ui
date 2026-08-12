import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicSource from './BasicDemo.vue?raw'
import CloseButtonDemo from './CloseButtonDemo.vue'
import closeButtonSource from './CloseButtonDemo.vue?raw'
import ConfirmDemo from './ConfirmDemo.vue'
import confirmSource from './ConfirmDemo.vue?raw'
import CustomTitleDemo from './CustomTitleDemo.vue'
import customTitleSource from './CustomTitleDemo.vue?raw'
import DragDemo from './DragDemo.vue'
import dragSource from './DragDemo.vue?raw'
import EventDemo from './EventDemo.vue'
import eventSource from './EventDemo.vue?raw'
import FooterDemo from './FooterDemo.vue'
import footerSource from './FooterDemo.vue?raw'
import HeightDemo from './HeightDemo.vue'
import heightSource from './HeightDemo.vue?raw'
import MaskClosableDemo from './MaskClosableDemo.vue'
import maskClosableSource from './MaskClosableDemo.vue?raw'
import NoMaskDemo from './NoMaskDemo.vue'
import noMaskSource from './NoMaskDemo.vue?raw'
import WidthDemo from './WidthDemo.vue'
import widthSource from './WidthDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicSource },
  { id: 'DragDemo', titleKey: 'demo.common.drag', component: DragDemo, source: dragSource },
  { id: 'WidthDemo', titleKey: 'demo.common.customWidth', component: WidthDemo, source: widthSource },
  { id: 'HeightDemo', titleKey: 'demo.dialog.customHeight', component: HeightDemo, source: heightSource },
  { id: 'NoMaskDemo', titleKey: 'demo.common.noMask', component: NoMaskDemo, source: noMaskSource },
  {
    id: 'MaskClosableDemo',
    titleKey: 'demo.common.maskClosable',
    component: MaskClosableDemo,
    source: maskClosableSource,
  },
  {
    id: 'CloseButtonDemo',
    titleKey: 'demo.common.hideCloseButton',
    component: CloseButtonDemo,
    source: closeButtonSource,
  },
  { id: 'FooterDemo', titleKey: 'demo.common.footer', component: FooterDemo, source: footerSource },
  { id: 'ConfirmDemo', titleKey: 'demo.dialog.confirm', component: ConfirmDemo, source: confirmSource },
  { id: 'CustomTitleDemo', titleKey: 'demo.common.customTitle', component: CustomTitleDemo, source: customTitleSource },
  { id: 'EventDemo', titleKey: 'demo.dialog.closeEvent', component: EventDemo, source: eventSource },
]

export const apiComponents = ['Dialog', 'useDialog']
