<template>
  <section class="demo-section">
    <h2 class="demo-section-title">InputNumber 数字输入</h2>
    <p class="demo-section-desc">通过鼠标或键盘输入数值，可配合按钮或方向键增减。</p>

    <div class="demo-row">
      <span class="demo-label">基础</span>
      <div class="demo-items">
        <span class="demo-item"><y-input-number v-model="v1" /></span>
        <span class="demo-item-hint">值: {{ v1 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">步长</span>
      <div class="demo-items">
        <span class="demo-item"><y-input-number v-model="v2" :step="0.5" /></span>
        <span class="demo-item-hint">step=0.5，值: {{ v2 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">范围</span>
      <div class="demo-items">
        <span class="demo-item"><y-input-number v-model="v3" :min="0" :max="100" /></span>
        <span class="demo-item-hint">0 ~ 100，值: {{ v3 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">精度</span>
      <div class="demo-items">
        <span class="demo-item"><y-input-number v-model="v4" :step="0.1" :precision="1" /></span>
        <span class="demo-item-hint">precision=1，值: {{ v4 }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">尺寸</span>
      <div class="demo-items">
        <span class="demo-item"><y-input-number v-model="v5" /></span>
        <span class="demo-item"><y-input-number v-model="v6" size="small" /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">禁用</span>
      <div class="demo-items">
        <span class="demo-item"><y-input-number v-model="v7" disabled /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">无按钮</span>
      <div class="demo-items">
        <span class="demo-item"><y-input-number v-model="v8" :controls="false" /></span>
        <span class="demo-item"><y-input-number v-model="v8" :controls="false" align="center" /></span>
        <span class="demo-item"><y-input-number v-model="v8" :controls="false" align="right" /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">对齐</span>
      <div class="demo-items">
        <span class="demo-item"><y-input-number v-model="v9" /></span>
        <span class="demo-item"><y-input-number v-model="v9" align="center" /></span>
        <span class="demo-item"><y-input-number v-model="v9" align="right" /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">前后缀</span>
      <div class="demo-items">
        <span class="demo-item"><y-input-number v-model="v10" prefix="¥" /></span>
        <span class="demo-item"><y-input-number v-model="v10" suffix="元" /></span>
        <span class="demo-item"><y-input-number v-model="v10" prefix="$" suffix="USD" /></span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const v1 = ref<number | null>(0)
const v2 = ref<number | null>(0)
const v3 = ref<number | null>(50)
const v4 = ref<number | null>(0)
const v5 = ref<number | null>(0)
const v6 = ref<number | null>(0)
const v7 = ref<number | null>(0)
const v8 = ref<number | null>(0)
const v9 = ref<number | null>(0)
const v10 = ref<number | null>(0)
</script>
