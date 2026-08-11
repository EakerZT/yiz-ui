<template>
  <div style="height: 200px; border: 1px dashed #d9d9d9; border-radius: 4px">
    <y-tab v-model:active="flexTab" flex overflow="auto">
      <y-tab-pane :label="t('demo.tab.tab1')" key="a">
        <p style="padding: 12px">{{ t('demo.tab.tab1Content') }}</p>
        <p style="padding: 0 12px; color: #999; font-size: 13px">{{ t('demo.tab.flexContentHint') }}</p>
        <div v-for="i in 20" :key="i" style="padding: 4px 12px; font-size: 13px; color: #bbb">
          {{ t('demo.tab.flexDemoRow', { index: i }) }}
        </div>
      </y-tab-pane>
      <y-tab-pane :label="t('demo.tab.tab2')" key="b">
        <p style="padding: 12px">{{ t('demo.tab.tab2Content') }}</p>
      </y-tab-pane>
    </y-tab>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const flexTab = ref('a')
</script>
