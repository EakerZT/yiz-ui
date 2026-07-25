<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.inputNumber.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.inputNumber.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-input-number v-model:value="v1" />
      <span class="demo-hint">{{ $t('demo.inputNumber.currentValue', { value: v1 ?? '' }) }}</span>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.inputNumber.step')" style="margin-top: 8px">
      <y-input-number v-model:value="v2" :step="0.5" />
      <span class="demo-hint">{{ $t('demo.inputNumber.currentValue', { value: v2 ?? '' }) }}</span>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.inputNumber.range')" style="margin-top: 8px">
      <y-input-number v-model:value="v3" :min="0" :max="100" />
      <span class="demo-hint">{{ $t('demo.inputNumber.rangeValue', { value: v3 ?? '' }) }}</span>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.inputNumber.precision')" style="margin-top: 8px">
      <y-input-number v-model:value="v4" :step="0.1" :precision="1" />
      <span class="demo-hint">{{ $t('demo.inputNumber.currentValue', { value: v4 ?? '' }) }}</span>
    </demo-card>

    <demo-card :source-index="4" :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-input-number-size-panel">
        <y-radio-button-group v-model:value="inputNumberSize" :options="sizeOptions" />
        <y-input-number v-model:value="v5" :size="inputNumberSize" />
      </div>
    </demo-card>

    <demo-card :source-index="5" :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-input-number v-model:value="v7" disabled />
    </demo-card>

    <demo-card :source-index="6" :title="$t('demo.inputNumber.noControls')" style="margin-top: 8px">
      <y-button-group>
        <y-input-number v-model:value="v8" :controls="false" />
        <y-input-number v-model:value="v8" :controls="false" align="center" />
        <y-input-number v-model:value="v8" :controls="false" align="right" />
      </y-button-group>
    </demo-card>

    <demo-card :source-index="7" :title="$t('demo.common.prefixSuffix')" style="margin-top: 8px">
      <y-button-group>
        <y-input-number v-model:value="v10" prefix="¥" />
        <y-input-number v-model:value="v10" :suffix="$t('demo.inputNumber.yuan')" />
        <y-input-number v-model:value="v10" prefix="$" suffix="USD" />
      </y-button-group>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const v1 = ref<number | null>(0)
const v2 = ref<number | null>(0)
const v3 = ref<number | null>(0)
const v4 = ref<number | null>(0)
const v5 = ref<number | null>(0)
const v7 = ref<number | null>(0)
const v8 = ref<number | null>(0)
const v10 = ref<number | null>(0)
const inputNumberSize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}

.demo-input-number-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
