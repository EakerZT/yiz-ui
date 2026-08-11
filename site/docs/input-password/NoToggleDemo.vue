<template>
  <y-input-password
    v-model:value="fixedPassword"
    :placeholder="t('demo.inputPassword.placeholder')"
    :show-toggle="false"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const fixedPassword = ref('')
</script>
