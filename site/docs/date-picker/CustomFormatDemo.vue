<template>
  <y-date-picker
    v-model:value="value6"
    :format="$t('demo.datePicker.yearMonthDay')"
    :placeholder="$t('demo.common.placeholder')"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const value6 = ref<Date | null>(new Date())
</script>
