<template>
  <y-input v-model:value="clearText" :placeholder="t('demo.common.clearable')" clearable />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const clearText = ref('')
</script>
