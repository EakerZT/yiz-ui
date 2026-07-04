<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.select') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.select.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-select v-model:value="v1" :options="opts" />
      <span class="demo-hint">{{ $t('demo.select.value', { value: v1 }) }}</span>
    </y-card>

    <y-card :title="$t('demo.select.placeholder')" style="margin-top: 8px">
      <y-select v-model:value="v2" :options="opts" :placeholder="$t('demo.select.cityPlaceholder')" />
    </y-card>

    <y-card :title="$t('demo.common.clearable')" style="margin-top: 8px">
      <y-select v-model:value="v3" :options="opts" clearable />
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-select v-model:value="v4" :options="opts" disabled />
    </y-card>

    <y-card :title="$t('demo.common.prefixSuffix')" style="margin-top: 8px">
      <y-select v-model:value="v11" :options="opts" prefix="City" suffix="CN" clearable />
      <span class="demo-hint">{{ $t('demo.select.value', { value: v11 ?? $t('demo.common.empty') }) }}</span>
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-select-size-panel">
        <y-radio-button-group v-model:value="selectSize" :options="sizeOptions" />
        <y-select v-model:value="v5" :options="opts" :size="selectSize" />
      </div>
    </y-card>

    <y-card :title="$t('demo.common.event')" style="margin-top: 8px">
      <y-select v-model:value="v7" :options="opts" @change="onChange" />
      <span class="demo-hint">{{ $t('demo.select.changeCount', { count: changeCount }) }}</span>
    </y-card>

    <y-card :title="$t('demo.select.search')" style="margin-top: 8px">
      <y-select v-model:value="v8" :options="opts" :search="onSearch" />
    </y-card>

    <y-card :title="$t('demo.common.slot')" style="margin-top: 8px">
      <y-select v-model:value="v9">
        <y-select-option :label="$t('demo.common.beijing')" value="beijing" />
        <y-select-option :label="$t('demo.common.shanghai')" value="shanghai" :disabled="shanghaiDisabled" />
        <y-select-option :label="$t('demo.common.guangzhou')" value="guangzhou" />
        <y-select-option :label="$t('demo.common.shenzhen')" value="shenzhen" />
        <y-select-option :label="$t('demo.common.hangzhou')" value="hangzhou" />
      </y-select>
      <y-button style="margin-left: 8px" @click="shanghaiDisabled = !shanghaiDisabled">
        {{ shanghaiDisabled ? $t('demo.common.enabled') : $t('demo.common.disabled') }}
      </y-button>
      <span class="demo-hint">{{ $t('demo.select.value', { value: v9 }) }}</span>
    </y-card>

    <y-card :title="$t('demo.common.customRender')" style="margin-top: 8px">
      <y-select v-model:value="v10" :options="opts">
        <template #option="{ option, selected }">
          <span :style="{ color: selected ? 'var(--yiz-color-primary)' : '#333' }">
            {{ option.label }}
            <span v-if="selected" style="margin-left: 4px; font-size: 12px">✓</span>
          </span>
        </template>
      </y-select>
      <span class="demo-hint">{{ $t('demo.select.value', { value: v10 }) }}</span>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const opts = [
  { label: $t('demo.common.beijing'), value: 'beijing' },
  { label: $t('demo.common.shanghai'), value: 'shanghai' },
  { label: $t('demo.common.guangzhou'), value: 'guangzhou' },
  { label: $t('demo.common.shenzhen'), value: 'shenzhen' },
  { label: $t('demo.common.hangzhou'), value: 'hangzhou' },
]

const v1 = ref()
const v2 = ref()
const v3 = ref()
const v4 = ref()
const v5 = ref()
const v7 = ref()
const v8 = ref()
const v9 = ref()
const v10 = ref()
const v11 = ref()
const shanghaiDisabled = ref(true)
const selectSize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]

const changeCount = ref(0)
function onChange(_val: any) {
  changeCount.value++
}

function onSearch(query: string) {
  return opts.filter((o) => o.label.includes(query))
}
</script>

<style scoped>
.demo-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}

.demo-select-size-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
