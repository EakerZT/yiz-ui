<template>
  <ComponentDocPage
    title-key="demo.nav.button"
    description-key="demo.button.desc"
    :demos="demos"
    :api-components="['Button', 'ButtonGroup', 'LinkButton']"
  />
</template>

<script lang="ts" setup>
import ComponentDocPage from '../components/docs/ComponentDocPage.vue'
import type { DemoDefinition } from '../docs/types'
import BasicDemo from '../docs/button/BasicDemo.vue'
import basicSource from '../docs/button/BasicDemo.vue?raw'
import ClickDemo from '../docs/button/ClickDemo.vue'
import clickSource from '../docs/button/ClickDemo.vue?raw'
import ColorDemo from '../docs/button/ColorDemo.vue'
import colorSource from '../docs/button/ColorDemo.vue?raw'
import CustomColorDemo from '../docs/button/CustomColorDemo.vue'
import customColorSource from '../docs/button/CustomColorDemo.vue?raw'
import DisabledDemo from '../docs/button/DisabledDemo.vue'
import disabledSource from '../docs/button/DisabledDemo.vue?raw'
import IconDemo from '../docs/button/IconDemo.vue'
import iconSource from '../docs/button/IconDemo.vue?raw'
import LinkBasicDemo from '../docs/button/LinkBasicDemo.vue'
import linkBasicSource from '../docs/button/LinkBasicDemo.vue?raw'
import LinkClickDemo from '../docs/button/LinkClickDemo.vue'
import linkClickSource from '../docs/button/LinkClickDemo.vue?raw'
import LinkColorDemo from '../docs/button/LinkColorDemo.vue'
import linkColorSource from '../docs/button/LinkColorDemo.vue?raw'
import LinkDisabledDemo from '../docs/button/LinkDisabledDemo.vue'
import linkDisabledSource from '../docs/button/LinkDisabledDemo.vue?raw'
import LinkUnderlineDemo from '../docs/button/LinkUnderlineDemo.vue'
import linkUnderlineSource from '../docs/button/LinkUnderlineDemo.vue?raw'
import LoadingDemo from '../docs/button/LoadingDemo.vue'
import loadingSource from '../docs/button/LoadingDemo.vue?raw'
import ShapeDemo from '../docs/button/ShapeDemo.vue'
import shapeSource from '../docs/button/ShapeDemo.vue?raw'
import SizeDemo from '../docs/button/SizeDemo.vue'
import sizeSource from '../docs/button/SizeDemo.vue?raw'

const demos: DemoDefinition[] = [
  { titleKey: 'demo.common.basicShort', component: BasicDemo, source: basicSource },
  { titleKey: 'demo.button.color', component: ColorDemo, source: colorSource },
  { titleKey: 'demo.button.customColor', component: CustomColorDemo, source: customColorSource },
  { titleKey: 'demo.button.shape', component: ShapeDemo, source: shapeSource },
  { titleKey: 'demo.common.size', component: SizeDemo, source: sizeSource },
  { titleKey: 'demo.common.withIcon', component: IconDemo, source: iconSource },
  { titleKey: 'demo.common.disabled', component: DisabledDemo, source: disabledSource },
  { titleKey: 'demo.common.loading', component: LoadingDemo, source: loadingSource },
  { titleKey: 'demo.button.clickEvent', component: ClickDemo, source: clickSource },
  { titleKey: 'demo.button.link', component: LinkBasicDemo, source: linkBasicSource },
  { titleKey: 'demo.button.linkColor', component: LinkColorDemo, source: linkColorSource },
  { titleKey: 'demo.button.linkUnderline', component: LinkUnderlineDemo, source: linkUnderlineSource },
  { titleKey: 'demo.button.linkDisabled', component: LinkDisabledDemo, source: linkDisabledSource },
  { titleKey: 'demo.button.linkClick', component: LinkClickDemo, source: linkClickSource },
]
</script>
