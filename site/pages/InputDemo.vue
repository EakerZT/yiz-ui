<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.input') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.input.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-input v-model:value="inputText" :placeholder="$t('demo.common.pleaseInput')" />
      <span class="demo-hint">{{
        $t('demo.input.currentValue', { value: inputText || $t('demo.common.empty') })
      }}</span>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.common.clearable')" style="margin-top: 8px">
      <y-input v-model:value="clearText" :placeholder="$t('demo.common.clearable')" clearable />
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-input-row">
        <y-radio-button-group v-model:value="inputSize" :options="sizeOptions" />
        <y-input v-model:value="sizeText" :placeholder="$t('demo.common.pleaseInput')" :size="inputSize" />
      </div>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-input v-model:value="disabledText" :placeholder="$t('demo.common.disabled')" disabled />
    </demo-card>

    <demo-card :source-index="4" :title="$t('demo.common.prefixSuffix')" style="margin-top: 8px">
      <y-input v-model:value="affixText" :placeholder="$t('demo.input.propMode')">
        <template #prefix>
          <y-icon :icon="Flash20Regular" />
        </template>
        <template #suffix>.com</template>
      </y-input>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'
import { Flash20Regular } from '@vicons/fluent'

type DemoSize = 'small' | 'default' | 'large'

const inputText = ref('')
const clearText = ref('')
const sizeText = ref('')
const disabledText = ref('Disabled input')
const affixText = ref('')
const inputSize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}

.demo-input-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
