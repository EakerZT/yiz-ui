<template>
  <section class="demo-section">
    <h2 class="demo-section-title">TimePicker 时间选择</h2>
    <p class="demo-section-desc">用于选择时间，支持时分秒列选择、此刻快捷选项。</p>

    <y-card title="基础用法" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">选择时间</span>
        <TimePicker v-model="value1" />
        <span class="demo-item-hint">已选：{{ value1 || '未选择' }}</span>
      </div>
    </y-card>

    <y-card title="可清空" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">带清除</span>
        <TimePicker v-model="value2" clearable />
        <span class="demo-item-hint">点击右侧 × 清除</span>
      </div>
    </y-card>

    <y-card title="显示秒" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">含秒</span>
        <TimePicker v-model="value3" :show-seconds="true" />
        <span class="demo-item-hint">已选：{{ value3 || '未选择' }}</span>
      </div>
    </y-card>

    <y-card title="禁用" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">禁用状态</span>
        <TimePicker v-model="value4" disabled />
      </div>
    </y-card>

    <y-card title="小尺寸" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">小号</span>
        <TimePicker v-model="value5" size="small" clearable />
      </div>
    </y-card>

    <y-card title="默认值" style="margin-top: 8px">
      <div class="demo-row">
        <span class="demo-label">预设时间</span>
        <TimePicker v-model="value6" :format="'HH:mm'" />
        <span class="demo-item-hint">格式 HH:mm</span>
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { TimePicker } from 'yiz-ui'

const value1 = ref<string | null>(null)
const value2 = ref<string | null>('14:30:00')
const value3 = ref<string | null>('09:15:30')
const value4 = ref<string | null>('08:00:00')
const value5 = ref<string | null>(null)
const value6 = ref<string | null>('10:00')
</script>
