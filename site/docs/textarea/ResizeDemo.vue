<template>
  <p style="font-size: 13px; color: #999; margin-bottom: 8px">{{ $t('demo.textarea.resizeNone') }}</p>
  <y-textarea
    v-model:value="text5"
    resize="none"
    :placeholder="$t('demo.textarea.resizeNonePlaceholder')"
    style="margin-bottom: 12px"
  />
  <p style="font-size: 13px; color: #999; margin-bottom: 8px">{{ $t('demo.textarea.resizeBoth') }}</p>
  <y-textarea v-model:value="text6" resize="both" :placeholder="$t('demo.textarea.resizeBothPlaceholder')" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const text5 = ref('')

const text6 = ref('')
</script>
