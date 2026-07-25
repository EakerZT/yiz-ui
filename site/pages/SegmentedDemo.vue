<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.segmented.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.segmented.desc') }}</p>

    <demo-card :source-index="0" :title="$t('demo.common.basicShort')" style="margin-top: 8px">
      <y-segmented v-model:value="basic" :options="periodOptions" />
      <span class="demo-hint">{{ $t('demo.segmented.currentValue', { value: basic }) }}</span>
    </demo-card>

    <demo-card :source-index="1" :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <div class="demo-segmented-stack">
        <y-segmented v-model:value="disabledItem" :options="disabledOptions" />
        <y-segmented v-model:value="disabledGroup" :options="periodOptions" disabled />
      </div>
    </demo-card>

    <demo-card :source-index="2" :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-segmented-stack">
        <y-radio-button-group v-model:value="segmentedSize" :options="sizeOptions" />
        <y-segmented v-model:value="sizeValue" :options="periodOptions" :size="segmentedSize" />
      </div>
    </demo-card>

    <demo-card :source-index="3" :title="$t('demo.segmented.shape')" style="margin-top: 8px">
      <div class="demo-segmented-stack">
        <y-radio-button-group v-model:value="shapeSize" :options="sizeOptions" />
        <y-segmented v-model:value="shapeBlock" :options="periodOptions" :size="shapeSize" />
        <y-segmented v-model:value="shapeRound" :options="periodOptions" shape="round" :size="shapeSize" />
      </div>
    </demo-card>

    <demo-card :source-index="4" :title="$t('demo.segmented.block')" style="margin-top: 8px">
      <div class="demo-segmented-block">
        <y-segmented v-model:value="block" :options="viewOptions" block />
      </div>
    </demo-card>

    <demo-card :source-index="5" :title="$t('demo.common.customRender')" style="margin-top: 8px">
      <y-segmented v-model:value="renderValue" :options="statusOptions">
        <template #render="{ option, selected }">
          <span class="demo-segmented-render" :class="{ 'demo-segmented-render-selected': selected }">
            <span class="demo-segmented-dot" />
            {{ option.label }}
          </span>
        </template>
      </y-segmented>
    </demo-card>

    <demo-card :source-index="6" :title="$t('demo.common.event')" style="margin-top: 8px">
      <y-segmented v-model:value="eventValue" :options="periodOptions" @change="onChange" />
      <span class="demo-hint">{{ $t('demo.segmented.changeCount', { count: changeCount }) }}</span>
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { computed, ref } from 'vue'

const periodOptions = computed(() => [
  { label: $t('demo.segmented.day'), value: 'day' },
  { label: $t('demo.segmented.week'), value: 'week' },
  { label: $t('demo.segmented.month'), value: 'month' },
  { label: $t('demo.segmented.year'), value: 'year' },
])

const disabledOptions = computed(() => [
  { label: $t('demo.segmented.day'), value: 'day' },
  { label: $t('demo.segmented.week'), value: 'week', disabled: true },
  { label: $t('demo.segmented.month'), value: 'month' },
])

const viewOptions = computed(() => [
  { label: $t('demo.segmented.list'), value: 'list' },
  { label: $t('demo.segmented.card'), value: 'card' },
  { label: $t('demo.segmented.chart'), value: 'chart' },
])

const statusOptions = computed(() => [
  { label: $t('demo.segmented.processing'), value: 'processing' },
  { label: $t('demo.segmented.done'), value: 'done' },
  { label: $t('demo.segmented.failed'), value: 'failed' },
])

const basic = ref('week')
const disabledItem = ref('month')
const disabledGroup = ref('week')
const sizeValue = ref('week')
const segmentedSize = ref<'small' | 'default' | 'large'>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
const shapeBlock = ref('day')
const shapeRound = ref('week')
const shapeSize = ref<'small' | 'default' | 'large'>('default')
const block = ref('card')
const renderValue = ref('processing')
const eventValue = ref('day')
const changeCount = ref(0)

function onChange() {
  changeCount.value++
}
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
  vertical-align: middle;
}

.demo-segmented-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.demo-segmented-block {
  width: 360px;
  max-width: 100%;
}

.demo-segmented-render {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.demo-segmented-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #bfbfbf;
}

.demo-segmented-render-selected .demo-segmented-dot {
  background: var(--yiz-color-primary);
}
</style>
