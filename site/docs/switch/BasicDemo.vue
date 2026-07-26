<template>
  <y-switch v-model:value="v1" /><span class="demo-hint">{{ v1 ? $t('demo.switch.on') : $t('demo.switch.off') }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const v1 = ref(true)
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
