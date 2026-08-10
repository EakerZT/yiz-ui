<template>
  <div class="input-number-spacing-demo">
    <div v-for="size in sizes" :key="size" class="input-number-spacing-row">
      <code class="input-number-spacing-size">{{ size }}</code>
      <y-input-number
        v-model:value="values[size]"
        :size="size"
        :prefix="$t('demo.inputNumber.length')"
        controls="none"
        style="width: 120px"
      />
      <y-checkbox v-model:checked="nullable[size]">{{ $t('demo.inputNumber.allowEmpty') }}</y-checkbox>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { $t } from 'yiz-ui'

type InputNumberSize = 'small' | 'default' | 'large'

const sizes: InputNumberSize[] = ['small', 'default', 'large']
const values = reactive<Record<InputNumberSize, number | null>>({
  small: 255,
  default: 255,
  large: 255,
})
const nullable = reactive<Record<InputNumberSize, boolean>>({
  small: true,
  default: true,
  large: true,
})
</script>

<style scoped>
.input-number-spacing-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-number-spacing-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-number-spacing-size {
  width: 52px;
  color: var(--yiz-color-text-secondary);
}
</style>
