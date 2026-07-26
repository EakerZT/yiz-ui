<template>
  <y-card :title="$t('demo.card.landscape')" style="width: 320px">
    <template #cover>
      <div class="demo-cover">{{ $t('demo.card.coverArea') }}</div>
    </template>
    <p>{{ $t('demo.card.coverHint') }}</p>
  </y-card>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>

<style scoped>
.demo-cover {
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 18px;
  font-weight: 500;
}
</style>
