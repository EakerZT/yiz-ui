<template>
  <y-textarea v-model:value="text4" clearable :placeholder="t('demo.textarea.clearablePlaceholder')" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const text4 = ref('')
</script>
