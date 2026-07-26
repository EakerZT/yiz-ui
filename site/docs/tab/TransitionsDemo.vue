<template>
  <p style="font-size: 13px; color: #999; margin-bottom: 8px">{{ $t('demo.tab.fadeTransition') }}</p>
  <y-tab v-model:active="fadeTab" transition-type="fade">
    <y-tab-pane :label="$t('demo.tab.tab1')" key="a">
      <p style="padding: 12px 0">{{ $t('demo.tab.tab1Content') }}</p>
    </y-tab-pane>
    <y-tab-pane :label="$t('demo.tab.tab2')" key="b">
      <p style="padding: 12px 0">{{ $t('demo.tab.tab2Content') }}</p>
    </y-tab-pane>
    <y-tab-pane :label="$t('demo.tab.tab3')" key="c">
      <p style="padding: 12px 0">{{ $t('demo.tab.tab3Content') }}</p>
    </y-tab-pane>
  </y-tab>
  <p style="font-size: 13px; color: #999; margin-bottom: 8px; margin-top: 16px">
    {{ $t('demo.tab.slideTransition') }}
  </p>
  <y-tab v-model:active="slideTab" transition-type="slide">
    <y-tab-pane :label="$t('demo.tab.tab1')" key="a">
      <p style="padding: 12px 0">{{ $t('demo.tab.tab1Content') }}</p>
    </y-tab-pane>
    <y-tab-pane :label="$t('demo.tab.tab2')" key="b">
      <p style="padding: 12px 0">{{ $t('demo.tab.tab2Content') }}</p>
    </y-tab-pane>
    <y-tab-pane :label="$t('demo.tab.tab3')" key="c">
      <p style="padding: 12px 0">{{ $t('demo.tab.tab3Content') }}</p>
    </y-tab-pane>
  </y-tab>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const fadeTab = ref('a')

const slideTab = ref('a')
</script>
