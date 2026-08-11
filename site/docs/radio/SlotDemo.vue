<template>
  <y-radio v-model:checked="radio3" value="x">
    <span style="color: var(--yiz-color-primary)">{{ t('demo.common.customSlot') }}</span>
  </y-radio>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const radio3 = ref(true)
</script>
