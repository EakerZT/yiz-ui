<template>
  <y-input-password v-model:value="clearPassword" :placeholder="t('demo.common.clearable')" clearable />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const clearPassword = ref('')
</script>
