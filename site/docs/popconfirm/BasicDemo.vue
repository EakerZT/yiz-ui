<template>
  <div class="popconfirm-basic-demo">
    <y-popconfirm
      :title="$t('demo.popconfirm.deleteTitle')"
      :description="$t('demo.popconfirm.deleteDescription')"
      confirm-color="error"
      @confirm="result = $t('demo.popconfirm.confirmed')"
      @cancel="result = $t('demo.popconfirm.cancelled')"
    >
      <y-button color="error">{{ $t('demo.common.delete') }}</y-button>
    </y-popconfirm>
    <span>{{ result }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const result = ref($t('demo.popconfirm.waiting'))
</script>

<style scoped>
.popconfirm-basic-demo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #888;
  font-size: 13px;
}
</style>
