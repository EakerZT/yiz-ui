<template>
  <y-button type="primary" @click="visible1 = true">{{ t('demo.drawer.openDrawer') }}</y-button>

  <y-drawer v-model:show="visible1" :title="t('demo.drawer.basicDrawer')">
    <p>{{ t('demo.drawer.basicContent') }}</p>
  </y-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const visible1 = ref(false)
</script>
