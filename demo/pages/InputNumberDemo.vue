<template>
  <section class="demo-section">
    <h2 class="demo-section-title">InputNumber 数字输入</h2>
    <p class="demo-section-desc">通过鼠标或键盘输入数值，可配合按钮或方向键增减。</p>

    <y-card title="基本" style="margin-top: 8px">
      <y-input-number v-model="v1" />
      <span class="demo-hint">当前值：{{ v1 }}</span>
    </y-card>

    <y-card title="步长" style="margin-top: 8px">
      <y-input-number v-model="v2" :step="0.5" />
      <span class="demo-hint">当前值：{{ v2 }}</span>
    </y-card>

    <y-card title="范围" style="margin-top: 8px">
      <y-input-number v-model="v3" :min="0" :max="100" />
      <span class="demo-hint">当前值：{{ v3 }}（范围 0 ~ 100）</span>
    </y-card>

    <y-card title="精度" style="margin-top: 8px">
      <y-input-number v-model="v4" :step="0.1" :precision="1" />
      <span class="demo-hint">当前值：{{ v4 }}</span>
    </y-card>

    <y-card title="尺寸" style="margin-top: 8px">
      <y-button-group>
        <y-input-number v-model="v5" />
        <y-input-number v-model="v6" size="small" />
      </y-button-group>
    </y-card>

    <y-card title="禁用" style="margin-top: 8px">
      <y-input-number v-model="v7" disabled />
    </y-card>

    <y-card title="无按钮" style="margin-top: 8px">
      <y-button-group>
        <y-input-number v-model="v8" :controls="false" />
        <y-input-number v-model="v8" :controls="false" align="center" />
        <y-input-number v-model="v8" :controls="false" align="right" />
      </y-button-group>
    </y-card>

    <y-card title="前后缀" style="margin-top: 8px">
      <y-button-group>
        <y-input-number v-model="v10" prefix="¥" />
        <y-input-number v-model="v10" suffix="元" />
        <y-input-number v-model="v10" prefix="$" suffix="USD" />
      </y-button-group>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const v1 = ref<number | null>(0)
const v2 = ref<number | null>(0)
const v3 = ref<number | null>(0)
const v4 = ref<number | null>(0)
const v5 = ref<number | null>(0)
const v6 = ref<number | null>(0)
const v7 = ref<number | null>(0)
const v8 = ref<number | null>(0)
const v10 = ref<number | null>(0)
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
