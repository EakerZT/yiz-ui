<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.drawer') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.drawer.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <y-button type="primary" @click="visible1 = true">{{ $t('demo.drawer.openDrawer') }}</y-button>
    </y-card>

    <y-card :title="$t('demo.common.placement')" style="margin-top: 8px">
      <y-button-group>
        <y-button @click="openDrawer('left')">Left</y-button>
        <y-button @click="openDrawer('right')">Right</y-button>
        <y-button @click="openDrawer('top')">{{ $t('demo.drawer.top') }}</y-button>
        <y-button @click="openDrawer('bottom')">{{ $t('demo.drawer.bottom') }}</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.noMask')" style="margin-top: 8px">
      <y-button @click="visible3 = true">{{ $t('demo.common.noMask') }}</y-button>
    </y-card>

    <y-card :title="$t('demo.common.maskClosable')" style="margin-top: 8px">
      <y-button @click="visible4 = true">{{ $t('demo.common.maskClosable') }}</y-button>
    </y-card>

    <y-card :title="$t('demo.common.hideCloseButton')" style="margin-top: 8px">
      <y-button @click="visible5 = true">{{ $t('demo.common.hideCloseButton') }}</y-button>
    </y-card>

    <y-card :title="$t('demo.common.customWidthHeight')" style="margin-top: 8px">
      <y-button-group>
        <y-button @click="visible6 = true">width="500px"</y-button>
        <y-button @click="visible7 = true">height="300px"</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.resize')" style="margin-top: 8px">
      <y-button-group>
        <y-button @click="visible11 = true">{{ $t('demo.drawer.horizontalResize') }}</y-button>
        <y-button @click="visible12 = true">{{ $t('demo.drawer.verticalResize') }}</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.footer')" style="margin-top: 8px">
      <y-button-group>
        <y-button type="primary" @click="visible8 = true">{{ $t('demo.drawer.customFooter') }}</y-button>
        <y-button @click="visible15 = true">{{ $t('demo.drawer.disabledFooter') }}</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.customTitle')" style="margin-top: 8px">
      <y-button @click="visible9 = true">{{ $t('demo.common.customTitle') }}</y-button>
    </y-card>

    <y-card :title="$t('demo.drawer.secondLevel')" style="margin-top: 8px">
      <y-button @click="visible13 = true">{{ $t('demo.drawer.secondLevel') }}</y-button>
    </y-card>

    <y-card :title="$t('demo.dialog.closeEvent')" style="margin-top: 8px">
      <y-button @click="visible10 = true">{{ $t('demo.common.open') }}</y-button>
      <span v-if="closeCount > 0 || okCount > 0" class="demo-hint">
        {{ $t('demo.drawer.footerEventCount', { close: closeCount, ok: okCount }) }}
      </span>
    </y-card>

    <!-- Drawers -->
    <y-drawer v-model="visible1" :title="$t('demo.drawer.basicDrawer')">
      <p>{{ $t('demo.drawer.basicContent') }}</p>
    </y-drawer>

    <y-drawer v-model="visible2" :title="$t('demo.drawer.placementLabel', { placement })" :placement="placement">
      <p>{{ $t('demo.drawer.placementHint', { placement }) }}</p>
    </y-drawer>

    <y-drawer v-model="visible3" :title="$t('demo.common.noMask')" :mask="false">
      <p>{{ $t('demo.drawer.noMaskHint') }}</p>
    </y-drawer>

    <y-drawer v-model="visible4" :title="$t('demo.common.maskClosable')" :mask-closable="true">
      <p>{{ $t('demo.drawer.maskClosableHint') }}</p>
    </y-drawer>

    <y-drawer v-model="visible5" :title="$t('demo.common.noCloseButton')" :closable="false">
      <p>{{ $t('demo.drawer.noCloseHint') }}</p>
    </y-drawer>

    <y-drawer v-model="visible6" :title="$t('demo.common.customWidth')" width="500px" placement="right">
      <p>{{ $t('demo.drawer.customWidthHint') }}</p>
    </y-drawer>

    <y-drawer v-model="visible7" :title="$t('demo.drawer.customHeight')" height="300px" placement="bottom">
      <p>{{ $t('demo.drawer.customHeightHint') }}</p>
    </y-drawer>

    <y-drawer v-model="visible11" :title="$t('demo.drawer.horizontalResizeHint')" :resize="true" resize-min="200px" resize-max="80%">
      <p>{{ $t('demo.drawer.horizontalResizeConstraint') }}</p>
    </y-drawer>

    <y-drawer v-model="visible12" :title="$t('demo.drawer.verticalResizeHint')" placement="bottom" :resize="true" resize-min="150px" resize-max="60%">
      <p>{{ $t('demo.drawer.verticalResizeConstraint') }}</p>
    </y-drawer>

    <y-drawer v-model="visible8" :title="$t('demo.common.withFooter')">
      <p>{{ $t('demo.drawer.bodyContent') }}</p>
      <p style="margin-top: 12px; color: #888">{{ $t('demo.drawer.bodyContentHint') }}</p>
      <template #footer>
        <div style="display: flex; gap: 12px; justify-content: flex-end">
          <y-button @click="visible8 = false">{{ $t('demo.common.cancel') }}</y-button>
          <y-button type="primary" @click="visible8 = false">{{ $t('demo.common.confirm') }}</y-button>
        </div>
      </template>
    </y-drawer>

    <y-drawer v-model="visible15" :title="$t('demo.drawer.disabledFooter')" disabled-footer>
      <p>{{ $t('demo.drawer.disabledFooterHint') }}</p>
    </y-drawer>

    <y-drawer v-model="visible9">
      <template #title>
        <span style="color: var(--yiz-color-primary)">{{ $t('demo.common.customTitleColor') }}</span>
      </template>
      <p>{{ $t('demo.dialog.customTitleHint') }}</p>
    </y-drawer>

    <y-drawer v-model="visible13" :title="$t('demo.drawer.firstLevel')" width="500px">
      <p>{{ $t('demo.drawer.firstLevelContent') }}</p>
      <div style="margin-top: 16px">
        <y-button type="primary" @click="visible14 = true">{{ $t('demo.drawer.openSecondLevel') }}</y-button>
      </div>
      <y-drawer v-model="visible14" :title="$t('demo.drawer.secondLevel')" width="360px">
        <p>{{ $t('demo.drawer.secondLevelContent') }}</p>
        <p style="margin-top: 8px; color: #888">{{ $t('demo.drawer.secondLevelMaskHint') }}</p>
      </y-drawer>
    </y-drawer>

    <y-drawer v-model="visible10" :title="$t('demo.dialog.closeEvent')" @close="closeCount++" @ok="okCount++">
      <p>{{ $t('demo.dialog.closeEventHint') }}</p>
    </y-drawer>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

const visible1 = ref(false)
const visible2 = ref(false)
const visible3 = ref(false)
const visible4 = ref(false)
const visible5 = ref(false)
const visible6 = ref(false)
const visible7 = ref(false)
const visible8 = ref(false)
const visible9 = ref(false)
const visible10 = ref(false)
const visible11 = ref(false)
const visible12 = ref(false)
const visible13 = ref(false)
const visible14 = ref(false)
const visible15 = ref(false)

const placement = ref<'left' | 'right' | 'top' | 'bottom'>('right')
const closeCount = ref(0)
const okCount = ref(0)

function openDrawer(p: 'left' | 'right' | 'top' | 'bottom') {
  placement.value = p
  visible2.value = true
}
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
