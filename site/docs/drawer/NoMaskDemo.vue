<template>
  <y-button @click="visible3 = true">{{ t('demo.common.noMask') }}</y-button>

  <y-drawer v-model:show="visible3" :title="t('demo.common.noMask')" :mask="false">
    <p>{{ t('demo.drawer.noMaskHint') }}</p>
  </y-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const visible3 = ref(false)
</script>
