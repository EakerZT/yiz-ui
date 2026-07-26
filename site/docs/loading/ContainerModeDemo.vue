<template>
  <y-loading :loading="containerLoading">
    <div class="demo-loading-content">
      <p>{{ $t('demo.loading.wrappedContent') }}</p>
      <p>{{ $t('demo.loading.wrappedHint') }}</p>
    </div>
  </y-loading>
  <div style="margin-top: 8px">
    <y-button size="small" @click="containerLoading = !containerLoading">
      {{ containerLoading ? $t('demo.loading.stopLoading') : $t('demo.loading.startLoading') }}
    </y-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const containerLoading = ref(true)
</script>

<style scoped>
.demo-loading-content {
  padding: 20px;
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  line-height: 1.8;
}
</style>
