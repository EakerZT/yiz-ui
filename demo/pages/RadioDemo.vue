<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.radio.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.radio.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-radio v-model="radio1" value="a" :label="$t('demo.checkbox.optionA')" />
      <y-radio v-model="radio1" value="b" :label="$t('demo.checkbox.optionB')" />
      <span class="demo-hint">{{ radio1 }}</span>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-radio v-model="radio2" value="a" disabled :label="$t('demo.common.unselectedDisabled')" />
      <y-radio v-model="radio2" value="b" disabled :label="$t('demo.common.selectedDisabled')" />
    </y-card>

    <y-card :title="$t('demo.common.slot')" style="margin-top: 8px">
      <y-radio v-model="radio3" value="x">
        <span style="color: var(--yiz-color-primary)">{{ $t('demo.common.customSlot') }}</span>
      </y-radio>
    </y-card>
  </section>

  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.radio.groupTitle') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.radio.groupDesc1') }} <code>options</code> {{ $t('demo.radio.groupDesc2') }}<code>v-model:value</code> {{ $t('demo.radio.groupDesc3') }}<code>direction</code> {{ $t('demo.radio.groupDesc4') }}</p>

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
    <p class="demo-section-desc">{{ $t('demo.radio.radioButtonDesc') }}</p>

    <y-card :title="$t('demo.radio.standalone')" style="margin-top: 8px">
      <y-radio-button v-model="buttonRadio1" value="left">{{ $t('demo.radio.left') }}</y-radio-button>
      <y-radio-button v-model="buttonRadio1" value="right">{{ $t('demo.radio.right') }}</y-radio-button>
      <span class="demo-hint">{{ buttonRadio1 }}</span>
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
        <y-radio-button-group v-model:value="buttonSize1" :options="buttonOptions" size="small" />
        <y-radio-button-group v-model:value="buttonSize2" :options="buttonOptions" />
        <y-radio-button-group v-model:value="buttonSize3" :options="buttonOptions" size="large" />
      </div>
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-radio-button-group v-model:value="buttonGroup3" :options="buttonOptionsWithDisabled" />
      <y-radio-button-group
        v-model:value="buttonGroup4"
        :options="buttonOptions"
        disabled
        style="margin-left: 12px"
      />
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { computed, ref } from 'vue'

const radio1 = ref('a')
const radio2 = ref('b')
const radio3 = ref('x')

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
  { label: $t('demo.radio.orange'), value: 'orange' }
])

const buttonOptionsWithDisabled = computed(() => [
  { label: $t('demo.radio.apple'), value: 'apple' },
  { label: $t('demo.radio.banana'), value: 'banana', disabled: true },
  { label: $t('demo.radio.orange'), value: 'orange' }
])

const buttonRadio1 = ref('left')
const buttonGroup1 = ref('apple')
const buttonGroup2 = ref('week')
const buttonGroup3 = ref('orange')
const buttonGroup4 = ref('banana')
const buttonSize1 = ref('apple')
const buttonSize2 = ref('banana')
const buttonSize3 = ref('orange')
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
</style>
