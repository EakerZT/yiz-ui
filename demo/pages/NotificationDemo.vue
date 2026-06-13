<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Notification 通知</h2>
    <p class="demo-section-desc">悬浮通知提醒，通过函数调用展示全局反馈信息。</p>

    <y-card title="基础用法" style="margin-top: 8px">
      <y-button type="primary" @click="openBasic">打开通知</y-button>
    </y-card>

    <y-card title="不同类型" style="margin-top: 8px">
      <y-button-group>
        <y-button @click="openInfo">info</y-button>
        <y-button color="success" @click="openSuccess">success</y-button>
        <y-button color="warning" @click="openWarning">warning</y-button>
        <y-button color="error" @click="openError">error</y-button>
      </y-button-group>
    </y-card>

    <y-card title="不同位置" style="margin-top: 8px">
      <y-button-group>
        <y-button @click="openTopLeft">top-left</y-button>
        <y-button @click="openTopRight">top-right</y-button>
        <y-button @click="openBottomLeft">bottom-left</y-button>
        <y-button @click="openBottomRight">bottom-right</y-button>
      </y-button-group>
    </y-card>

    <y-card title="多条堆叠" style="margin-top: 8px">
      <y-button @click="openMultiple">连续打开 4 条</y-button>
    </y-card>

    <y-card title="不自动关闭" style="margin-top: 8px">
      <y-button @click="openManual">需要手动关闭</y-button>
    </y-card>

    <y-card title="自定义内容" style="margin-top: 8px">
      <y-button @click="openCustom">打开自定义通知</y-button>
    </y-card>

    <y-card title="close 事件" style="margin-top: 8px">
      <y-button @click="openCloseEvent">打开</y-button>
      <span class="demo-hint">关闭次数：{{ closeCount }}</span>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'
import { notification } from 'yiz-ui'

const closeCount = ref(0)

function openBasic() {
  notification({
    title: '系统通知',
    content: '这是一条基础通知，会在 4.5 秒后自动关闭。'
  })
}

function openInfo() {
  notification.info({
    title: '提示',
    content: '这是一条信息通知。'
  })
}

function openSuccess() {
  notification.success({
    title: '成功',
    content: '操作已成功完成。'
  })
}

function openWarning() {
  notification.warning({
    title: '警告',
    content: '请检查当前配置是否正确。'
  })
}

function openError() {
  notification.error({
    title: '错误',
    content: '操作失败，请稍后重试。'
  })
}

function openTopLeft() {
  notification({
    title: '左上角',
    content: '通知显示在左上角。',
    placement: 'top-left'
  })
}

function openTopRight() {
  notification({
    title: '右上角',
    content: '通知显示在右上角。',
    placement: 'top-right'
  })
}

function openBottomLeft() {
  notification({
    title: '左下角',
    content: '通知显示在左下角。',
    placement: 'bottom-left'
  })
}

function openBottomRight() {
  notification({
    title: '右下角',
    content: '通知显示在右下角。',
    placement: 'bottom-right'
  })
}

function openManual() {
  notification({
    title: '手动关闭',
    content: 'duration 设置为 0 时不会自动关闭。',
    duration: 0
  })
}

function openMultiple() {
  for (let i = 1; i <= 4; i++) {
    notification({
      title: `通知 ${i}`,
      content: `这是第 ${i} 条通知，用于观察多条通知的位置堆叠。`,
      type: i % 2 === 0 ? 'success' : 'info',
      duration: 5000
    })
  }
}

function openCustom() {
  notification.success({
    title: h('span', { style: 'color: var(--yiz-color-success)' }, '自定义标题'),
    content: h('div', [
      '可以通过函数参数传入 VNode 内容。',
      h('div', { style: 'margin-top: 8px; color: #999' }, '这条通知不会自动关闭。')
    ]),
    duration: 0
  })
}

function openCloseEvent() {
  notification({
    title: 'close 事件',
    content: '关闭时会触发 close 回调。',
    onClose: () => {
      closeCount.value++
    }
  })
}
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
