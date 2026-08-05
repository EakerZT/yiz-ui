<template>
  <div class="popconfirm-async-demo">
    <y-popconfirm
      :title="$t('demo.popconfirm.publishTitle')"
      :before-confirm="beforeConfirm"
      @confirm="status = $t('demo.popconfirm.publishDone')"
    >
      <y-button type="primary">{{ $t('demo.popconfirm.publish') }}</y-button>
    </y-popconfirm>
    <span>{{ status }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const status = ref($t('demo.popconfirm.publishWaiting'))

async function beforeConfirm() {
  status.value = $t('demo.popconfirm.publishing')
  await new Promise((resolve) => setTimeout(resolve, 1200))
}
</script>

<style scoped>
.popconfirm-async-demo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #888;
  font-size: 13px;
}
</style>
