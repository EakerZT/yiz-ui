<template>
  <y-input-password v-model:value="disabledPassword" :placeholder="$t('demo.common.disabled')" disabled />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const disabledPassword = ref('disabled-password')
</script>
