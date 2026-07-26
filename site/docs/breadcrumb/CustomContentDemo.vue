<template>
  <y-breadcrumb>
    <template #separator>/</template>
    <y-breadcrumb-item>{{ $t('demo.breadcrumb.workspace') }}</y-breadcrumb-item>
    <y-breadcrumb-item>{{ $t('demo.breadcrumb.project') }}</y-breadcrumb-item>
    <y-breadcrumb-item>
      <span class="demo-breadcrumb-current">{{ $t('demo.breadcrumb.issue') }}</span>
    </y-breadcrumb-item>
  </y-breadcrumb>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>

<style scoped>
.demo-breadcrumb-current {
  font-weight: 500;
}
</style>
