<template>
  <y-textarea v-model:value="text4" clearable :placeholder="$t('demo.textarea.clearablePlaceholder')" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const text4 = ref('')
</script>
