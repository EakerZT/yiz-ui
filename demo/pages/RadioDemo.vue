<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Radio 单选框</h2>
    <p class="demo-section-desc">支持 v-model 双向绑定、label 文本、disabled 状态。</p>

    <div class="demo-row">
      <span class="demo-label">基础</span>
      <div class="demo-items">
        <y-radio v-model="radio1" value="a" label="选项 A" />
        <y-radio v-model="radio1" value="b" label="选项 B" />
        <span class="demo-item-hint">{{ radio1 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">Disabled</span>
      <div class="demo-items">
        <y-radio v-model="radio2" value="a" disabled label="未选禁用" />
        <y-radio v-model="radio2" value="b" disabled label="已选禁用" />
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">插槽</span>
      <div class="demo-items">
        <y-radio v-model="radio3" value="x">
          <span style="color: var(--yiz-color-primary)">自定义插槽</span>
        </y-radio>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="demo-section-title">RadioGroup 单选框组</h2>
    <p class="demo-section-desc">通过 <code>options</code> 传入选项数组，<code>v-model:value</code> 绑定选中值，<code>direction</code> 控制排列方向。</p>

    <div class="demo-row">
      <span class="demo-label">横向</span>
      <div class="demo-items">
        <y-radio-group v-model:value="group1" :options="groupOptions" direction="horizontal" />
        <span class="demo-item-hint">{{ group1 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">竖向</span>
      <div class="demo-items">
        <y-radio-group v-model:value="group2" :options="groupOptions" direction="vertical" />
        <span class="demo-item-hint">{{ group2 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">Disabled</span>
      <div class="demo-items">
        <y-radio-group v-model:value="group3" :options="groupOptions" disabled />
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const radio1 = ref('a')
const radio2 = ref('b')
const radio3 = ref('x')

const groupOptions = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Orange', value: 'orange' },
]

const group1 = ref('apple')
const group2 = ref('banana')
const group3 = ref('orange')
</script>
