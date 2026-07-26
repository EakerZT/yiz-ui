<template>
  <y-tab v-model:active="tab2">
    <y-tab-pane :label="$t('demo.tab.tab1')" key="a">
      <p style="padding: 12px 0">{{ $t('demo.tab.content1') }}</p>
    </y-tab-pane>
    <y-tab-pane :label="$t('demo.tab.tab2Disabled')" key="b" disabled>
      <p style="padding: 12px 0">{{ $t('demo.tab.content2') }}</p>
    </y-tab-pane>
    <y-tab-pane :label="$t('demo.tab.tab3')" key="c">
      <p style="padding: 12px 0">{{ $t('demo.tab.content3') }}</p>
    </y-tab-pane>
  </y-tab>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const tab2 = ref('a')
</script>
