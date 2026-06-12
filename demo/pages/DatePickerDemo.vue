<template>
  <section class="demo-section">
    <h2 class="demo-section-title">DatePicker 日期选择</h2>
    <p class="demo-section-desc">用于选择日期，支持年月快速切换、今天标记、禁用日期等。</p>

    <y-card title="基础用法" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">选择日期</span>
        <DatePicker v-model="value1" />
        <span class="demo-item-hint">已选：{{ value1 ? fmt(value1) : '未选择' }}</span>
      </div>
    </y-card>

    <y-card title="可清空" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">带清除</span>
        <DatePicker v-model="value2" clearable />
        <span class="demo-item-hint">点击右侧 × 清除</span>
      </div>
    </y-card>

    <y-card title="禁用" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">禁用状态</span>
        <DatePicker v-model="value3" disabled />
      </div>
    </y-card>

    <y-card title="小尺寸" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">小号</span>
        <DatePicker v-model="value4" size="small" />
      </div>
    </y-card>

    <y-card title="禁用部分日期" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">限制范围</span>
        <DatePicker v-model="value5" :disabled-date="disabledDate" />
        <span class="demo-item-hint">只能选今天之后</span>
      </div>
    </y-card>

    <y-card title="自定义格式" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">年月日</span>
        <DatePicker v-model="value6" format="yyyy 年 MM 月 dd 日" placeholder="请选择" />
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { DatePicker } from 'yiz-ui'

const value1 = ref<Date | null>(null)
const value2 = ref<Date | null>(new Date())
const value3 = ref<Date | null>(new Date())
const value4 = ref<Date | null>(null)
const value5 = ref<Date | null>(null)
const value6 = ref<Date | null>(new Date())

function fmt(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function disabledDate(d: Date): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return d.getTime() < today.getTime()
}
</script>
