<template>
  <y-tab v-model:active="cardTab" type="card" @close="onCardClose">
    <y-tab-pane :label="t('demo.tab.tab1')" key="a">
      <p style="padding: 12px 0">{{ t('demo.tab.tab1Content') }}</p>
    </y-tab-pane>
    <y-tab-pane :label="t('demo.tab.tab2')" key="b">
      <p style="padding: 12px 0">{{ t('demo.tab.tab2Content') }}</p>
    </y-tab-pane>
    <y-tab-pane :label="t('demo.tab.tab3')" key="c" closable>
      <p style="padding: 12px 0">{{ t('demo.tab.tab3Content') }}</p>
    </y-tab-pane>
    <y-tab-pane :label="t('demo.tab.tabN', { index: 4 })" key="d" closable>
      <p style="padding: 12px 0">{{ t('demo.tab.tabNContent', { index: 4 }) }}</p>
    </y-tab-pane>
  </y-tab>
  <p v-if="cardCloseMsg" style="margin-top: 8px; color: #999; font-size: 13px">{{ cardCloseMsg }}</p>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const cardTab = ref('a')

const closedTabKey = ref<string | number | null>(null)
const cardCloseMsg = computed(() =>
  closedTabKey.value == null ? '' : t('demo.tab.cardCloseEvent', { value: closedTabKey.value }),
)

function onCardClose(value: string | number) {
  closedTabKey.value = value
}
</script>
