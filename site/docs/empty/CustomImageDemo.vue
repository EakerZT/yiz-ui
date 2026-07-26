<template>
  <y-empty :description="$t('demo.empty.networkError')">
    <template #image>
      <svg viewBox="0 0 64 64" width="64" height="64" fill="none">
        <circle cx="32" cy="32" r="30" stroke="#d9d9d9" stroke-width="2" />
        <path d="M20 44l24-24M20 20l24 24" stroke="#d9d9d9" stroke-width="2" stroke-linecap="round" />
      </svg>
    </template>
  </y-empty>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
