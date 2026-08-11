<template>
  <div class="tab-reopen-demo">
    <y-tab v-model:active="active" type="card" @close="onClose">
      <y-tab-pane v-for="item in tabs" :key="item.key" :label="item.label" :closable="item.key !== 'home'">
        <p>{{ item.content }}</p>
      </y-tab-pane>
    </y-tab>
    <div class="tab-reopen-actions">
      <y-button :disabled="tabs.some((item) => item.key === 'report')" @click="reopenReport">
        {{ t('demo.tab.reopenSameKey') }}
      </y-button>
      <span>{{ t('demo.tab.reopenHint') }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

interface DemoTab {
  key: string
  label: string
  content: string
}

const active = ref('report')
const tabs = ref<DemoTab[]>([
  { key: 'home', label: t('demo.common.home'), content: t('demo.tab.homeContent') },
  { key: 'report', label: t('demo.tab.report'), content: t('demo.tab.reportContent') },
])

function onClose(key: string) {
  tabs.value = tabs.value.filter((item) => item.key !== key)
}

function reopenReport() {
  tabs.value.push({ key: 'report', label: t('demo.tab.report'), content: t('demo.tab.reportContent') })
  active.value = 'report'
}
</script>

<style scoped>
.tab-reopen-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  color: #888;
  font-size: 13px;
}
</style>
