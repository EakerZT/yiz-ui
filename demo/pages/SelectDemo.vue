<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Select 下拉框</h2>
    <p class="demo-section-desc">从一组选项中选择一个值。</p>

    <div class="demo-row">
      <span class="demo-label">基础</span>
      <div class="demo-items">
        <span class="demo-item"><y-select v-model="v1" :options="opts" /></span>
        <span class="demo-item-hint">值: {{ v1 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">占位符</span>
      <div class="demo-items">
        <span class="demo-item"><y-select v-model="v2" :options="opts" placeholder="请选择城市" /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">可清空</span>
      <div class="demo-items">
        <span class="demo-item"><y-select v-model="v3" :options="opts" clearable /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">禁用</span>
      <div class="demo-items">
        <span class="demo-item"><y-select v-model="v4" :options="opts" disabled /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">尺寸</span>
      <div class="demo-items">
        <span class="demo-item"><y-select v-model="v5" :options="opts" /></span>
        <span class="demo-item"><y-select v-model="v6" :options="opts" size="small" /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">事件</span>
      <div class="demo-items">
        <span class="demo-item"><y-select v-model="v7" :options="opts" @change="onChange" /></span>
        <span class="demo-item-hint">change 次数: {{ changeCount }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">搜索</span>
      <div class="demo-items">
        <span class="demo-item"><y-select v-model="v8" :options="opts" :search="onSearch" /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">插槽</span>
      <div class="demo-items">
        <span class="demo-item">
          <y-select v-model="v9">
            <y-select-option label="北京" value="beijing" />
            <y-select-option label="上海" value="shanghai" />
            <y-select-option label="广州" value="guangzhou" />
            <y-select-option label="深圳" value="shenzhen" />
            <y-select-option label="杭州" value="hangzhou" />
          </y-select>
        </span>
        <span class="demo-item-hint">值: {{ v9 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">自定义渲染</span>
      <div class="demo-items">
        <span class="demo-item">
          <y-select v-model="v10" :options="opts">
            <template #option="{ option, selected }">
              <span :style="{ color: selected ? 'var(--yiz-color-primary)' : '#333' }">
                {{ option.label }}
                <span v-if="selected" style="margin-left:4px;font-size:12px">✓</span>
              </span>
            </template>
          </y-select>
        </span>
        <span class="demo-item-hint">值: {{ v10 }}</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const opts = [
  { label: '北京', value: 'beijing' },
  { label: '上海', value: 'shanghai' },
  { label: '广州', value: 'guangzhou' },
  { label: '深圳', value: 'shenzhen' },
  { label: '杭州', value: 'hangzhou' }
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
function onChange(val: any) {
  changeCount.value++
}

function onSearch(query: string) {
  return opts.filter((o) => o.label.includes(query))
}
</script>
