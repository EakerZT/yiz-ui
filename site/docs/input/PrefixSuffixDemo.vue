<template>
  <y-input v-model:value="affixText" :placeholder="$t('demo.input.propMode')">
    <template #prefix>
      <y-icon :icon="Flash20Regular" />
    </template>
    <template #suffix>.com</template>
  </y-input>
</template>

<script lang="ts" setup>
import { Flash20Regular } from '@vicons/fluent'
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const affixText = ref('')
</script>
