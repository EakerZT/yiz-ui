<template>
  <div class="demo-input-style-mode">
    <y-input v-model:value="outlinedValue" placeholder="Outlined" />
    <y-input v-model:value="filledValue" style-mode="filled" placeholder="Filled" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const outlinedValue = ref('')
const filledValue = ref('')
</script>

<style scoped>
.demo-input-style-mode {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 320px;
  max-width: 100%;
}
</style>
