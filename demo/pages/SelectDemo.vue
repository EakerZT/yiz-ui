<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.select') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.select.desc') }}</p>

    <y-card :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-select v-model="v1" :options="opts" />
      <span class="demo-hint">值: {{ v1 }}</span>
    </y-card>

    <y-card :title="$t('demo.select.placeholder')" style="margin-top: 8px">
      <y-select v-model="v2" :options="opts" :placeholder="$t('demo.select.cityPlaceholder')" />
    </y-card>

    <y-card :title="$t('demo.common.clearable')" style="margin-top: 8px">
      <y-select v-model="v3" :options="opts" clearable />
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-select v-model="v4" :options="opts" disabled />
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <y-button-group>
        <y-select v-model="v5" :options="opts" />
        <y-select v-model="v6" :options="opts" size="small" />
      </y-button-group>
    </y-card>

    <y-card :title="$t('demo.common.event')" style="margin-top: 8px">
      <y-select v-model="v7" :options="opts" @change="onChange" />
      <span class="demo-hint">change 次数: {{ changeCount }}</span>
    </y-card>

    <y-card :title="$t('demo.select.search')" style="margin-top: 8px">
      <y-select v-model="v8" :options="opts" :search="onSearch" />
    </y-card>

    <y-card :title="$t('demo.common.slot')" style="margin-top: 8px">
      <y-select v-model="v9">
        <y-select-option :label="$t('demo.common.beijing')" value="beijing" />
        <y-select-option :label="$t('demo.common.shanghai')" value="shanghai" />
        <y-select-option :label="$t('demo.common.guangzhou')" value="guangzhou" />
        <y-select-option :label="$t('demo.common.shenzhen')" value="shenzhen" />
        <y-select-option :label="$t('demo.common.hangzhou')" value="hangzhou" />
      </y-select>
      <span class="demo-hint">值: {{ v9 }}</span>
    </y-card>

    <y-card :title="$t('demo.common.customRender')" style="margin-top: 8px">
      <y-select v-model="v10" :options="opts">
        <template #option="{ option, selected }">
          <span :style="{ color: selected ? 'var(--yiz-color-primary)' : '#333' }">
            {{ option.label }}
            <span v-if="selected" style="margin-left:4px;font-size:12px">✓</span>
          </span>
        </template>
      </y-select>
      <span class="demo-hint">值: {{ v10 }}</span>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

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
const v6 = ref()
const v7 = ref()
const v8 = ref()
const v9 = ref()
const v10 = ref()

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
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
