<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.message') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.message.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basic')" style="margin-top: 8px">
      <y-button type="primary" @click="openBasic">{{ $t('demo.message.open') }}</y-button>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.message.types')" style="margin-top: 8px">
      <y-button-group>
        <y-button @click="openInfo">info</y-button>
        <y-button color="success" @click="openSuccess">success</y-button>
        <y-button color="warning" @click="openWarning">warning</y-button>
        <y-button color="error" @click="openError">error</y-button>
      </y-button-group>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.message.loading')" style="margin-top: 8px">
      <y-button @click="openLoading">{{ $t('demo.message.loadingButton') }}</y-button>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.common.customContent')" style="margin-top: 8px">
      <y-button @click="openCustom">{{ $t('demo.message.openCustom') }}</y-button>
    </demo-card>

    <demo-card :source-index="4" :title="$t('demo.dialog.closeEvent')" style="margin-top: 8px">
      <y-button @click="openCloseEvent">{{ $t('demo.common.open') }}</y-button>
      <span class="demo-hint">{{ $t('demo.message.closeCount', { count: closeCount }) }}</span>
    </demo-card>

    <demo-card :source-index="5" :title="$t('demo.common.close')" style="margin-top: 8px">
      <y-button @click="destroyAll">{{ $t('demo.message.destroyAll') }}</y-button>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t, message } from 'yiz-ui'
import { h, ref } from 'vue'

const closeCount = ref(0)

function openBasic() {
  message($t('demo.message.basicMsg'))
}

function openInfo() {
  message.info($t('demo.message.infoMsg'))
}

function openSuccess() {
  message.success($t('demo.message.successMsg'))
}

function openWarning() {
  message.warning($t('demo.message.warningMsg'))
}

function openError() {
  message.error($t('demo.message.errorMsg'))
}

function openLoading() {
  message.loading({
    key: 'message-demo-loading',
    content: $t('demo.message.loadingMsg'),
  })
  window.setTimeout(() => {
    message.success({
      key: 'message-demo-loading',
      content: $t('demo.message.loadedMsg'),
      duration: 2000,
    })
  }, 1200)
}

function openCustom() {
  message.open({
    type: 'success',
    content: h('span', [
      $t('demo.message.customPrefix'),
      h('strong', { style: 'margin-left: 4px; color: var(--yiz-color-success)' }, $t('demo.common.success')),
    ]),
  })
}

function openCloseEvent() {
  message.info($t('demo.message.closeEventHint'), 1500, () => {
    closeCount.value++
  })
}

function destroyAll() {
  message.destroy()
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
