import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import DragClassTitleDemo from './DragClassTitleDemo.vue'
import dragClassTitleDemoSource from './DragClassTitleDemo.vue?raw'
import AnimationThresholdTitleDemo from './AnimationThresholdTitleDemo.vue'
import animationThresholdTitleDemoSource from './AnimationThresholdTitleDemo.vue?raw'
import HorizontalTitleDemo from './HorizontalTitleDemo.vue'
import horizontalTitleDemoSource from './HorizontalTitleDemo.vue?raw'
import SyncedPanelsTitleDemo from './SyncedPanelsTitleDemo.vue'
import syncedPanelsTitleDemoSource from './SyncedPanelsTitleDemo.vue?raw'
import NestedTitleDemo from './NestedTitleDemo.vue'
import nestedTitleDemoSource from './NestedTitleDemo.vue?raw'
import SourceTitleDemo from './SourceTitleDemo.vue'
import sourceTitleDemoSource from './SourceTitleDemo.vue?raw'
import GuardTitleDemo from './GuardTitleDemo.vue'
import guardTitleDemoSource from './GuardTitleDemo.vue?raw'
import AutoScrollTitleDemo from './AutoScrollTitleDemo.vue'
import autoScrollTitleDemoSource from './AutoScrollTitleDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basic', component: BasicDemo, source: basicDemoSource },
  {
    id: 'DragClassTitleDemo',
    titleKey: 'demo.sortableBox.dragClassTitle',
    component: DragClassTitleDemo,
    source: dragClassTitleDemoSource,
  },
  {
    id: 'AnimationThresholdTitleDemo',
    titleKey: 'demo.sortableBox.animationThresholdTitle',
    component: AnimationThresholdTitleDemo,
    source: animationThresholdTitleDemoSource,
  },
  {
    id: 'HorizontalTitleDemo',
    titleKey: 'demo.sortableBox.horizontalTitle',
    component: HorizontalTitleDemo,
    source: horizontalTitleDemoSource,
  },
  {
    id: 'SyncedPanelsTitleDemo',
    titleKey: 'demo.sortableBox.syncedPanelsTitle',
    component: SyncedPanelsTitleDemo,
    source: syncedPanelsTitleDemoSource,
  },
  {
    id: 'NestedTitleDemo',
    titleKey: 'demo.sortableBox.nestedTitle',
    component: NestedTitleDemo,
    source: nestedTitleDemoSource,
  },
  {
    id: 'SourceTitleDemo',
    titleKey: 'demo.sortableBox.sourceTitle',
    component: SourceTitleDemo,
    source: sourceTitleDemoSource,
  },
  {
    id: 'GuardTitleDemo',
    titleKey: 'demo.sortableBox.guardTitle',
    component: GuardTitleDemo,
    source: guardTitleDemoSource,
  },
  {
    id: 'AutoScrollTitleDemo',
    titleKey: 'demo.sortableBox.autoScrollTitle',
    component: AutoScrollTitleDemo,
    source: autoScrollTitleDemoSource,
  },
]

export const apiComponents = ['SortableBox']
