<template>
  <Select v-model:value="city">
    <SelectOption value="beijing">
      <span class="city-option"><i class="primary"></i>{{ $t('demo.common.beijing') }}</span>
    </SelectOption>
    <SelectOption :label="$t('demo.common.shanghai')" value="shanghai" :disabled="shanghaiDisabled" />
    <SelectOption value="guangzhou">
      <span class="city-option"><i class="success"></i>{{ $t('demo.common.guangzhou') }}</span>
    </SelectOption>
    <SelectOption :label="$t('demo.common.shenzhen')" value="shenzhen" />
    <SelectOption :label="$t('demo.common.hangzhou')" value="hangzhou" />
  </Select>
  <Button style="margin-left: 8px" @click="shanghaiDisabled = !shanghaiDisabled">
    {{ shanghaiDisabled ? $t('demo.common.enabled') : $t('demo.common.disabled') }}
  </Button>
  <span class="demo-hint">{{ $t('demo.select.value', { value: city }) }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t, Button, Select, SelectOption } from 'yiz-ui'

const city = ref()
const shanghaiDisabled = ref(true)
</script>

<style scoped>
.city-option {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.city-option i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.city-option .primary {
  background: var(--yiz-color-primary);
}

.city-option .success {
  background: var(--yiz-color-success);
}

.demo-hint {
  display: block;
  margin-top: 6px;
  color: #888;
  font-size: 13px;
}
</style>
