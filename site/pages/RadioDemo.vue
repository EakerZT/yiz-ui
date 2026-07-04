<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.radio.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.radio.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-radio v-model:checked="radio1A" value="a" :label="$t('demo.checkbox.optionA')" />
      <y-radio v-model:checked="radio1B" value="b" :label="$t('demo.checkbox.optionB')" />
      <span class="demo-hint">{{ radio1A }} / {{ radio1B }}</span>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-radio v-model:checked="radio2A" value="a" disabled :label="$t('demo.common.unselectedDisabled')" />
      <y-radio v-model:checked="radio2B" value="b" disabled :label="$t('demo.common.selectedDisabled')" />
    </y-card>

    <y-card :title="$t('demo.common.slot')" style="margin-top: 8px">
      <y-radio v-model:checked="radio3" value="x">
        <span style="color: var(--yiz-color-primary)">{{ $t('demo.common.customSlot') }}</span>
      </y-radio>
    </y-card>
  </section>

  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.radio.groupTitle') }}</h2>

    <y-card :title="$t('demo.common.horizontal')" style="margin-top: 8px">
      <y-radio-group v-model:value="group1" :options="groupOptions" direction="horizontal" />
      <span class="demo-hint">{{ group1 }}</span>
    </y-card>

    <y-card :title="$t('demo.common.vertical')" style="margin-top: 8px">
      <y-radio-group v-model:value="group2" :options="groupOptions" direction="vertical" />
      <span class="demo-hint">{{ group2 }}</span>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-radio-group v-model:value="group3" :options="groupOptions" disabled />
    </y-card>
  </section>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.radio.radioButton') }}</h2>

    <y-card :title="$t('demo.radio.standalone')" style="margin-top: 8px">
      <y-radio-button v-model:checked="buttonRadioLeft" value="left">{{ $t('demo.radio.left') }}</y-radio-button>
      <y-radio-button v-model:checked="buttonRadioRight" value="right">{{ $t('demo.radio.right') }}</y-radio-button>
      <span class="demo-hint">{{ buttonRadioLeft }} / {{ buttonRadioRight }}</span>
    </y-card>

    <y-card :title="$t('demo.radio.groupOptions')" style="margin-top: 8px">
      <y-radio-button-group v-model:value="buttonGroup1" :options="buttonOptions" />
      <span class="demo-hint">{{ buttonGroup1 }}</span>
    </y-card>

    <y-card :title="$t('demo.radio.slotGroup')" style="margin-top: 8px">
      <y-radio-button-group v-model:value="buttonGroup2">
        <y-radio-button value="day">{{ $t('demo.radio.day') }}</y-radio-button>
        <y-radio-button value="week">{{ $t('demo.radio.week') }}</y-radio-button>
        <y-radio-button value="month">{{ $t('demo.radio.month') }}</y-radio-button>
      </y-radio-button-group>
      <span class="demo-hint">{{ buttonGroup2 }}</span>
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-radio-button-stack">
        <y-radio-button-group v-model:value="radioButtonSize" :options="sizeOptions" />
        <y-radio-button-group v-model:value="buttonSizeValue" :options="buttonOptions" :size="radioButtonSize" />
      </div>
    </y-card>

    <y-card :title="$t('demo.common.customColor')" style="margin-top: 8px">
      <div class="demo-radio-button-stack">
        <y-radio-button-group
          v-model:value="buttonColor1"
          :options="buttonOptions"
          text-color="#ffffff"
          fill-color="#52c41a"
        />
        <y-radio-button-group v-model:value="buttonColor2">
          <y-radio-button value="day" text-color="#ffffff" fill-color="#faad14">{{
            $t('demo.radio.day')
          }}</y-radio-button>
          <y-radio-button value="week" text-color="#ffffff" fill-color="#ff4d4f">{{
            $t('demo.radio.week')
          }}</y-radio-button>
          <y-radio-button value="month" text-color="#ffffff" fill-color="#722ed1">
            {{ $t('demo.radio.month') }}
          </y-radio-button>
        </y-radio-button-group>
      </div>
    </y-card>

    <y-card :title="$t('demo.common.customRender')" style="margin-top: 8px">
      <y-radio-button-group v-model:value="buttonRender" :options="buttonOptions">
        <template #render="{ label, selected }">
          <span class="demo-radio-button-render" :class="{ 'demo-radio-button-render-selected': selected }">
            <span class="demo-radio-button-dot" />
            {{ label }}
          </span>
        </template>
      </y-radio-button-group>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-radio-button-group v-model:value="buttonGroup3" :options="buttonOptionsWithDisabled" />
      <y-radio-button-group v-model:value="buttonGroup4" :options="buttonOptions" disabled style="margin-left: 12px" />
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { computed, ref } from 'vue'

const radio1A = ref(true)
const radio1B = ref(false)
const radio2A = ref(false)
const radio2B = ref(true)
const radio3 = ref(true)

const groupOptions = computed(() => [
  { label: $t('demo.radio.apple'), value: 'apple' },
  { label: $t('demo.radio.banana'), value: 'banana' },
  { label: $t('demo.radio.orange'), value: 'orange' },
])

const group1 = ref('apple')
const group2 = ref('banana')
const group3 = ref('orange')

const buttonOptions = computed(() => [
  { label: $t('demo.radio.apple'), value: 'apple' },
  { label: $t('demo.radio.banana'), value: 'banana' },
  { label: $t('demo.radio.orange'), value: 'orange' },
])

const buttonOptionsWithDisabled = computed(() => [
  { label: $t('demo.radio.apple'), value: 'apple' },
  { label: $t('demo.radio.banana'), value: 'banana', disabled: true },
  { label: $t('demo.radio.orange'), value: 'orange' },
])

const buttonRadioLeft = ref(true)
const buttonRadioRight = ref(false)
const buttonGroup1 = ref('apple')
const buttonGroup2 = ref('week')
const buttonGroup3 = ref('orange')
const buttonGroup4 = ref('banana')
const buttonSizeValue = ref('banana')
const radioButtonSize = ref<'small' | 'default' | 'large'>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
const buttonColor1 = ref('apple')
const buttonColor2 = ref('week')
const buttonRender = ref('banana')
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}

.demo-radio-button-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.demo-radio-button-render {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.demo-radio-button-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #bfbfbf;
}

.demo-radio-button-render-selected .demo-radio-button-dot {
  background: currentColor;
}
</style>
