<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.input') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.input.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-input v-model:value="inputText" :placeholder="$t('demo.common.pleaseInput')" />
      <span class="demo-hint">{{ $t('demo.input.currentValue', { value: inputText || $t('demo.common.empty') }) }}</span>
    </y-card>

    <y-card :title="$t('demo.common.clearable')" style="margin-top: 8px">
      <y-input v-model:value="clearText" :placeholder="$t('demo.common.clearable')" clearable />
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-input v-model:value="disabledText" :placeholder="$t('demo.common.disabled')" disabled />
    </y-card>

    <y-card :title="$t('demo.common.prefixSuffix')" style="margin-top: 8px">
      <y-input v-model:value="affixText" :placeholder="$t('demo.input.propMode')">
        <template #prefix>
          <y-icon :icon="Flash20Regular" />
        </template>
        <template #suffix>.com</template>
      </y-input>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'
import { Flash20Regular } from '@vicons/fluent'

const inputText = ref('')
const clearText = ref('')
const disabledText = ref('Disabled input')
const affixText = ref('')
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
