<template>
  <y-button-group>
    <y-checkbox v-model:checked="checked1">{{ $t('demo.checkbox.optionA') }}</y-checkbox>
    <y-checkbox v-model:checked="checked2">{{ $t('demo.checkbox.optionB') }}</y-checkbox>
  </y-button-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const checked1 = ref(true)

const checked2 = ref(false)
</script>
