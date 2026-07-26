<template>
  <y-input v-model:value="disabledText" :placeholder="$t('demo.common.disabled')" disabled />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const disabledText = ref('Disabled input')
</script>
