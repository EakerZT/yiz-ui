<template>
  <y-card :title="t('demo.card.userList')" style="width: 400px">
    <template #extra>
      <span class="demo-link">{{ t('demo.common.more') }}</span>
    </template>
    <p>{{ t('demo.card.extraHint') }}</p>
  </y-card>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>

<style scoped>
.demo-link {
  color: var(--yiz-color-primary);
  cursor: pointer;
  font-size: 14px;
}
.demo-link:hover {
  text-decoration: underline;
}
</style>
