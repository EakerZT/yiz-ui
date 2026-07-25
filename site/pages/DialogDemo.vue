<template>
  <ComponentDocPage
    title-key="demo.nav.dialog"
    description-key="demo.dialog.desc"
    :demos="demos"
    :api-components="['Dialog', 'Dialog.confirm']"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import type { DemoDefinition } from '../docs/types'
import BasicDemo from '../docs/dialog/BasicDemo.vue'
import basicSource from '../docs/dialog/BasicDemo.vue?raw'
import CloseButtonDemo from '../docs/dialog/CloseButtonDemo.vue'
import closeButtonSource from '../docs/dialog/CloseButtonDemo.vue?raw'
import ConfirmDemo from '../docs/dialog/ConfirmDemo.vue'
import confirmSource from '../docs/dialog/ConfirmDemo.vue?raw'
import CustomTitleDemo from '../docs/dialog/CustomTitleDemo.vue'
import customTitleSource from '../docs/dialog/CustomTitleDemo.vue?raw'
import DragDemo from '../docs/dialog/DragDemo.vue'
import dragSource from '../docs/dialog/DragDemo.vue?raw'
import EventDemo from '../docs/dialog/EventDemo.vue'
import eventSource from '../docs/dialog/EventDemo.vue?raw'
import FooterDemo from '../docs/dialog/FooterDemo.vue'
import footerSource from '../docs/dialog/FooterDemo.vue?raw'
import MaskClosableDemo from '../docs/dialog/MaskClosableDemo.vue'
import maskClosableSource from '../docs/dialog/MaskClosableDemo.vue?raw'
import NoMaskDemo from '../docs/dialog/NoMaskDemo.vue'
import noMaskSource from '../docs/dialog/NoMaskDemo.vue?raw'
import WidthDemo from '../docs/dialog/WidthDemo.vue'
import widthSource from '../docs/dialog/WidthDemo.vue?raw'

const demos: DemoDefinition[] = [
  { titleKey: 'demo.common.basic', component: BasicDemo, source: basicSource },
  { titleKey: 'demo.common.drag', component: DragDemo, source: dragSource },
  { titleKey: 'demo.common.customWidth', component: WidthDemo, source: widthSource },
  { titleKey: 'demo.common.noMask', component: NoMaskDemo, source: noMaskSource },
  { titleKey: 'demo.common.maskClosable', component: MaskClosableDemo, source: maskClosableSource },
  { titleKey: 'demo.common.hideCloseButton', component: CloseButtonDemo, source: closeButtonSource },
  { titleKey: 'demo.common.footer', component: FooterDemo, source: footerSource },
  { titleKey: 'demo.dialog.confirm', component: ConfirmDemo, source: confirmSource },
  { titleKey: 'demo.common.customTitle', component: CustomTitleDemo, source: customTitleSource },
  { titleKey: 'demo.dialog.closeEvent', component: EventDemo, source: eventSource },
]
</script>
