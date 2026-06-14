<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.tab') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.tab.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <y-tab v-model:active="tab1">
        <y-tab-pane :label="$t('demo.tab.tab1')" value="a">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab1Content') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab2')" value="b">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab2Content') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab3')" value="c">
          <p style="padding: 12px 0">{{ $t('demo.tab.tab3Content') }}</p>
        </y-tab-pane>
      </y-tab>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-tab v-model:active="tab2">
        <y-tab-pane :label="$t('demo.tab.tab1')" value="a">
          <p style="padding: 12px 0">{{ $t('demo.tab.content1') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab2Disabled')" value="b" disabled>
          <p style="padding: 12px 0">{{ $t('demo.tab.content2') }}</p>
        </y-tab-pane>
        <y-tab-pane :label="$t('demo.tab.tab3')" value="c">
          <p style="padding: 12px 0">{{ $t('demo.tab.content3') }}</p>
        </y-tab-pane>
      </y-tab>
    </y-card>

    <y-card :title="$t('demo.tab.moreTabs')" style="margin-top: 8px">
      <y-tab v-model:active="tab3">
        <y-tab-pane v-for="i in 6" :key="i" :label="$t('demo.tab.tabN', { index: i })" :value="i">
          <p style="padding: 12px 0">{{ $t('demo.tab.tabNContent', { index: i }) }}</p>
        </y-tab-pane>
      </y-tab>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

const tab1 = ref('a')
const tab2 = ref('a')
const tab3 = ref(1)
</script>
