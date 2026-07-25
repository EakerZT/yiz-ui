<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.checkbox.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.checkbox.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-button-group>
        <y-checkbox v-model:checked="checked1">{{ $t('demo.checkbox.optionA') }}</y-checkbox>
        <y-checkbox v-model:checked="checked2">{{ $t('demo.checkbox.optionB') }}</y-checkbox>
      </y-button-group>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.checkbox.defaultChecked')" style="margin-top: 8px">
      <y-checkbox v-model:checked="checked1">{{ $t('demo.checkbox.defaultChecked') }}</y-checkbox>
      <span class="demo-hint">A: {{ checked1 }}, B: {{ checked2 }}</span>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-button-group>
        <y-checkbox v-model:checked="checked3" disabled>{{ $t('demo.common.unselectedDisabled') }}</y-checkbox>
        <y-checkbox v-model:checked="checked4" disabled>{{ $t('demo.common.selectedDisabled') }}</y-checkbox>
      </y-button-group>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.common.slot')" style="margin-top: 8px">
      <y-checkbox v-model:checked="checked2">
        <span style="color: var(--yiz-color-primary)">{{ $t('demo.common.customSlotContent') }}</span>
      </y-checkbox>
    </demo-card>

    <demo-card :source-index="4" :title="$t('demo.card.border')" style="margin-top: 8px">
      <y-button-group>
        <y-checkbox v-model:checked="borderChecked1" border>{{ $t('demo.checkbox.optionA') }}</y-checkbox>
        <y-checkbox v-model:checked="borderChecked2" border>{{ $t('demo.checkbox.optionB') }}</y-checkbox>
      </y-button-group>
    </demo-card>

    <demo-card :source-index="5" :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-checkbox-stack">
        <y-checkbox v-model:checked="borderSizeSmall" border size="small">{{ $t('demo.common.smallSize') }}</y-checkbox>
        <y-checkbox v-model:checked="borderSizeDefault" border>{{ $t('demo.common.defaultSize') }}</y-checkbox>
        <y-checkbox v-model:checked="borderSizeLarge" border size="large">{{ $t('demo.common.largeSize') }}</y-checkbox>
      </div>
    </demo-card>
  </section>

  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.checkbox.groupTitle') }}</h2>

    <demo-card :source-index="6" :title="$t('demo.common.horizontal')" style="margin-top: 8px">
      <y-checkbox-group v-model:value="group1" :options="groupOptions" direction="horizontal" />
      <span class="demo-hint">{{ group1 }}</span>
    </demo-card>

    <demo-card :source-index="7" :title="$t('demo.common.vertical')" style="margin-top: 8px">
      <y-checkbox-group v-model:value="group2" :options="groupOptions" direction="vertical" />
      <span class="demo-hint">{{ group2 }}</span>
    </demo-card>

    <demo-card :source-index="8" :title="$t('demo.checkbox.free')" style="margin-top: 8px">
      <y-checkbox-group v-model:value="group3" direction="free">
        <div>
          <div style="font-size: 13px; color: #999; margin-bottom: 4px">{{ $t('demo.checkbox.group1') }}</div>
          <y-checkbox value="apple">Apple</y-checkbox>
          <y-checkbox value="banana">Banana</y-checkbox>
        </div>
        <div>
          <div style="font-size: 13px; color: #999; margin-bottom: 4px">{{ $t('demo.checkbox.group2') }}</div>
          <y-checkbox value="orange">Orange</y-checkbox>
          <y-checkbox value="mango">{{ $t('demo.checkbox.optionC') }}</y-checkbox>
        </div>
      </y-checkbox-group>
      <span class="demo-hint">{{ group3 }}</span>
    </demo-card>

    <demo-card :source-index="9" :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-checkbox-group v-model:value="group4" :options="groupOptions" disabled />
    </demo-card>

    <demo-card :source-index="10" :title="$t('demo.common.slot')" style="margin-top: 8px">
      <y-checkbox-group v-model:value="slotGroup" direction="horizontal">
        <y-checkbox value="a">{{ $t('demo.checkbox.customA') }}</y-checkbox>
        <y-checkbox value="b">{{ $t('demo.checkbox.customB') }}</y-checkbox>
        <y-checkbox value="c">{{ $t('demo.checkbox.customC') }}</y-checkbox>
      </y-checkbox-group>
      <span class="demo-hint">{{ slotGroup }}</span>
    </demo-card>

    <demo-card :source-index="11" :title="$t('demo.card.border')" style="margin-top: 8px">
      <y-checkbox-group v-model:value="borderGroup" :options="groupOptions" border />
      <span class="demo-hint">{{ borderGroup }}</span>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

const checked1 = ref(true)
const checked2 = ref(false)
const checked3 = ref(false)
const checked4 = ref(true)
const borderChecked1 = ref(false)
const borderChecked2 = ref(true)
const borderSizeSmall = ref(true)
const borderSizeDefault = ref(true)
const borderSizeLarge = ref(true)

const groupOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
]

const group1 = ref<string[]>([])
const group2 = ref(['apple', 'orange'])
const group3 = ref<string[]>([])
const group4 = ref(['banana'])
const borderGroup = ref(['banana'])

const slotGroup = ref(['a', 'c'])
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}

.demo-checkbox-stack {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
</style>
