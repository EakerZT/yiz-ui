<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Checkbox 复选框</h2>
    <p class="demo-section-desc">支持 v-model:checked 双向绑定、插槽文本、disabled 状态。</p>

    <div class="demo-row">
      <span class="demo-label">基础</span>
      <div class="demo-items">
        <span class="demo-item"><y-checkbox v-model:checked="checked1">选项 A</y-checkbox></span>
        <span class="demo-item"><y-checkbox v-model:checked="checked2">选项 B</y-checkbox></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">默认选中</span>
      <div class="demo-items">
        <span class="demo-item"><y-checkbox v-model:checked="checked1">默认选中</y-checkbox></span>
        <span class="demo-item demo-item-hint">A: {{ checked1 }}, B: {{ checked2 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">Disabled</span>
      <div class="demo-items">
        <span class="demo-item"><y-checkbox v-model:checked="checked3" disabled>未选禁用</y-checkbox></span>
        <span class="demo-item"><y-checkbox v-model:checked="checked4" disabled>已选禁用</y-checkbox></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">插槽</span>
      <div class="demo-items">
        <span class="demo-item">
          <y-checkbox v-model:checked="checked2">
            <span style="color: var(--yiz-color-primary)">自定义插槽内容</span>
          </y-checkbox>
        </span>
      </div>
    </div>
  </section>

  <section class="demo-section">
    <h2 class="demo-section-title">CheckboxGroup 复选框组</h2>
    <p class="demo-section-desc">通过 <code>options</code> 传入选项数组，<code>v-model:value</code> 绑定选中值数组，<code>direction</code> 控制排列方向。也支持插槽方式手动放置子元素，组件的 <code>v-model:value</code> 统一管理选中值。</p>

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
        <y-checkbox-group v-model:value="group3" direction="free">
          <div>
            <div style="font-size:13px;color:#999;margin-bottom:4px;">分组一</div>
            <y-checkbox value="apple">Apple</y-checkbox>
            <y-checkbox value="banana">Banana</y-checkbox>
          </div>
          <div>
            <div style="font-size:13px;color:#999;margin-bottom:4px;">分组二</div>
            <y-checkbox value="orange">Orange</y-checkbox>
            <y-checkbox value="mango">Mango</y-checkbox>
          </div>
        </y-checkbox-group>
        <span class="demo-item-hint">{{ group3 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">Disabled</span>
      <div class="demo-items">
        <y-checkbox-group v-model:value="group4" :options="groupOptions" disabled />
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">插槽</span>
      <div class="demo-items">
        <y-checkbox-group v-model:value="slotGroup" direction="horizontal">
          <y-checkbox value="a">自定义 A</y-checkbox>
          <y-checkbox value="b">自定义 B</y-checkbox>
          <y-checkbox value="c">自定义 C</y-checkbox>
        </y-checkbox-group>
        <span class="demo-item-hint">{{ slotGroup }}</span>
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

const slotGroup = ref(['a', 'c'])


</script>
