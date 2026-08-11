<template>
  <y-breadcrumb>
    <y-breadcrumb-item href="#/">{{ t('demo.breadcrumb.home') }}</y-breadcrumb-item>
    <y-breadcrumb-item href="#/button">{{ t('demo.breadcrumb.components') }}</y-breadcrumb-item>
    <y-breadcrumb-item>{{ t('demo.breadcrumb.current') }}</y-breadcrumb-item>
  </y-breadcrumb>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
