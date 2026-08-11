<template>
  <y-input-password
    v-model:value="affixPassword"
    :placeholder="t('demo.inputPassword.placeholder')"
    prefix="Key"
    suffix="Safe"
    clearable
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const affixPassword = ref('')
</script>
