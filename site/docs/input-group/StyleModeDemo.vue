<template>
  <div class="demo-input-group-style-mode">
    <y-input-group style-mode="outlined">
      <y-input v-model:value="outlinedValue" style-mode="filled" placeholder="Outlined group" />
      <y-input-number v-model:value="outlinedNumber" style-mode="filled" controls="none" />
    </y-input-group>
    <y-input-group style-mode="filled">
      <y-input v-model:value="filledValue" style-mode="outlined" placeholder="Filled group" />
      <y-select
        v-model:value="filledOption"
        style-mode="outlined"
        :options="options"
        :placeholder="$t('demo.common.pleaseSelect')"
      />
    </y-input-group>
    <y-input-group style-mode="filled">
      <y-date-picker v-model:value="dateValue" style-mode="outlined" clearable />
      <y-time-picker v-model:value="timeValue" style-mode="outlined" clearable />
    </y-input-group>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const outlinedValue = ref('')
const outlinedNumber = ref<number | null>(null)
const filledValue = ref('')
const filledOption = ref<string>()
const dateValue = ref<Date | null>(null)
const timeValue = ref<string | null>(null)
const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'TypeScript', value: 'typescript' },
]
</script>

<style scoped>
.demo-input-group-style-mode {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.demo-input-group-style-mode :deep(.yiz-input) {
  width: 180px;
}

.demo-input-group-style-mode :deep(.yiz-input-number),
.demo-input-group-style-mode :deep(.yiz-select),
.demo-input-group-style-mode :deep(.yiz-date-picker),
.demo-input-group-style-mode :deep(.yiz-time-picker) {
  width: 150px;
}
</style>
