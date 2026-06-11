<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Checkbox 复选框</h2>
    <p class="demo-section-desc">支持 v-model:checked 双向绑定、插槽文本、disabled 状态。</p>

    <y-card title="基本" style="margin-top: 8px">
      <y-button-group>
        <y-checkbox v-model:checked="checked1">选项 A</y-checkbox>
        <y-checkbox v-model:checked="checked2">选项 B</y-checkbox>
      </y-button-group>
    </y-card>

    <y-card title="默认选中" style="margin-top: 8px">
      <y-checkbox v-model:checked="checked1">默认选中</y-checkbox>
      <span class="demo-hint">A: {{ checked1 }}, B: {{ checked2 }}</span>
    </y-card>

    <y-card title="Disabled" style="margin-top: 8px">
      <y-button-group>
        <y-checkbox v-model:checked="checked3" disabled>未选禁用</y-checkbox>
        <y-checkbox v-model:checked="checked4" disabled>已选禁用</y-checkbox>
      </y-button-group>
    </y-card>

    <y-card title="插槽" style="margin-top: 8px">
      <y-checkbox v-model:checked="checked2">
        <span style="color: var(--yiz-color-primary)">自定义插槽内容</span>
      </y-checkbox>
    </y-card>
  </section>

  <section class="demo-section">
    <h2 class="demo-section-title">CheckboxGroup 复选框组</h2>
    <p class="demo-section-desc">通过 <code>options</code> 传入选项数组，<code>v-model:value</code> 绑定选中值数组，<code>direction</code> 控制排列方向。也支持插槽方式手动放置子元素。</p>

    <y-card title="横向" style="margin-top: 8px">
      <y-checkbox-group v-model:value="group1" :options="groupOptions" direction="horizontal" />
      <span class="demo-hint">{{ group1 }}</span>
    </y-card>

    <y-card title="竖向" style="margin-top: 8px">
      <y-checkbox-group v-model:value="group2" :options="groupOptions" direction="vertical" />
      <span class="demo-hint">{{ group2 }}</span>
    </y-card>

    <y-card title="自由" style="margin-top: 8px">
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
      <span class="demo-hint">{{ group3 }}</span>
    </y-card>

    <y-card title="Disabled" style="margin-top: 8px">
      <y-checkbox-group v-model:value="group4" :options="groupOptions" disabled />
    </y-card>

    <y-card title="插槽" style="margin-top: 8px">
      <y-checkbox-group v-model:value="slotGroup" direction="horizontal">
        <y-checkbox value="a">自定义 A</y-checkbox>
        <y-checkbox value="b">自定义 B</y-checkbox>
        <y-checkbox value="c">自定义 C</y-checkbox>
      </y-checkbox-group>
      <span class="demo-hint">{{ slotGroup }}</span>
    </y-card>
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

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
