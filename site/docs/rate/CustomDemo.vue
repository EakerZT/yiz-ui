<template>
  <div class="rate-demo-custom">
    <y-rate v-model:value="value" :count="7" :size="30" color="#ff4d6d" void-color="#ffd6df">
      <template #character>♥</template>
    </y-rate>
    <span>{{ $t('demo.rate.sevenPoint') }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const value = ref(5)
</script>

<style scoped>
.rate-demo-custom {
  display: flex;
  align-items: center;
  gap: 14px;
  color: #666;
  font-size: 13px;
}
</style>
