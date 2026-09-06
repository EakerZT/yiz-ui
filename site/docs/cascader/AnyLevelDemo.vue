<script lang="ts" setup>
import { ref } from 'vue'
import { Cascader, type CascaderValue } from 'yiz-ui'
import { useOptions } from './options'
const value = ref<CascaderValue[]>()
const options = useOptions()
</script>

<template>
  <Cascader
    v-model:value="value"
    :options="options"
    change-on-select
    expand-trigger="hover"
    :show-all-levels="false"
    clearable
  />
  <pre>{{ JSON.stringify(value ?? null) }}</pre>
</template>
