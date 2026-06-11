<template>
  <section class="demo-section">
    <h2 class="demo-section-title">ScrollBox 滚动框</h2>
    <p class="demo-section-desc">提供固定高度区域的滚动容器，自定义 track + thumb 滚动条，支持拖拽和点击定位。</p>

    <y-card title="基础用法" style="margin-top: 8px">
      <ScrollBox :height="120" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">第 {{ i }} 行内容，用于演示滚动效果。</p>
      </ScrollBox>
    </y-card>

    <y-card title="最大高度" style="margin-top: 8px">
      <ScrollBox :max-height="150" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 10" :key="i" style="margin-bottom: 8px; color: #666">
          内容行 {{ i }}，超出 max-height 时出现滚动条。
        </p>
      </ScrollBox>
    </y-card>

    <y-card title="横向滚动" style="margin-top: 8px">
      <ScrollBox :height="80" style="width: 360px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <div style="white-space: nowrap">
          <span v-for="i in 12" :key="i" class="demo-h-item">项 {{ i }}</span>
        </div>
      </ScrollBox>
    </y-card>

    <y-card title="卡片内嵌" style="margin-top: 8px">
      <Card title="滚动列表" style="width: 360px">
        <ScrollBox :height="160">
          <div
            v-for="i in 6"
            :key="i"
            style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333"
          >
            列表项 {{ i }}
          </div>
        </ScrollBox>
      </Card>
    </y-card>

    <y-card title="autoHide: never (默认)" style="margin-top: 8px">
      <p style="margin-bottom: 12px; font-size: 13px; color: #888">滚动条始终可见（出现溢出时）。</p>
      <ScrollBox :height="120" auto-hide="never" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">第 {{ i }} 行内容，滚动条始终可见。</p>
      </ScrollBox>
    </y-card>

    <y-card title="autoHide: scroll (滚动后自动隐藏)" style="margin-top: 8px">
      <p style="margin-bottom: 12px; font-size: 13px; color: #888">滚动时显示，停止滚动 {{ 1300 }}ms 后自动隐藏。</p>
      <ScrollBox :height="120" auto-hide="scroll" :auto-hide-delay="1300" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">滚动一下试试，滚动条会在停止滚动后自动隐藏。</p>
      </ScrollBox>
    </y-card>

    <y-card title="autoHide: move (鼠标移动时显示)" style="margin-top: 8px">
      <p style="margin-bottom: 12px; font-size: 13px; color: #888">鼠标在容器内移动时显示，停止移动 {{ 800 }}ms 后自动隐藏。</p>
      <ScrollBox :height="120" auto-hide="move" :auto-hide-delay="800" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">移动鼠标到这片区域，滚动条会出现；鼠标静止则隐藏。</p>
      </ScrollBox>
    </y-card>

    <y-card title="autoHide: leave (鼠标离开时隐藏)" style="margin-top: 8px">
      <p style="margin-bottom: 12px; font-size: 13px; color: #888">鼠标进入容器时显示，离开后 {{ 600 }}ms 自动隐藏。</p>
      <ScrollBox :height="120" auto-hide="leave" :auto-hide-delay="600" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">鼠标移入显示滚动条，移出后滚动条消失。拖拽滚动条时不会消失。</p>
      </ScrollBox>
    </y-card>

    <y-card title="自定义主题" style="margin-top: 8px">
      <p style="margin-bottom: 12px; font-size: 13px; color: #888">通过 theme 属性设置自定义类名，覆盖滚动条的 CSS 变量。</p>
      <ScrollBox :height="120" theme="demo-scroll-theme" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">第 {{ i }} 行内容，蓝色主题滚动条。</p>
      </ScrollBox>
    </y-card>

    <y-card title="拖动外框 — 滚动条的动态出现与消失" style="margin-top: 8px">
      <p style="margin-bottom: 12px; font-size: 13px; color: #888">
        拖拽右下角的蓝色手柄改变容器尺寸，观察滚动条在内容溢出时出现、不溢出时消失。当前尺寸：<b>{{ boxWidth }} × {{ boxHeight }}</b>
      </p>
      <div
        class="demo-resize-wrapper"
        :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"
      >
        <ScrollBox class="demo-resize-scrollbox">
          <p
            v-for="i in 8"
            :key="i"
            style="margin-bottom: 8px; color: #555; white-space: nowrap"
          >
            第 {{ i }} 行 — 拖动手柄缩小宽度试试看横向滚动条。
          </p>
          <p style="color: #999; margin-top: 16px; white-space: nowrap">
            这是一段很长的横向内容，用来演示水平滚动条的动态出现……
          </p>
        </ScrollBox>
        <div
          class="demo-resize-handle"
          @pointerdown.stop="onResizeStart"
        />
      </div>
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue'
import { Card, ScrollBox } from 'yiz-ui'

const boxWidth = ref(360)
const boxHeight = ref(160)
const minW = 160
const minH = 60
const maxW = 600
const maxH = 300

let resizeDragging = false
let resizeStartX = 0
let resizeStartY = 0
let resizeStartW = 0
let resizeStartH = 0

function onResizeStart(e: PointerEvent) {
  resizeDragging = true
  resizeStartX = e.clientX
  resizeStartY = e.clientY
  resizeStartW = boxWidth.value
  resizeStartH = boxHeight.value

  const target = e.currentTarget as HTMLElement
  target.setPointerCapture(e.pointerId)
  target.addEventListener('pointermove', onResizeMove)
  target.addEventListener('pointerup', onResizeEnd)
  target.addEventListener('lostpointercapture', onResizeEnd)

  document.body.style.userSelect = 'none'
}

function onResizeMove(e: PointerEvent) {
  if (!resizeDragging) return
  const dx = e.clientX - resizeStartX
  const dy = e.clientY - resizeStartY
  boxWidth.value = Math.min(maxW, Math.max(minW, resizeStartW + dx))
  boxHeight.value = Math.min(maxH, Math.max(minH, resizeStartH + dy))
}

function onResizeEnd(e: PointerEvent) {
  resizeDragging = false
  const target = e.currentTarget as HTMLElement
  target.removeEventListener('pointermove', onResizeMove)
  target.removeEventListener('pointerup', onResizeEnd)
  target.removeEventListener('lostpointercapture', onResizeEnd)
  document.body.style.userSelect = ''
}

onBeforeUnmount(() => {
  document.body.style.userSelect = ''
})
</script>

<style>
/* ScrollBox 自定义主题 — 蓝色系 */
.demo-scroll-theme {
  --yiz-scroll-thumb-bg: rgba(22, 119, 255, 0.25);
  --yiz-scroll-thumb-bg-hover: rgba(22, 119, 255, 0.45);
  --yiz-scroll-thumb-bg-active: rgba(22, 119, 255, 0.65);
  --yiz-scroll-thumb-radius: 6px;
  --yiz-scroll-track-size: 6px;
  --yiz-scroll-track-offset: 2px;
  --yiz-scroll-thumb-min-size: 30px;
}
</style>

<style scoped>
.demo-h-item {
  display: inline-block;
  width: 80px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #f0f5ff;
  margin-right: 8px;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
}

.demo-resize-wrapper {
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  overflow: hidden;
  min-width: 160px;
  min-height: 60px;
}

.demo-resize-scrollbox {
  width: 100%;
  height: 100%;
}

.demo-resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 22px;
  height: 22px;
  cursor: nwse-resize;
  background: linear-gradient(
    135deg,
    transparent 40%,
    rgba(22, 119, 255, 0.25) 40%,
    rgba(22, 119, 255, 0.25) 50%,
    transparent 50%,
    transparent 70%,
    rgba(22, 119, 255, 0.35) 70%,
    rgba(22, 119, 255, 0.35) 80%,
    transparent 80%
  );
  border-radius: 0 0 6px 0;
  transition: background 0.2s;
  z-index: 10;
}

.demo-resize-handle:hover {
  background: linear-gradient(
    135deg,
    transparent 35%,
    rgba(22, 119, 255, 0.45) 35%,
    rgba(22, 119, 255, 0.45) 55%,
    transparent 55%,
    transparent 65%,
    rgba(22, 119, 255, 0.6) 65%,
    rgba(22, 119, 255, 0.6) 85%,
    transparent 85%
  );
}
</style>
