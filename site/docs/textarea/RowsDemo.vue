<template>
  <y-textarea v-model:value="text2" :rows="6" :placeholder="t('demo.textarea.rowsPlaceholder')" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const text2 = ref('')
</script>
