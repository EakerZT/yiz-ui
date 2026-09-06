<script lang="ts" setup>
import { ref } from 'vue'
import { Cascader, type CascaderValue } from 'yiz-ui'
import { useOptions } from './options'
const value = ref<CascaderValue[]>(['devices', 'computers', 'laptop'])
const options = useOptions()
</script>

<template>
  <Cascader v-model:value="value" :options="options" clearable />
  <pre>{{ JSON.stringify(value ?? null) }}</pre>
</template>
