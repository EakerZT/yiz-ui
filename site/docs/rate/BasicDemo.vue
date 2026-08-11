<template>
  <div class="rate-demo-list">
    <div>
      <y-rate v-model:value="value" />
      <span>{{ t('demo.rate.current', { value }) }}</span>
    </div>
    <div>
      <y-rate :value="3" disabled />
      <span>{{ t('demo.common.disabled') }}</span>
    </div>
    <div>
      <y-rate :value="4" readonly />
      <span>{{ t('demo.rate.readonly') }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const value = ref(2)
</script>

<style scoped>
.rate-demo-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.rate-demo-list > div {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #666;
  font-size: 13px;
}
</style>
