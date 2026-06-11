<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Switch 开关</h2>
    <p class="demo-section-desc">用于在两种状态间切换的选择器。</p>

    <y-card title="基本" style="margin-top: 8px">
      <y-switch v-model="v1" />
      <span class="demo-hint">{{ v1 ? '开' : '关' }}</span>
    </y-card>

    <y-card title="禁用" style="margin-top: 8px">
      <y-button-group>
        <y-switch v-model="v2" disabled />
        <y-switch v-model="v3" disabled />
      </y-button-group>
    </y-card>

    <y-card title="尺寸" style="margin-top: 8px">
      <y-button-group>
        <y-switch v-model="v4" />
        <y-switch v-model="v5" size="small" />
      </y-button-group>
    </y-card>

    <y-card title="自定义色" style="margin-top: 8px">
      <y-button-group>
        <y-switch v-model="v6" color="#67c23a" />
        <y-switch v-model="v7" color="#ff4d4f" />
      </y-button-group>
    </y-card>

    <y-card title="加载中" style="margin-top: 8px">
      <y-switch v-model="v8" loading />
    </y-card>

    <y-card title="事件" style="margin-top: 8px">
      <y-switch v-model="v9" @change="onChange" />
      <span class="demo-hint">切换次数：{{ changeCount }}</span>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const v1 = ref(true)
const v2 = ref(false)
const v3 = ref(true)
const v4 = ref(true)
const v5 = ref(true)
const v6 = ref(true)
const v7 = ref(true)
const v8 = ref(true)
const v9 = ref(true)
const changeCount = ref(0)

function onChange() {
  changeCount.value++
}
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
  vertical-align: middle;
}
</style>
