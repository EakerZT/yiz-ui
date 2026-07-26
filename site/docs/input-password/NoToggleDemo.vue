<template>
  <y-input-password
    v-model:value="fixedPassword"
    :placeholder="$t('demo.inputPassword.placeholder')"
    :show-toggle="false"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const fixedPassword = ref('')
</script>
