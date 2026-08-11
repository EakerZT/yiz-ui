<template>
  <y-textarea
    v-model:value="text3"
    :maxlength="100"
    show-count
    :placeholder="t('demo.textarea.maxlengthPlaceholder')"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const text3 = ref('')
</script>
