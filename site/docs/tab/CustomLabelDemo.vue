<template>
  <y-tab v-model:active="customLabelTab">
    <y-tab-pane key="a">
      <template #label>🏠 {{ $t('demo.common.home') }}</template>
      <p style="padding: 12px 0">{{ $t('demo.tab.homeContent') }}</p>
    </y-tab-pane>
    <y-tab-pane key="b">
      <template #label>⚙️ {{ $t('demo.common.settings') }}</template>
      <p style="padding: 12px 0">{{ $t('demo.tab.settingsContent') }}</p>
    </y-tab-pane>
    <y-tab-pane key="c">
      <template #label>👤 {{ $t('demo.tab.user') }}</template>
      <p style="padding: 12px 0">{{ $t('demo.tab.userContent') }}</p>
    </y-tab-pane>
  </y-tab>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const customLabelTab = ref('a')
</script>
