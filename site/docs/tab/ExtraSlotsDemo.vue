<template>
  <y-tab v-model:active="extraTab">
    <template #leftExtra>
      <y-button size="small" @click="addExtraTab">{{ t('demo.tab.addTab') }}</y-button>
    </template>
    <template #rightExtra>
      <span style="font-size: 13px; color: #999">{{ t('demo.tab.totalItems', { count: extraCount }) }}</span>
    </template>
    <y-tab-pane v-for="i in extraCount" :key="i" :label="t('demo.tab.tabN', { index: i })">
      <p style="padding: 12px 0">{{ t('demo.tab.tabNContent', { index: i }) }}</p>
    </y-tab-pane>
  </y-tab>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const extraTab = ref(1)

const extraCount = ref(4)

function addExtraTab() {
  extraCount.value++
}
</script>
