<template>
  <div class="select-overflow-demo">
    <div class="select-overflow-item">
      <span>{{ t('demo.select.maxTagCountLabel') }}</span>
      <y-select
        v-model:value="collapsedValue"
        class="select-overflow-control"
        :options="options"
        multiple
        :max-tag-count="2"
        clearable
      />
    </div>
    <div class="select-overflow-item">
      <span>{{ t('demo.select.scrollTagsLabel') }}</span>
      <y-select v-model:value="scrollValue" class="select-overflow-control" :options="options" multiple clearable />
    </div>
    <p>{{ t('demo.select.tagOverflowHint') }}</p>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const collapsedValue = ref(['beijing', 'shanghai', 'guangzhou', 'shenzhen', 'hangzhou'])
const scrollValue = ref(['beijing', 'shanghai', 'guangzhou', 'shenzhen', 'hangzhou', 'nanjing'])
const options = computed(() => [
  { label: t('demo.common.beijing'), value: 'beijing' },
  { label: t('demo.common.shanghai'), value: 'shanghai' },
  { label: t('demo.common.guangzhou'), value: 'guangzhou' },
  { label: t('demo.common.shenzhen'), value: 'shenzhen' },
  { label: t('demo.common.hangzhou'), value: 'hangzhou' },
  { label: t('demo.common.nanjing'), value: 'nanjing' },
])
</script>

<style scoped>
.select-overflow-demo {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.select-overflow-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.select-overflow-item > span {
  width: 120px;
  flex-shrink: 0;
  color: #666;
  font-size: 13px;
  text-align: right;
}
.select-overflow-control {
  width: 360px;
}
.select-overflow-demo p {
  margin-left: 132px;
  color: #999;
  font-size: 13px;
}
</style>
