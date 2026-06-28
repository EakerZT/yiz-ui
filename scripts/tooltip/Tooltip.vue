<template>
  <div
    class="yiz-tooltip"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot />
    <transition name="yiz-tooltip-fade">
      <div
        v-if="visible"
        class="yiz-tooltip-pop"
        :class="`yiz-tooltip-${placement}`"
      >
        <div class="yiz-tooltip-content">
          <slot name="content">{{ content }}</slot>
        </div>
        <div class="yiz-tooltip-arrow"></div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

withDefaults(
  defineProps<{
    content?: string
    placement?: 'top' | 'bottom' | 'left' | 'right'
  }>(),
  {
    placement: 'top',
  }
)

defineSlots<{
  default?: any
  content?: any
}>()

const visible = ref(false)
let timerId: ReturnType<typeof setTimeout>

function onMouseEnter() {
  clearTimeout(timerId)
  visible.value = true
}

function onMouseLeave() {
  timerId = setTimeout(() => {
    visible.value = false
  }, 100)
}
</script>

<style lang="less">
.yiz-tooltip {
  position: relative;
  display: inline-flex;
}

.yiz-tooltip-pop {
  position: absolute;
  z-index: 2000;
  white-space: nowrap;
  font-size: 13px;
  padding: 4px 10px;
}

.yiz-tooltip-content {
  background: #303133;
  color: #fff;
  border-radius: var(--yiz-pane-border-radius);
  padding: 6px 12px;
  line-height: 1.4;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
}

.yiz-tooltip-arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 5px solid transparent;
}

// top
.yiz-tooltip-top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-bottom: 8px;

  .yiz-tooltip-arrow {
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    border-top-color: #303133;
  }
}

// bottom
.yiz-tooltip-bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding-top: 8px;

  .yiz-tooltip-arrow {
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    border-bottom-color: #303133;
  }
}

// left
.yiz-tooltip-left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  padding-right: 8px;

  .yiz-tooltip-arrow {
    right: -2px;
    top: 50%;
    transform: translateY(-50%);
    border-left-color: #303133;
  }
}

// right
.yiz-tooltip-right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  padding-left: 8px;

  .yiz-tooltip-arrow {
    left: -2px;
    top: 50%;
    transform: translateY(-50%);
    border-right-color: #303133;
  }
}

// transition
.yiz-tooltip-fade-enter-active,
.yiz-tooltip-fade-leave-active {
  transition: opacity 0.2s;
}

.yiz-tooltip-fade-enter-from,
.yiz-tooltip-fade-leave-to {
  opacity: 0;
}
</style>
