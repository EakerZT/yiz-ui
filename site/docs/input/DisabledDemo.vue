<template>
  <y-input v-model:value="disabledText" :placeholder="t('demo.common.disabled')" disabled />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const disabledText = ref('Disabled input')
</script>
