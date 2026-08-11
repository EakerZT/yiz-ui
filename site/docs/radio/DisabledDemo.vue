<template>
  <y-radio v-model:checked="radio2A" value="a" disabled :label="t('demo.common.unselectedDisabled')" /><y-radio
    v-model:checked="radio2B"
    value="b"
    disabled
    :label="t('demo.common.selectedDisabled')"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const radio2A = ref(false)

const radio2B = ref(true)
</script>
