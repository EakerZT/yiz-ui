<template>
  <y-input-password v-model:value="password" :placeholder="$t('demo.inputPassword.placeholder')" /><span
    class="demo-hint"
  >
    {{ $t('demo.inputPassword.currentValue', { value: password || $t('demo.common.empty') }) }}
  </span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const password = ref('')
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
