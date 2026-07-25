<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.notification') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.notification.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basic')" style="margin-top: 8px">
      <y-button type="primary" @click="openBasic">{{ $t('demo.notification.open') }}</y-button>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.notification.types')" style="margin-top: 8px">
      <y-button-group>
        <y-button @click="openInfo">info</y-button>
        <y-button color="success" @click="openSuccess">success</y-button>
        <y-button color="warning" @click="openWarning">warning</y-button>
        <y-button color="error" @click="openError">error</y-button>
      </y-button-group>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.notification.positions')" style="margin-top: 8px">
      <y-button-group>
        <y-button @click="openTopLeft">top-left</y-button>
        <y-button @click="openTopRight">top-right</y-button>
        <y-button @click="openBottomLeft">bottom-left</y-button>
        <y-button @click="openBottomRight">bottom-right</y-button>
      </y-button-group>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.notification.stack')" style="margin-top: 8px">
      <y-button @click="openMultiple">{{ $t('demo.notification.stackOpen') }}</y-button>
    </demo-card>

    <demo-card :source-index="4" :title="$t('demo.notification.noAutoClose')" style="margin-top: 8px">
      <y-button @click="openManual">{{ $t('demo.notification.needManualClose') }}</y-button>
    </demo-card>

    <demo-card :source-index="5" :title="$t('demo.common.customContent')" style="margin-top: 8px">
      <y-button @click="openCustom">{{ $t('demo.notification.openCustom') }}</y-button>
    </demo-card>

    <demo-card :source-index="6" :title="$t('demo.dialog.closeEvent')" style="margin-top: 8px">
      <y-button @click="openCloseEvent">{{ $t('demo.common.open') }}</y-button>
      <span class="demo-hint">{{ $t('demo.notification.closeCount', { count: closeCount }) }}</span>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { h, ref } from 'vue'
import { notification } from 'yiz-ui'

const closeCount = ref(0)

function openBasic() {
  notification({
    title: $t('demo.notification.systemNotification'),
    content: $t('demo.notification.basicMsg'),
  })
}

function openInfo() {
  notification.info({
    title: $t('demo.common.info'),
    content: $t('demo.notification.infoMsg'),
  })
}

function openSuccess() {
  notification.success({
    title: $t('demo.common.success'),
    content: $t('demo.notification.successMsg'),
  })
}

function openWarning() {
  notification.warning({
    title: $t('demo.common.warning'),
    content: $t('demo.notification.warningMsg'),
  })
}

function openError() {
  notification.error({
    title: $t('demo.common.error'),
    content: $t('demo.notification.errorMsg'),
  })
}

function openTopLeft() {
  notification({
    title: $t('demo.notification.topLeft'),
    content: $t('demo.notification.topLeftHint'),
    placement: 'top-left',
  })
}

function openTopRight() {
  notification({
    title: $t('demo.notification.topRight'),
    content: $t('demo.notification.topRightHint'),
    placement: 'top-right',
  })
}

function openBottomLeft() {
  notification({
    title: $t('demo.notification.bottomLeft'),
    content: $t('demo.notification.bottomLeftHint'),
    placement: 'bottom-left',
  })
}

function openBottomRight() {
  notification({
    title: $t('demo.notification.bottomRight'),
    content: $t('demo.notification.bottomRightHint'),
    placement: 'bottom-right',
  })
}

function openManual() {
  notification({
    title: $t('demo.notification.manualClose'),
    content: $t('demo.notification.manualCloseHint'),
    duration: 0,
  })
}

function openMultiple() {
  for (let i = 1; i <= 4; i++) {
    notification({
      title: $t('demo.notification.notifLabel', { index: i }),
      content: $t('demo.notification.notifMsg', { index: i }),
      type: i % 2 === 0 ? 'success' : 'info',
      duration: 5000,
    })
  }
}

function openCustom() {
  notification.success({
    title: h('span', { style: 'color: var(--yiz-color-success)' }, $t('demo.common.customTitle')),
    content: h('div', [
      $t('demo.notification.customTitleHint'),
      h('div', { style: 'margin-top: 8px; color: #999' }, $t('demo.notification.noAutoCloseHint')),
    ]),
    duration: 0,
  })
}

function openCloseEvent() {
  notification({
    title: $t('demo.dialog.closeEvent'),
    content: $t('demo.notification.closeEventHint'),
    onClose: () => {
      closeCount.value++
    },
  })
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
