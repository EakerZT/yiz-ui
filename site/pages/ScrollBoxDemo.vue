<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.scrollBox') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.scrollBox.desc') }}</p>

    <y-card :title="$t('demo.common.basic')" style="margin-top: 8px">
      <ScrollBox :height="120" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">{{ $t('demo.scrollBox.demoRow', { index: i }) }}</p>
      </ScrollBox>
    </y-card>

    <y-card :title="$t('demo.scrollBox.maxHeight')" style="margin-top: 8px">
      <ScrollBox :max-height="150" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 10" :key="i" style="margin-bottom: 8px; color: #666">
          {{ $t('demo.scrollBox.maxHeightRow', { index: i }) }}
        </p>
      </ScrollBox>
    </y-card>

    <y-card :title="$t('demo.scrollBox.horizontalScroll')" style="margin-top: 8px">
      <ScrollBox :height="80" style="width: 360px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <div style="white-space: nowrap">
          <span v-for="i in 12" :key="i" class="demo-h-item">{{ $t('demo.scrollBox.item', { index: i }) }}</span>
        </div>
      </ScrollBox>
    </y-card>

    <y-card :title="$t('demo.scrollBox.embedCard')" style="margin-top: 8px">
      <Card :title="$t('demo.scrollBox.scrollList')" style="width: 360px">
        <ScrollBox :height="160">
          <div
            v-for="i in 6"
            :key="i"
            style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333"
          >
            {{ $t('demo.scrollBox.listItem', { index: i }) }}
          </div>
        </ScrollBox>
      </Card>
    </y-card>

    <y-card :title="$t('demo.scrollBox.autoHideNever')" style="margin-top: 8px">
      <p style="margin-bottom: 12px; font-size: 13px; color: #888">{{ $t('demo.scrollBox.autoHideNeverHint') }}</p>
      <ScrollBox :height="120" auto-hide="never" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">{{ $t('demo.scrollBox.autoHideNeverRow', { index: i }) }}</p>
      </ScrollBox>
    </y-card>

    <y-card :title="$t('demo.scrollBox.autoHideScroll')" style="margin-top: 8px">
      <p style="margin-bottom: 12px; font-size: 13px; color: #888">{{ $t('demo.scrollBox.autoHideScrollHint', { delay: 1300 }) }}</p>
      <ScrollBox :height="120" auto-hide="scroll" :auto-hide-delay="1300" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">{{ $t('demo.scrollBox.autoHideScrollHint2') }}</p>
      </ScrollBox>
    </y-card>

    <y-card :title="$t('demo.scrollBox.autoHideMove')" style="margin-top: 8px">
      <p style="margin-bottom: 12px; font-size: 13px; color: #888">{{ $t('demo.scrollBox.autoHideMoveHint', { delay: 800 }) }}</p>
      <ScrollBox :height="120" auto-hide="move" :auto-hide-delay="800" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">{{ $t('demo.scrollBox.autoHideMoveHint2') }}</p>
      </ScrollBox>
    </y-card>

    <y-card :title="$t('demo.scrollBox.autoHideLeave')" style="margin-top: 8px">
      <p style="margin-bottom: 12px; font-size: 13px; color: #888">{{ $t('demo.scrollBox.autoHideLeaveHint', { delay: 600 }) }}</p>
      <ScrollBox :height="120" auto-hide="leave" :auto-hide-delay="600" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">{{ $t('demo.scrollBox.autoHideLeaveHint2') }}</p>
      </ScrollBox>
    </y-card>

    <y-card :title="$t('demo.scrollBox.customTheme')" style="margin-top: 8px">
      <p style="margin-bottom: 12px; font-size: 13px; color: #888">{{ $t('demo.scrollBox.customThemeHint') }}</p>
      <ScrollBox :height="120" theme="demo-scroll-theme" style="width: 320px; border: 1px solid #d9d9d9; border-radius: 4px; padding: 12px">
        <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #666">{{ $t('demo.scrollBox.customThemeRow', { index: i }) }}</p>
      </ScrollBox>
    </y-card>

    <y-card :title="$t('demo.scrollBox.dragResize')" style="margin-top: 8px">
      <p style="margin-bottom: 12px; font-size: 13px; color: #888">
        {{ $t('demo.scrollBox.dragResizeHint') }}<b>{{ boxWidth }} × {{ boxHeight }}</b>
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
            {{ $t('demo.scrollBox.dragResizeRow', { index: i }) }}
          </p>
          <p style="color: #999; margin-top: 16px; white-space: nowrap">
            {{ $t('demo.scrollBox.dragResizeLong') }}
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
import { $t } from 'yiz-ui'
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
/* ScrollBox custom theme - blue */
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
