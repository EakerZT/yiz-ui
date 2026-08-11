<template>
  <y-collapse v-model:value="slotValue" :bordered="false">
    <y-collapse-item name="slot">
      <template #title>
        <span class="demo-collapse-title">{{ t('demo.collapse.slotTitle') }}</span>
      </template>
      <template #extra>
        <y-link-button @click="extraClickCount++">{{ t('demo.collapse.extraAction') }}</y-link-button>
      </template>
      {{ t('demo.collapse.slotContent') }}
    </y-collapse-item>
  </y-collapse>
  <p class="demo-collapse-info">{{ t('demo.collapse.extraCount', { count: extraClickCount }) }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const slotValue = ref(['slot'])

const extraClickCount = ref(0)
</script>

<style scoped>
.demo-collapse-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}

.demo-collapse-title {
  color: var(--yiz-color-primary);
  font-weight: 600;
}
</style>
