<template>
  <y-card :title="$t('demo.card.confirmAction')" style="width: 360px">
    <p>{{ $t('demo.card.confirmMsg') }}</p>
    <template #footer>
      <div style="display: flex; gap: 8px; justify-content: flex-end">
        <y-button>{{ $t('demo.common.cancel') }}</y-button>
        <y-button type="primary">{{ $t('demo.common.confirm') }}</y-button>
      </div>
    </template>
  </y-card>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
