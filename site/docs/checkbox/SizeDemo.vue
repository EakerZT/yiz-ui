<template>
  <div class="demo-checkbox-stack">
    <y-checkbox v-model:checked="borderSizeSmall" border size="small">{{ t('demo.common.smallSize') }}</y-checkbox>
    <y-checkbox v-model:checked="borderSizeDefault" border>{{ t('demo.common.defaultSize') }}</y-checkbox>
    <y-checkbox v-model:checked="borderSizeLarge" border size="large">{{ t('demo.common.largeSize') }}</y-checkbox>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const borderSizeSmall = ref(true)

const borderSizeDefault = ref(true)

const borderSizeLarge = ref(true)
</script>

<style scoped>
.demo-checkbox-stack {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
