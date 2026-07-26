<template>
  <div class="demo-info-list">
    <y-info :message="$t('demo.info.infoMessage')" />
    <y-info type="success" :message="$t('demo.info.successMessage')" />
    <y-info type="warning" :message="$t('demo.info.warningMessage')" />
    <y-info type="error" :message="$t('demo.info.errorMessage')" />
  </div>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>

<style scoped>
.demo-info-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
