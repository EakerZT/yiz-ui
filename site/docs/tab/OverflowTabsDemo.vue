<template>
  <y-tab v-model:active="overflowTab">
    <y-tab-pane v-for="i in 15" :key="i" :label="t('demo.tab.tabN', { index: i })">
      <p style="padding: 12px 0">{{ t('demo.tab.tabNContent', { index: i }) }}</p>
    </y-tab-pane>
  </y-tab>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const overflowTab = ref(1)
</script>
