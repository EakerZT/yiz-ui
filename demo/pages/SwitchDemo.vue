<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Switch 开关</h2>
    <p class="demo-section-desc">用于在两种状态间切换的选择器。</p>

    <div class="demo-row">
      <span class="demo-label">基础</span>
      <div class="demo-items">
        <span class="demo-item"><y-switch v-model="v1" /></span>
        <span class="demo-item-hint">{{ v1 ? '开' : '关' }}</span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">禁用</span>
      <div class="demo-items">
        <span class="demo-item"><y-switch v-model="v2" disabled /></span>
        <span class="demo-item"><y-switch v-model="v3" disabled /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">尺寸</span>
      <div class="demo-items">
        <span class="demo-item"><y-switch v-model="v4" /></span>
        <span class="demo-item"><y-switch v-model="v5" size="small" /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">自定义色</span>
      <div class="demo-items">
        <span class="demo-item"><y-switch v-model="v6" color="#67c23a" /></span>
        <span class="demo-item"><y-switch v-model="v7" color="#ff4d4f" /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">加载</span>
      <div class="demo-items">
        <span class="demo-item"><y-switch v-model="v8" loading /></span>
      </div>
    </div>

    <div class="demo-row">
      <span class="demo-label">事件</span>
      <div class="demo-items">
        <span class="demo-item"><y-switch v-model="v9" @change="onChange" /></span>
        <span class="demo-item-hint">change 次数: {{ changeCount }}</span>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const v1 = ref(false)
const v2 = ref(false)
const v3 = ref(true)
const v4 = ref(true)
const v5 = ref(false)
const v6 = ref(true)
const v7 = ref(true)
const v8 = ref(true)
const v9 = ref(false)

const changeCount = ref(0)
function onChange(val: boolean) {
  changeCount.value++
}
</script>
