<template>
  <div class="demo-progress-list">
    <y-progress :percentage="percentage" />
    <y-slider v-model:value="percentage" :show-tooltip="false" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const percentage = ref(40)
</script>

<style scoped>
.demo-progress-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
