<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.dialog') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.dialog.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <y-button type="primary" @click="visible1 = true">{{ $t('demo.dialog.openDialog') }}</y-button>
    </y-card>

    <y-card :title="$t('demo.common.drag')" style="margin-top: 8px">
      <y-button @click="visible10 = true">{{ $t('demo.dialog.draggable') }}</y-button>
    </y-card>

    <y-card :title="$t('demo.common.customWidth')" style="margin-top: 8px">
      <y-button-group>
        <y-button @click="visible2 = true">width="600px"</y-button>
        <y-button @click="visible3 = true">width="300px"</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.noMask')" style="margin-top: 8px">
      <y-button @click="visible4 = true">{{ $t('demo.common.noMask') }}</y-button>
    </y-card>

    <y-card :title="$t('demo.common.maskClosable')" style="margin-top: 8px">
      <y-button @click="visible5 = true">{{ $t('demo.common.maskClosable') }}</y-button>
    </y-card>

    <y-card :title="$t('demo.common.hideCloseButton')" style="margin-top: 8px">
      <y-button @click="visible6 = true">{{ $t('demo.common.hideCloseButton') }}</y-button>
    </y-card>

    <y-card :title="$t('demo.common.footer')" style="margin-top: 8px">
      <y-button-group>
        <y-button type="primary" @click="visible7 = true">{{ $t('demo.dialog.customFooter') }}</y-button>
        <y-button @click="visible11 = true">{{ $t('demo.dialog.disabledFooter') }}</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.customTitle')" style="margin-top: 8px">
      <y-button @click="visible8 = true">{{ $t('demo.common.customTitle') }}</y-button>
    </y-card>

    <y-card :title="$t('demo.dialog.closeEvent')" style="margin-top: 8px">
      <y-button @click="visible9 = true">{{ $t('demo.common.open') }}</y-button>
      <span v-if="closeCount > 0 || okCount > 0" class="demo-hint">
        {{ $t('demo.dialog.footerEventCount', { close: closeCount, ok: okCount }) }}
      </span>
    </y-card>

    <!-- Dialogs -->
    <y-dialog v-model:show="visible1" :title="$t('demo.dialog.basicDialog')">
      <p>{{ $t('demo.dialog.basicContent') }}</p>
    </y-dialog>

    <y-dialog v-model:show="visible10" :title="$t('demo.dialog.dragTitle')" :drag="true">
      <p>{{ $t('demo.dialog.dragTitleHint') }}</p>
      <p style="margin-top: 8px; color: #888">{{ $t('demo.dialog.dragTitleHint2') }}</p>
    </y-dialog>

    <y-dialog v-model:show="visible2" :title="$t('demo.dialog.wideDialog')" width="600px">
      <p>{{ $t('demo.dialog.wideDialogHint') }}</p>
    </y-dialog>

    <y-dialog v-model:show="visible3" :title="$t('demo.dialog.narrowDialog')" width="300px">
      <p>{{ $t('demo.dialog.narrowDialogHint') }}</p>
    </y-dialog>

    <y-dialog v-model:show="visible4" :title="$t('demo.common.noMask')" :mask="false">
      <p>{{ $t('demo.dialog.noMaskHint') }}</p>
    </y-dialog>

    <y-dialog v-model:show="visible5" :title="$t('demo.common.maskClosable')" :mask-closable="true">
      <p>{{ $t('demo.dialog.maskClosableHint') }}</p>
    </y-dialog>

    <y-dialog v-model:show="visible6" :title="$t('demo.common.noCloseButton')" :closable="false" disabled-footer>
      <p>{{ $t('demo.dialog.noCloseHint') }}</p>
      <div style="margin-top: 16px">
        <y-button type="primary" @click="visible6 = false">{{ $t('demo.common.close') }}</y-button>
      </div>
    </y-dialog>

    <y-dialog v-model:show="visible11" :title="$t('demo.dialog.disabledFooter')" disabled-footer>
      <p>{{ $t('demo.dialog.disabledFooterHint') }}</p>
    </y-dialog>

    <y-dialog v-model:show="visible7" :title="$t('demo.card.confirmAction')">
      <p>{{ $t('demo.card.confirmMsg') }}</p>
      <template #footer>
        <div style="display: flex; gap: 12px; justify-content: flex-end">
          <y-button @click="visible7 = false">{{ $t('demo.common.cancel') }}</y-button>
          <y-button type="primary" @click="visible7 = false">{{ $t('demo.common.confirm') }}</y-button>
        </div>
      </template>
    </y-dialog>

    <y-dialog v-model:show="visible8">
      <template #title>
        <span style="color: var(--yiz-color-primary)">{{ $t('demo.common.customTitleColor') }}</span>
      </template>
      <p>{{ $t('demo.dialog.customTitleHint') }}</p>
    </y-dialog>

    <y-dialog v-model:show="visible9" :title="$t('demo.dialog.closeEvent')" @close="closeCount++" @ok="okCount++">
      <p>{{ $t('demo.dialog.closeEventHint') }}</p>
    </y-dialog>
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

const closeCount = ref(0)
const okCount = ref(0)
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
