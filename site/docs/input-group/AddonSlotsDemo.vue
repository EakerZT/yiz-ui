<template>
  <y-input-group>
    <template #beforeAddon>¥</template>
    <y-input-number v-model:value="price" controls="none" />
    <template #afterAddon>{{ $t('demo.inputGroup.perMonth') }}</template>
  </y-input-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const price = ref<number | null>(99)
</script>
