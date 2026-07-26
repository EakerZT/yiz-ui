<template>
  <div class="button-loading-demo">
    <y-switch v-model:value="loading" />
    <y-button-group wrap gap="8">
      <y-button :loading="loading">outlined</y-button>
      <y-button type="primary" color="error" :loading="loading">primary</y-button>
      <y-button type="primary" :loading="loading">primary</y-button>
      <y-button type="plain" :loading="loading">plain</y-button>
      <y-button type="plain" color="error" :loading="loading">plain</y-button>
      <y-button type="primary" shape="circle" :loading="loading"><y-icon :icon="Flash16Regular" /></y-button>
    </y-button-group>
  </div>
</template>

<script lang="ts" setup>
import { Flash16Regular } from '@vicons/fluent'
import { ref } from 'vue'

const loading = ref(true)
</script>

<style scoped>
.button-loading-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
