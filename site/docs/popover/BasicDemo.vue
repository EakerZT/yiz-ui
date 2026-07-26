<template>
  <y-popover :title="$t('demo.popover.basicTitle')" :content="$t('demo.popover.basicContent')">
    <y-button type="primary">{{ $t('demo.popover.clickMe') }}</y-button>
  </y-popover>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
