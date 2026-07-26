<template>
  <y-checkbox v-model:checked="checked2">
    <span style="color: var(--yiz-color-primary)">{{ $t('demo.common.customSlotContent') }}</span>
  </y-checkbox>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const checked2 = ref(false)
</script>
