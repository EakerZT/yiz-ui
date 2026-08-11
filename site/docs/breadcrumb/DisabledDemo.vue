<template>
  <y-breadcrumb>
    <y-breadcrumb-item @click="onBreadcrumbClick(1)">{{ t('demo.breadcrumb.home') }}</y-breadcrumb-item>
    <y-breadcrumb-item disabled>{{ t('demo.breadcrumb.disabled') }}</y-breadcrumb-item>
    <y-breadcrumb-item>{{ t('demo.breadcrumb.current') }}</y-breadcrumb-item>
  </y-breadcrumb>
  <p class="demo-breadcrumb-info">
    {{ t('demo.breadcrumb.lastClick', { value: lastClick ?? t('demo.common.none') }) }}
  </p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const lastClick = ref<string | null>(null)

function onBreadcrumbClick(index: number) {
  lastClick.value = String(index)
}
</script>

<style scoped>
.demo-breadcrumb-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}
</style>
