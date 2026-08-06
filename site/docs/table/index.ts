import type { DemoDefinition } from '../types'
import BasicDemo from './BasicDemo.vue'
import basicDemoSource from './BasicDemo.vue?raw'
import RemoteSortDemo from './RemoteSortDemo.vue'
import remoteSortDemoSource from './RemoteSortDemo.vue?raw'
import BorderedStripeDemo from './BorderedStripeDemo.vue'
import borderedStripeDemoSource from './BorderedStripeDemo.vue?raw'
import MultiRowFooterDemo from './MultiRowFooterDemo.vue'
import multiRowFooterDemoSource from './MultiRowFooterDemo.vue?raw'
import SizeDemo from './SizeDemo.vue'
import sizeDemoSource from './SizeDemo.vue?raw'
import CustomColumnDemo from './CustomColumnDemo.vue'
import customColumnDemoSource from './CustomColumnDemo.vue?raw'
import FormatterDemo from './FormatterDemo.vue'
import formatterDemoSource from './FormatterDemo.vue?raw'
import LoadingDemo from './LoadingDemo.vue'
import loadingDemoSource from './LoadingDemo.vue?raw'
import CustomLoadingDemo from './CustomLoadingDemo.vue'
import customLoadingDemoSource from './CustomLoadingDemo.vue?raw'
import ColumnResizeDemo from './ColumnResizeDemo.vue'
import columnResizeDemoSource from './ColumnResizeDemo.vue?raw'
import EmptyDataDemo from './EmptyDataDemo.vue'
import emptyDataDemoSource from './EmptyDataDemo.vue?raw'
import ShowRowNumberDemo from './ShowRowNumberDemo.vue'
import showRowNumberDemoSource from './ShowRowNumberDemo.vue?raw'
import ResizeConstraintDemo from './ResizeConstraintDemo.vue'
import resizeConstraintDemoSource from './ResizeConstraintDemo.vue?raw'
import SingleSelectDemo from './SingleSelectDemo.vue'
import singleSelectDemoSource from './SingleSelectDemo.vue?raw'
import MultiSelectDemo from './MultiSelectDemo.vue'
import multiSelectDemoSource from './MultiSelectDemo.vue?raw'
import FixedColumnsDemo from './FixedColumnsDemo.vue'
import fixedColumnsDemoSource from './FixedColumnsDemo.vue?raw'
import FixedHeaderDemo from './FixedHeaderDemo.vue'
import fixedHeaderDemoSource from './FixedHeaderDemo.vue?raw'
import DisableRowsDemo from './DisableRowsDemo.vue'
import disableRowsDemoSource from './DisableRowsDemo.vue?raw'
import OverflowTooltipDemo from './OverflowTooltipDemo.vue'
import overflowTooltipDemoSource from './OverflowTooltipDemo.vue?raw'
import DynamicStyleDemo from './DynamicStyleDemo.vue'
import dynamicStyleDemoSource from './DynamicStyleDemo.vue?raw'

export const demos: DemoDefinition[] = [
  { id: 'BasicDemo', titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicDemoSource },
  { id: 'RemoteSortDemo', titleKey: 'demo.table.remoteSort', component: RemoteSortDemo, source: remoteSortDemoSource },
  {
    id: 'BorderedStripeDemo',
    titleKey: 'demo.table.borderedStripe',
    component: BorderedStripeDemo,
    source: borderedStripeDemoSource,
  },
  {
    id: 'DynamicStyleDemo',
    titleKey: 'demo.table.dynamicStyle',
    component: DynamicStyleDemo,
    source: dynamicStyleDemoSource,
  },
  {
    id: 'MultiRowFooterDemo',
    titleKey: 'demo.table.multiRowFooter',
    component: MultiRowFooterDemo,
    source: multiRowFooterDemoSource,
  },
  { id: 'SizeDemo', titleKey: 'demo.common.size', component: SizeDemo, source: sizeDemoSource },
  {
    id: 'CustomColumnDemo',
    titleKey: 'demo.table.customColumn',
    component: CustomColumnDemo,
    source: customColumnDemoSource,
  },
  { id: 'FormatterDemo', titleKey: 'demo.table.formatter', component: FormatterDemo, source: formatterDemoSource },
  { id: 'LoadingDemo', titleKey: 'demo.common.loading', component: LoadingDemo, source: loadingDemoSource },
  {
    id: 'CustomLoadingDemo',
    titleKey: 'demo.table.customLoading',
    component: CustomLoadingDemo,
    source: customLoadingDemoSource,
  },
  {
    id: 'ColumnResizeDemo',
    titleKey: 'demo.table.columnResize',
    component: ColumnResizeDemo,
    source: columnResizeDemoSource,
  },
  { id: 'EmptyDataDemo', titleKey: 'demo.table.emptyData', component: EmptyDataDemo, source: emptyDataDemoSource },
  {
    id: 'ShowRowNumberDemo',
    titleKey: 'demo.table.showRowNumber',
    component: ShowRowNumberDemo,
    source: showRowNumberDemoSource,
  },
  {
    id: 'ResizeConstraintDemo',
    titleKey: 'demo.table.resizeConstraint',
    component: ResizeConstraintDemo,
    source: resizeConstraintDemoSource,
  },
  {
    id: 'SingleSelectDemo',
    titleKey: 'demo.table.singleSelect',
    component: SingleSelectDemo,
    source: singleSelectDemoSource,
  },
  {
    id: 'MultiSelectDemo',
    titleKey: 'demo.table.multiSelect',
    component: MultiSelectDemo,
    source: multiSelectDemoSource,
  },
  {
    id: 'FixedColumnsDemo',
    titleKey: 'demo.table.fixedColumns',
    component: FixedColumnsDemo,
    source: fixedColumnsDemoSource,
  },
  {
    id: 'FixedHeaderDemo',
    titleKey: 'demo.table.fixedHeader',
    component: FixedHeaderDemo,
    source: fixedHeaderDemoSource,
  },
  {
    id: 'DisableRowsDemo',
    titleKey: 'demo.table.disableRows',
    component: DisableRowsDemo,
    source: disableRowsDemoSource,
  },
  {
    id: 'OverflowTooltipDemo',
    titleKey: 'demo.table.overflowTooltip',
    component: OverflowTooltipDemo,
    source: overflowTooltipDemoSource,
  },
]

export const apiComponents = ['Table', 'TableColumn']
