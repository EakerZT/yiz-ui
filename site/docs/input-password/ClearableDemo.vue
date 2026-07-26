<template>
  <y-input-password v-model:value="clearPassword" :placeholder="$t('demo.common.clearable')" clearable />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const clearPassword = ref('')
</script>
