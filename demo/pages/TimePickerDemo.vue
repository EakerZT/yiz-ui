<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.timePicker.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.timePicker.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.common.selectTime') }}</span>
        <TimePicker v-model="value1" />
        <span class="demo-item-hint">{{ value1 || $t('demo.common.notSelected') }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.clearable')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.common.withClear') }}</span>
        <TimePicker v-model="value2" clearable />
        <span class="demo-item-hint">{{ $t('demo.common.clearByX') }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.timePicker.showSeconds')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.timePicker.withSeconds') }}</span>
        <TimePicker v-model="value3" :show-seconds="true" />
        <span class="demo-item-hint">{{ value3 || $t('demo.common.notSelected') }}</span>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.common.disabledState') }}</span>
        <TimePicker v-model="value4" disabled />
      </div>
    </y-card>

    <y-card :title="$t('demo.common.smallSize')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.common.small') }}</span>
        <TimePicker v-model="value5" size="small" clearable />
      </div>
    </y-card>

    <y-card :title="$t('demo.timePicker.defaultValue')" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">{{ $t('demo.timePicker.presetTime') }}</span>
        <TimePicker v-model="value6" :format="'HH:mm'" />
        <span class="demo-item-hint">{{ $t('demo.timePicker.formatHHmm') }}</span>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'
import { TimePicker } from 'yiz-ui'

const value1 = ref<string | null>(null)
const value2 = ref<string | null>('14:30:00')
const value3 = ref<string | null>('09:15:30')
const value4 = ref<string | null>('08:00:00')
const value5 = ref<string | null>(null)
const value6 = ref<string | null>('10:00')
</script>
