<template>
  <div class="button-loading-demo">
    <Switch v-model:value="loading" />
    <ButtonGroup wrap gap="8">
      <Button :loading="loading">outlined</Button>
      <Button type="primary" color="error" :loading="loading">primary</Button>
      <Button type="primary" :loading="loading">primary</Button>
      <Button type="plain" :loading="loading">plain</Button>
      <Button type="plain" color="error" :loading="loading">plain</Button>
      <Button type="primary" shape="circle" :loading="loading"><Icon :icon="Flash16Regular" /></Button>
    </ButtonGroup>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Flash16Regular } from '@vicons/fluent'
import { Button, ButtonGroup, Icon, Switch } from 'yiz-ui'

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
