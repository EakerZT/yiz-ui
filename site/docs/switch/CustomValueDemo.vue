<template>
  <y-switch v-model:value="v10" checked-value="enabled" unchecked-value="disabled" /><span class="demo-hint">{{
    v10
  }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const v10 = ref('enabled')
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
  vertical-align: middle;
}
</style>
