<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Checkbox 复选框</h2>
    <p class="demo-section-desc">支持 v-model 双向绑定、label 文本、disabled 状态。</p>

    <div class="demo-row">
      <span class="demo-label">基础</span>
      <div class="demo-items">
        <span class="demo-item"><y-checkbox v-model:value="checked1" label="选项 A" /></span>
        <span class="demo-item"><y-checkbox v-model:value="checked2" label="选项 B" /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">默认选中</span>
      <div class="demo-items">
        <span class="demo-item"><y-checkbox v-model:value="checked1" label="默认选中" /></span>
        <span class="demo-item demo-item-hint">A: {{ checked1 }}, B: {{ checked2 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">Disabled</span>
      <div class="demo-items">
        <span class="demo-item"><y-checkbox v-model:value="checked3" disabled label="未选禁用" /></span>
        <span class="demo-item"><y-checkbox v-model:value="checked4" disabled label="已选禁用" /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">插槽</span>
      <div class="demo-items">
        <span class="demo-item">
          <y-checkbox v-model:value="checked2">
            <span style="color: var(--yiz-color-primary)">自定义插槽内容</span>
          </y-checkbox>
        </span>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="demo-section-title">CheckboxGroup 复选框组</h2>
    <p class="demo-section-desc">通过 <code>options</code> 传入选项数组，<code>v-model:value</code> 绑定选中值数组，<code>direction</code> 控制排列方向。</p>

    <div class="demo-row">
      <span class="demo-label">横向</span>
      <div class="demo-items">
        <y-checkbox-group v-model:value="group1" :options="groupOptions" direction="horizontal" />
        <span class="demo-item-hint">{{ group1 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">竖向</span>
      <div class="demo-items">
        <y-checkbox-group v-model:value="group2" :options="groupOptions" direction="vertical" />
        <span class="demo-item-hint">{{ group2 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">自由</span>
      <div class="demo-items" style="flex-direction: column; align-items: flex-start; gap: 12px;">
        <div>
          <div style="font-size:13px;color:#999;margin-bottom:4px;">分组一</div>
          <y-checkbox-group v-model:value="group3" :options="freeOptions1" direction="free" />
        </div>
        <div>
          <div style="font-size:13px;color:#999;margin-bottom:4px;">分组二</div>
          <y-checkbox-group v-model:value="group3" :options="freeOptions2" direction="free" />
        </div>
        <span class="demo-item-hint">{{ group3 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">Disabled</span>
      <div class="demo-items">
        <y-checkbox-group v-model:value="group4" :options="groupOptions" disabled />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const checked1 = ref(true)
const checked2 = ref(false)
const checked3 = ref(false)
const checked4 = ref(true)

const groupOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
]

const group1 = ref<string[]>([])
const group2 = ref(['apple', 'orange'])
const group3 = ref<string[]>([])
const group4 = ref(['banana'])

const freeOptions1 = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
]
const freeOptions2 = [
  { label: 'Orange', value: 'orange' },
  { label: 'Mango', value: 'mango' },
]
</script>
