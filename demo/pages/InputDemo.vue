<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Input 输入框</h2>
    <p class="demo-section-desc">支持 v-model 双向绑定、clearable 清空、prefix/suffix 前后缀。</p>

    <y-card title="基本" style="margin-top: 8px">
      <y-input v-model:value="inputText" placeholder="请输入内容" />
      <span class="demo-hint">当前值：{{ inputText || '空' }}</span>
    </y-card>

    <y-card title="可清空" style="margin-top: 8px">
      <y-input v-model:value="clearText" placeholder="可清空" clearable />
    </y-card>

    <y-card title="前缀 / 后缀" style="margin-top: 8px">
      <y-button-group direction="vertical" size="small">
        <y-input v-model:value="affixText" placeholder="prop 方式">
          <template #prefix>
            <y-icon :icon="Flash20Regular" />
          </template>
          <template #suffix>.com</template>
        </y-input>
      </y-button-group>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Flash20Regular } from '@vicons/fluent'

const inputText = ref('')
const clearText = ref('')
const affixText = ref('')
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
