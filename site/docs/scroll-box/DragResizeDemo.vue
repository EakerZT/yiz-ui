<template>
  <p style="margin-bottom: 12px; font-size: 13px; color: #888">
    {{ $t('demo.scrollBox.dragResizeHint') }}<b>{{ boxWidth }} × {{ boxHeight }}</b>
  </p>
  <div class="demo-resize-wrapper" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
    <y-scroll-box class="demo-resize-scrollbox">
      <p v-for="i in 8" :key="i" style="margin-bottom: 8px; color: #555; white-space: nowrap">
        {{ $t('demo.scrollBox.dragResizeRow', { index: i }) }}
      </p>
      <p style="color: #999; margin-top: 16px; white-space: nowrap">
        {{ $t('demo.scrollBox.dragResizeLong') }}
      </p>
    </y-scroll-box>
    <div class="demo-resize-handle" @pointerdown.stop="onResizeStart" />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue'
import { $t } from 'yiz-ui'

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
</style>

<style scoped>
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
