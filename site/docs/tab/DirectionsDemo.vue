<template>
  <div class="demo-tab-direction-control">
    <y-radio-button-group v-model:value="directionDemoDirection" size="small">
      <y-radio-button value="top">{{ t('demo.tab.directionTop') }}</y-radio-button>
      <y-radio-button value="bottom">{{ t('demo.tab.directionBottom') }}</y-radio-button>
      <y-radio-button value="left">{{ t('demo.tab.directionLeft') }}</y-radio-button>
      <y-radio-button value="right">{{ t('demo.tab.directionRight') }}</y-radio-button>
    </y-radio-button-group>
  </div>
  <div class="demo-tab-direction-preview">
    <y-tab v-model:active="directionDemoTab" :direction="directionDemoDirection">
      <y-tab-pane :label="t('demo.tab.tab1')" key="a">
        <p style="padding: 12px 0">{{ t('demo.tab.content1') }}</p>
      </y-tab-pane>
      <y-tab-pane :label="t('demo.tab.tab2')" key="b">
        <p style="padding: 12px 0">{{ t('demo.tab.content2') }}</p>
      </y-tab-pane>
      <y-tab-pane :label="t('demo.tab.tab3')" key="c">
        <p style="padding: 12px 0">{{ t('demo.tab.content3') }}</p>
      </y-tab-pane>
    </y-tab>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

type TabDirection = 'top' | 'bottom' | 'left' | 'right'

const directionDemoDirection = ref<TabDirection>('top')

const directionDemoTab = ref('a')
</script>

<style>
.demo-tab-direction-control {
  margin-bottom: 12px;
}
.demo-tab-direction-preview {
  min-height: 160px;
}
</style>
