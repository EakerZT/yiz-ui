<template>
  <y-tab>
    <y-tab-pane :label="t('demo.tab.tab1')" key="a">
      <p style="padding: 12px 0">{{ t('demo.tab.tab1Content') }}</p>
    </y-tab-pane>
    <y-tab-pane :label="t('demo.tab.tab2')" key="b">
      <p style="padding: 12px 0">{{ t('demo.tab.tab2Content') }}</p>
    </y-tab-pane>
    <y-tab-pane :label="t('demo.tab.tab3')" key="c">
      <p style="padding: 12px 0">{{ t('demo.tab.tab3Content') }}</p>
    </y-tab-pane>
  </y-tab>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
