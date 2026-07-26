<template>
  <y-button-group>
    <y-tag>{{ $t('demo.tab.tab1') }}</y-tag>
    <y-tag color="primary">{{ $t('demo.common.primary') }}</y-tag>
    <y-tag color="success">{{ $t('demo.common.success') }}</y-tag>
    <y-tag color="warning">{{ $t('demo.common.warning') }}</y-tag>
    <y-tag color="error">{{ $t('demo.common.error') }}</y-tag>
  </y-button-group>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
