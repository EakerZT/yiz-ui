<template>
  <y-popover :width="1200">
    <template #title>{{ $t('demo.popover.customTitle') }}</template>
    <template #content>
      <div class="demo-popover-content">
        <p>{{ $t('demo.popover.customContent') }}</p>
        <div class="demo-popover-actions">
          <y-button size="small">{{ $t('demo.common.cancel') }}</y-button>
          <y-button size="small" type="primary">{{ $t('demo.common.confirm') }}</y-button>
        </div>
      </div>
    </template>
    <y-button>{{ $t('demo.common.customSlot') }}</y-button>
  </y-popover>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>

<style scoped>
.demo-popover-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.demo-popover-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
