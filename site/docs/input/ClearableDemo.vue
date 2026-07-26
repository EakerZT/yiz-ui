<template>
  <y-input v-model:value="clearText" :placeholder="$t('demo.common.clearable')" clearable />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const clearText = ref('')
</script>
