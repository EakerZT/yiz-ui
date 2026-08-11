<template>
  <y-button-group>
    <y-checkbox v-model:checked="borderChecked1" border>{{ t('demo.checkbox.optionA') }}</y-checkbox>
    <y-checkbox v-model:checked="borderChecked2" border>{{ t('demo.checkbox.optionB') }}</y-checkbox>
  </y-button-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const borderChecked1 = ref(false)

const borderChecked2 = ref(true)
</script>
