<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.loadingBar.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.loadingBar.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <y-button-group>
        <y-button type="primary" @click="onStart">{{ $t('demo.loadingBar.start') }}</y-button>
        <y-button @click="onDone">{{ $t('demo.loadingBar.done') }}</y-button>
        <y-button color="error" @click="onFail">{{ $t('demo.loadingBar.fail') }}</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.loadingBar.set40')" style="margin-top: 8px">
      <y-button-group>
        <y-button @click="onSet40">{{ $t('demo.loadingBar.set40') }}</y-button>
        <y-button @click="onInc">{{ $t('demo.loadingBar.inc') }}</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.loadingBar.pauseResume')" style="margin-top: 8px">
      <y-button-group>
        <y-button type="primary" @click="onStart">{{ $t('demo.loadingBar.start') }}</y-button>
        <y-button @click="onPause">{{ $t('demo.common.loading') }}</y-button>
        <y-button @click="onResume">{{ $t('demo.loadingBar.resume') }}</y-button>
        <y-button @click="onDone">{{ $t('demo.loadingBar.done') }}</y-button>
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.loadingBar.indeterminate')" style="margin-top: 8px">
      <y-button @click="onIndeterminate">{{ $t('demo.loadingBar.indeterminate') }}</y-button>
    </y-card>

    <y-card :title="$t('demo.loadingBar.customColor')" style="margin-top: 8px">
      <y-button-group>
        <y-button @click="onCustomColor('#52c41a')">{{ $t('demo.common.success') }}</y-button>
        <y-button @click="onCustomColor('#faad14')">{{ $t('demo.common.warning') }}</y-button>
        <y-button @click="onCustomColor('#ff4d4f')">{{ $t('demo.common.error') }}</y-button>
        <y-button @click="onReset">{{ $t('demo.loadingBar.reset') }}</y-button>
      </y-button-group>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { loadingBar, $t } from 'yiz-ui'

function onStart() {
  loadingBar.start()
}

function onDone() {
  loadingBar.done()
}

function onFail() {
  loadingBar.start()
  setTimeout(() => loadingBar.fail(), 800)
}

function onSet40() {
  loadingBar.set(0.4)
}

function onInc() {
  loadingBar.inc()
}

function onPause() {
  loadingBar.pause()
}

function onResume() {
  loadingBar.resume()
}

function onIndeterminate() {
  loadingBar.configure({ indeterminate: true })
  loadingBar.start()
  setTimeout(() => {
    loadingBar.done()
    loadingBar.configure({ indeterminate: false })
  }, 2500)
}

function onCustomColor(color: string) {
  loadingBar.configure({ color })
  loadingBar.start()
  setTimeout(() => loadingBar.done(), 1500)
}

function onReset() {
  loadingBar.reset()
}
</script>
