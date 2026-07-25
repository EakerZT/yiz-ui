<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.colorPicker.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.colorPicker.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-color-picker v-model:value="color" />
        <span class="demo-color-value">{{ color }}</span>
      </div>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.colorPicker.alpha')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-color-picker v-model:value="alphaColor" alpha />
        <div class="demo-color-meta">
          <span class="demo-color-preview" :style="{ backgroundColor: alphaColor }" />
          <span class="demo-color-value">{{ alphaColor }}</span>
        </div>
      </div>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.colorPicker.customPresets')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-color-picker v-model:value="brandColor" :presets="brandPresets" />
        <div class="demo-color-meta">
          <span class="demo-color-preview" :style="{ backgroundColor: brandColor }" />
          <span class="demo-color-value">{{ brandColor }}</span>
        </div>
      </div>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.common.prefixSuffix')" style="margin-top: 8px">
      <y-color-picker v-model:value="affixColor" prefix="HEX" suffix="Theme" />
    </demo-card>

    <demo-card :source-index="4" :title="$t('demo.colorPicker.sizeAndDisabled')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-radio-button-group v-model:value="colorPickerSize" :options="sizeOptions" />
        <y-color-picker v-model:value="sizeColor" :size="colorPickerSize" />
        <y-color-picker v-model:value="disabledColor" disabled />
      </div>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const color = ref('#1677ff')
const alphaColor = ref('#1677ff80')
const brandColor = ref('#13c2c2')
const affixColor = ref('#722ed1')
const sizeColor = ref('#52c41a')
const disabledColor = ref('#d9d9d9')
const colorPickerSize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]

const brandPresets = ['#1677ff', '#13c2c2', '#52c41a', '#faad14', '#ff4d4f', '#722ed1']
</script>

<style scoped>
.demo-picker-field {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.demo-picker-field :deep(.yiz-color-picker) {
  width: 100%;
}

.demo-color-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.demo-color-value {
  color: #666;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  text-transform: uppercase;
}

.demo-color-preview {
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
</style>
