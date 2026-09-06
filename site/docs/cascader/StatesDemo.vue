<script lang="ts" setup>
import { Cascader, InputGroup, Input } from 'yiz-ui'
import { useOptions } from './options'
const options = useOptions()
</script>

<template>
  <div class="cascader-states">
    <Cascader
      v-for="size in ['small', 'default', 'large'] as const"
      :key="size"
      :options="options"
      :size="size"
      style-mode="filled"
    />
    <Cascader :options="options" :value="['devices', 'phone']" disabled clearable />
    <Cascader :options="options" :value="['devices', 'phone']" readonly clearable />
    <Cascader :options="[]" />
    <InputGroup size="small" style-mode="filled">
      <Cascader :options="options" />
      <Input />
    </InputGroup>
  </div>
</template>

<style scoped>
.cascader-states {
  display: grid;
  gap: 12px;
}
</style>
