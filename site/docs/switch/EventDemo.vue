<template>
  <y-switch v-model:value="v9" @change="onChange" /><span class="demo-hint">{{
    $t('demo.switch.toggleCount', { count: changeCount })
  }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const v9 = ref(true)

const changeCount = ref(0)

function onChange() {
  changeCount.value++
}
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
