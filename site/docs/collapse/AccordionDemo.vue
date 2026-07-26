<template>
  <y-collapse v-model:value="accordionValue" accordion>
    <y-collapse-item name="account" :title="$t('demo.collapse.accountTitle')">
      {{ $t('demo.collapse.accountContent') }}
    </y-collapse-item>
    <y-collapse-item name="security" :title="$t('demo.collapse.securityTitle')">
      {{ $t('demo.collapse.securityContent') }}
    </y-collapse-item>
    <y-collapse-item name="notice" :title="$t('demo.collapse.noticeTitle')">
      {{ $t('demo.collapse.noticeContent') }}
    </y-collapse-item>
  </y-collapse>
  <p class="demo-collapse-info">
    {{ $t('demo.collapse.activeValue', { value: accordionValue ?? $t('demo.common.none') }) }}
  </p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const accordionValue = ref<string | undefined>('security')
</script>

<style scoped>
.demo-collapse-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}
</style>
