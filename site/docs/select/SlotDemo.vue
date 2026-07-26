<template>
  <y-select v-model:value="city">
    <y-select-option value="beijing">
      <span class="city-option"><i class="primary"></i>{{ $t('demo.common.beijing') }}</span>
    </y-select-option>
    <y-select-option :label="$t('demo.common.shanghai')" value="shanghai" :disabled="shanghaiDisabled" />
    <y-select-option value="guangzhou">
      <span class="city-option"><i class="success"></i>{{ $t('demo.common.guangzhou') }}</span>
    </y-select-option>
    <y-select-option :label="$t('demo.common.shenzhen')" value="shenzhen" />
    <y-select-option :label="$t('demo.common.hangzhou')" value="hangzhou" />
  </y-select>
  <y-button style="margin-left: 8px" @click="shanghaiDisabled = !shanghaiDisabled">
    {{ shanghaiDisabled ? $t('demo.common.enabled') : $t('demo.common.disabled') }}
  </y-button>
  <span class="demo-hint">{{ $t('demo.select.value', { value: city }) }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

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
