<template>
  <div class="yiz-loading" :class="{ 'yiz-loading-container': $slots.default, 'yiz-loading-full-height': fullHeight }">
    <Transition name="yiz-loading-fade">
      <div v-if="visible" class="yiz-loading-spinner" :class="[`yiz-loading-${size}`]">
        <span class="yiz-loading-indicator">
          <slot name="indicator">
            <!-- Google: rotating ring -->
            <svg v-if="indicator === 'ring'" viewBox="0 0 50 50" width="42px" height="42px" class="yiz-loading-ring">
              <circle cx="25" cy="25" r="20" fill="none" />
            </svg>
            <!-- Ant: dual rotating arcs -->
            <div class="yiz-loading-ant-spin" v-else-if="indicator === 'spin'">
              <span class="yiz-loading-ant-spin-dot">
                <i class="yiz-loading-ant-spin-item"></i>
                <i class="yiz-loading-ant-spin-item"></i>
                <i class="yiz-loading-ant-spin-item"></i>
                <i class="yiz-loading-ant-spin-item"></i>
              </span>
            </div>
            <!-- Microsoft: bouncing dots -->
            <span v-else class="yiz-loading-think-dots">
              <span
                class="yiz-loading-think-dot"
                v-for="i in 3"
                :key="i"
                :style="{ animationDelay: `${(i - 1) * 0.15}s` }"
              />
            </span>
          </slot>
        </span>
        <div v-if="tipText || $slots.tip" class="yiz-loading-text">
          <slot name="tip">{{ tipText }}</slot>
        </div>
      </div>
    </Transition>
    <div
      v-if="$slots.default"
      class="yiz-loading-content"
      :class="{ 'yiz-loading-blur': visible, 'yiz-loading-content-full-height': fullHeight }"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { $t } from '../locale'

type IndicatorType = 'ring' | 'spin' | 'think'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    size?: 'small' | 'default' | 'large'
    indicator?: IndicatorType
    tip?: string
    delay?: number
    fullHeight?: boolean
  }>(),
  {
    loading: true,
    size: 'default',
    indicator: 'ring',
    delay: 0,
    fullHeight: false,
  },
)

defineSlots<{
  default?: any
  tip?: any
  indicator?: any
}>()

const visible = ref(false)
const tipText = computed(() => props.tip ?? $t('loading.tip'))
let timer: ReturnType<typeof setTimeout> | null = null

function update() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (props.loading) {
    if (props.delay && props.delay > 0) {
      timer = setTimeout(() => {
        visible.value = true
      }, props.delay)
    } else {
      visible.value = true
    }
  } else {
    visible.value = false
  }
}

watch(() => props.loading, update, { immediate: true })
watch(() => props.delay, update)

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style lang="less">
.yiz-loading {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  color: var(--yiz-color-primary);
}

.yiz-loading-container {
  position: relative;
  display: block;
}

.yiz-loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  .yiz-loading-container & {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
  }
}

.yiz-loading-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

// sizes
.yiz-loading-small {
  font-size: 18px;
  gap: 4px;

  .yiz-loading-text {
    font-size: 12px;
  }
}

.yiz-loading-default {
  font-size: 28px;
}

.yiz-loading-large {
  font-size: 40px;
}

.yiz-loading-text {
  font-size: 14px;
  color: var(--yiz-color-primary);
  white-space: nowrap;
}

// content wrapper
.yiz-loading-content {
  transition: opacity 0.3s;
}

.yiz-loading-full-height {
  height: 100%;
}

.yiz-loading-content-full-height {
  height: 100%;
}

.yiz-loading-blur {
  opacity: 0.5;
  pointer-events: none;
  user-select: none;
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}

// =====================
// Google: rotating ring
// =====================
.yiz-loading-ring {
  animation: yiz-loading-rotate 2s linear infinite;
  & > circle {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: var(--yiz-color-primary);
    stroke-linecap: round;
    transform-origin: 18px 18px;
    animation: loading-dash 1.5s ease-in-out infinite;
  }
}

// =====================
// Ant: dual arcs
// =====================
.yiz-loading-ant-spin {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: var(--yiz-color-primary);
  font-size: 14px;
  line-height: 1.5714285714285714;
  list-style: none;
  & > .yiz-loading-ant-spin-dot {
    position: relative;
    display: inline-block;
    font-size: 20px;
    width: 1em;
    height: 1em;
    transform: rotate(45deg);
    animation-name: yiz-loading-spin-rotate;
    animation-duration: 1.2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    & > .yiz-loading-ant-spin-item {
      position: absolute;
      display: block;
      width: 9px;
      height: 9px;
      background-color: #1677ff;
      border-radius: 100%;
      transform: scale(0.75);
      transform-origin: 50% 50%;
      opacity: 0.3;
      animation-name: yiz-loading-spin-move;
      animation-duration: 1s;
      animation-iteration-count: infinite;
      animation-timing-function: linear;
      animation-direction: alternate;
      &:nth-child(1) {
        top: 0;
        left: 0;
      }

      &:nth-child(2) {
        top: 0;
        right: 0;
        animation-delay: 0.4s;
      }

      &:nth-child(3) {
        bottom: 0;
        left: 0;
        animation-delay: 0.8s;
      }

      &:nth-child(4) {
        bottom: 0;
        right: 0;
        animation-delay: 1.2s;
      }
    }
  }
}

@keyframes yiz-loading-spin-rotate {
  from {
    transform: rotate(45deg);
  }
  to {
    transform: rotate(405deg);
  }
}

@keyframes yiz-loading-spin-move {
  to {
    opacity: 1;
  }
}

@keyframes yiz-loading-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// =====================
// Microsoft: bouncing dots
// =====================
.yiz-loading-think-dots {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.yiz-loading-think-dot {
  width: 0.25em;
  height: 0.25em;
  border-radius: 50%;
  background: currentColor;
  animation: yiz-loading-ms-bounce 1.2s ease-in-out infinite both;
}

@keyframes yiz-loading-ms-bounce {
  0%,
  40%,
  100% {
    transform: translateY(0);
    opacity: 0.3;
  }
  20% {
    transform: translateY(-0.35em);
    opacity: 1;
  }
}

// fade transition
.yiz-loading-fade-enter-active {
  transition: opacity 0.2s ease;
}

.yiz-loading-fade-leave-active {
  transition: opacity 0.1s ease;
}

.yiz-loading-fade-enter-from,
.yiz-loading-fade-leave-to {
  opacity: 0;
}
</style>
