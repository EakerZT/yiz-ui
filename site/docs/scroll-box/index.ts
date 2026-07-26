import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import MaxHeightDemo from './MaxHeightDemo.vue'
import maxHeightDemoSource from './MaxHeightDemo.vue?raw'
import HorizontalScrollDemo from './HorizontalScrollDemo.vue'
import horizontalScrollDemoSource from './HorizontalScrollDemo.vue?raw'
import EmbedCardDemo from './EmbedCardDemo.vue'
import embedCardDemoSource from './EmbedCardDemo.vue?raw'
import AutoHideNeverDemo from './AutoHideNeverDemo.vue'
import autoHideNeverDemoSource from './AutoHideNeverDemo.vue?raw'
import AutoHideScrollDemo from './AutoHideScrollDemo.vue'
import autoHideScrollDemoSource from './AutoHideScrollDemo.vue?raw'
import AutoHideMoveDemo from './AutoHideMoveDemo.vue'
import autoHideMoveDemoSource from './AutoHideMoveDemo.vue?raw'
import AutoHideLeaveDemo from './AutoHideLeaveDemo.vue'
import autoHideLeaveDemoSource from './AutoHideLeaveDemo.vue?raw'
import CustomThemeDemo from './CustomThemeDemo.vue'
import customThemeDemoSource from './CustomThemeDemo.vue?raw'
import DragResizeDemo from './DragResizeDemo.vue'
import dragResizeDemoSource from './DragResizeDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  { id: 'MaxHeightDemo', titleKey: 'demo.scrollBox.maxHeight', component: MaxHeightDemo, source: maxHeightDemoSource },
  {
    id: 'HorizontalScrollDemo',
    titleKey: 'demo.scrollBox.horizontalScroll',
    component: HorizontalScrollDemo,
    source: horizontalScrollDemoSource,
  },
  { id: 'EmbedCardDemo', titleKey: 'demo.scrollBox.embedCard', component: EmbedCardDemo, source: embedCardDemoSource },
  {
    id: 'AutoHideNeverDemo',
    titleKey: 'demo.scrollBox.autoHideNever',
    component: AutoHideNeverDemo,
    source: autoHideNeverDemoSource,
  },
  {
    id: 'AutoHideScrollDemo',
    titleKey: 'demo.scrollBox.autoHideScroll',
    component: AutoHideScrollDemo,
    source: autoHideScrollDemoSource,
  },
  {
    id: 'AutoHideMoveDemo',
    titleKey: 'demo.scrollBox.autoHideMove',
    component: AutoHideMoveDemo,
    source: autoHideMoveDemoSource,
  },
  {
    id: 'AutoHideLeaveDemo',
    titleKey: 'demo.scrollBox.autoHideLeave',
    component: AutoHideLeaveDemo,
    source: autoHideLeaveDemoSource,
  },
  {
    id: 'CustomThemeDemo',
    titleKey: 'demo.scrollBox.customTheme',
    component: CustomThemeDemo,
    source: customThemeDemoSource,
  },
  {
    id: 'DragResizeDemo',
    titleKey: 'demo.scrollBox.dragResize',
    component: DragResizeDemo,
    source: dragResizeDemoSource,
  },
]

export const apiComponents = ['ScrollBox']
