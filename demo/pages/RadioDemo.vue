<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Radio 单选框</h2>
    <p class="demo-section-desc">支持 v-model 双向绑定、label 文本、disabled 状态。</p>

    <y-card title="基本" style="margin-top: 8px">
      <y-radio v-model="radio1" value="a" label="选项 A" />
      <y-radio v-model="radio1" value="b" label="选项 B" />
      <span class="demo-hint">{{ radio1 }}</span>
    </y-card>

    <y-card title="Disabled" style="margin-top: 8px">
      <y-radio v-model="radio2" value="a" disabled label="未选禁用" />
      <y-radio v-model="radio2" value="b" disabled label="已选禁用" />
    </y-card>

    <y-card title="插槽" style="margin-top: 8px">
      <y-radio v-model="radio3" value="x">
        <span style="color: var(--yiz-color-primary)">自定义插槽</span>
      </y-radio>
    </y-card>
  </section>

  <section class="demo-section">
    <h2 class="demo-section-title">RadioGroup 单选框组</h2>
    <p class="demo-section-desc">通过 <code>options</code> 传入选项数组，<code>v-model:value</code> 绑定选中值，<code>direction</code> 控制排列方向。</p>

    <y-card title="横向" style="margin-top: 8px">
      <y-radio-group v-model:value="group1" :options="groupOptions" direction="horizontal" />
      <span class="demo-hint">{{ group1 }}</span>
    </y-card>

    <y-card title="竖向" style="margin-top: 8px">
      <y-radio-group v-model:value="group2" :options="groupOptions" direction="vertical" />
      <span class="demo-hint">{{ group2 }}</span>
    </y-card>

    <y-card title="Disabled" style="margin-top: 8px">
      <y-radio-group v-model:value="group3" :options="groupOptions" disabled />
    </y-card>
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

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
