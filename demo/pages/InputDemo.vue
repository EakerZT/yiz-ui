<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Input 输入框</h2>
    <p class="demo-section-desc">支持 v-model 双向绑定、clearable 清空、prefix/suffix 前后缀。</p>

    <div class="demo-row">
      <span class="demo-label">基础</span>
      <div class="demo-items">
        <span class="demo-item" style="width:260px"><y-input v-model:value="inputText" placeholder="请输入内容" /></span>
        <span class="demo-item demo-item-hint">当前值: {{ inputText || '(空)' }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">Clearable</span>
      <div class="demo-items">
        <span class="demo-item" style="width:260px"><y-input clearable v-model:value="clearText" placeholder="可清空" /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">Prefix / Suffix</span>
      <div class="demo-items">
        <span class="demo-item" style="width:260px">
          <y-input v-model:value="affixText" placeholder="prop 方式">
            <template #prefix><y-icon :icon="Flash20Regular" /></template>
            <template #suffix>.com</template>
          </y-input>
        </span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Flash20Regular } from '@vicons/fluent'

const inputText = ref('')
const clearText = ref('')
const affixText = ref('')
</script>
