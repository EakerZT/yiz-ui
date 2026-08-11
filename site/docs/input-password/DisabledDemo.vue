<template>
  <y-input-password v-model:value="disabledPassword" :placeholder="t('demo.common.disabled')" disabled />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const disabledPassword = ref('disabled-password')
</script>
