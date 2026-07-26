<template>
  <y-button-group>
    <y-input-number v-model:value="v10" prefix="¥" />
    <y-input-number v-model:value="v10" :suffix="$t('demo.inputNumber.yuan')" />
    <y-input-number v-model:value="v10" prefix="$" suffix="USD" />
  </y-button-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const v10 = ref<number | null>(0)
</script>
