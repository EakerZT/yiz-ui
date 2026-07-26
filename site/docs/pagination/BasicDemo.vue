<template>
  <y-pagination v-model:page="page" :total="128" />
  <p class="demo-pagination-info">{{ $t('demo.pagination.currentPage', { page }) }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const page = ref(1)
</script>

<style scoped>
.demo-pagination-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}

.demo-pagination-info + .demo-pagination-info {
  margin-top: 4px;
}
</style>
