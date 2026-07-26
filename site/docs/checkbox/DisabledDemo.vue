<template>
  <y-button-group>
    <y-checkbox v-model:checked="checked3" disabled>{{ $t('demo.common.unselectedDisabled') }}</y-checkbox>
    <y-checkbox v-model:checked="checked4" disabled>{{ $t('demo.common.selectedDisabled') }}</y-checkbox>
  </y-button-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const checked3 = ref(false)

const checked4 = ref(true)
</script>
