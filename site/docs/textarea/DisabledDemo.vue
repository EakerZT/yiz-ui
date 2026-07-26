<template>
  <y-textarea v-model:value="text7" :placeholder="$t('demo.textarea.disabledPlaceholder')" disabled />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const text7 = ref('This textarea is disabled and cannot be edited.')
</script>
