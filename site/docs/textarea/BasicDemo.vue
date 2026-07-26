<template>
  <y-textarea v-model:value="text1" :placeholder="$t('demo.textarea.placeholder')" />
  <p style="margin-top: 8px; font-size: 13px; color: #999">{{ $t('demo.textarea.value') }}: {{ text1 }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const text1 = ref('')
</script>
