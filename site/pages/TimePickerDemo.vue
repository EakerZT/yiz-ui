<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.timePicker.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.timePicker.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <TimePicker v-model="value1" />
        <span class="demo-item-hint">{{ value1 || $t('demo.common.notSelected') }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.clearable')" style="margin-top: 8px">
      <TimePicker v-model="value2" clearable />
    </y-card>

    <y-card :title="$t('demo.timePicker.showSeconds')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <TimePicker v-model="value3" :show-seconds="true" />
        <span class="demo-item-hint">{{ value3 || $t('demo.common.notSelected') }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <TimePicker v-model="value4" disabled />
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <y-radio-button-group v-model:value="timePickerSize" :options="sizeOptions" />
        <TimePicker v-model="value5" :size="timePickerSize" clearable />
      </div>
    </y-card>

    <y-card :title="$t('demo.timePicker.defaultValue')" style="margin-top: 8px">
      <TimePicker v-model="value6" :format="'HH:mm'" />
    </y-card>

    <y-card :title="$t('demo.common.prefixSuffix')" style="margin-top: 8px">
      <div class="demo-picker-field">
        <TimePicker v-model="value7" prefix="Start" suffix="UTC+8" clearable />
        <span class="demo-item-hint">{{ value7 || $t('demo.common.notSelected') }}</span>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'
import { TimePicker } from 'yiz-ui'

type DemoSize = 'small' | 'default' | 'large'

const value1 = ref<string | null>(null)
const value2 = ref<string | null>('14:30:00')
const value3 = ref<string | null>('09:15:30')
const value4 = ref<string | null>('08:00:00')
const value5 = ref<string | null>(null)
const value6 = ref<string | null>('10:00')
const value7 = ref<string | null>('09:30:00')
const timePickerSize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-picker-field {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
}

.demo-picker-field :deep(.yiz-time-picker) {
  width: 100%;
}

.demo-picker-field .demo-item-hint {
  margin: 0;
}
</style>
