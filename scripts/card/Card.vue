<template>
  <div class="yiz-card" :class="vClass">
    <!-- cover -->
    <div v-if="$slots.cover" class="yiz-card-cover">
      <slot name="cover" />
    </div>

    <!-- header -->
    <div v-if="title || $slots.title || $slots.extra" class="yiz-card-header">
      <div class="yiz-card-header-left">
        <slot name="title">
          <span class="yiz-card-title">{{ title }}</span>
        </slot>
      </div>
      <div v-if="$slots.extra" class="yiz-card-header-extra">
        <slot name="extra" />
      </div>
    </div>

    <!-- body -->
    <div class="yiz-card-body">
      <slot />
    </div>

    <!-- footer -->
    <div v-if="$slots.footer" class="yiz-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    bordered?: boolean
    shadow?: 'never' | 'hover' | 'always'
    size?: 'small' | 'default' | 'large'
  }>(),
  {
    title: '',
    bordered: true,
    shadow: 'never',
    size: 'default',
  },
)

defineSlots<{
  default?: any
  title?: any
  extra?: any
  cover?: any
  footer?: any
}>()

const vClass = computed(() => {
  const c: Record<string, boolean> = {}
  if (props.bordered) {
    c['yiz-card-bordered'] = true
  }
  if (props.shadow !== 'never') {
    c[`yiz-card-shadow-${props.shadow}`] = true
  }
  if (props.size !== 'default') {
    c[`yiz-card-size-${props.size}`] = true
  }
  return c
})
</script>

<style lang="less">
.yiz-card {
  display: flex;
  flex-direction: column;
  background: var(--yiz-color-bg-container);
  border-radius: var(--yiz-radius-container);
  transition: box-shadow var(--yiz-motion-duration-slow) var(--yiz-motion-easing-standard);
}

// bordered
.yiz-card-bordered {
  border: 1px solid var(--yiz-color-border, #d9d9d9);
}

// shadow
.yiz-card-shadow-hover:hover {
  box-shadow: var(--yiz-shadow-popup);
}

.yiz-card-shadow-always {
  box-shadow: var(--yiz-shadow-default);
}

// size
.yiz-card-size-small {
  border-radius: 4px;

  .yiz-card-header {
    padding: var(--yiz-space-2) var(--yiz-space-4);
  }
  .yiz-card-title {
    font-size: 14px;
  }
  .yiz-card-body {
    padding: var(--yiz-space-3) var(--yiz-space-4);
  }
  .yiz-card-footer {
    padding: var(--yiz-space-2) var(--yiz-space-4);
  }
}

.yiz-card-size-large {
  .yiz-card-header {
    padding: var(--yiz-space-4) var(--yiz-space-6);
  }
  .yiz-card-title {
    font-size: 18px;
  }
  .yiz-card-body {
    padding: var(--yiz-space-5) var(--yiz-space-6);
  }
  .yiz-card-footer {
    padding: var(--yiz-space-4) var(--yiz-space-6);
  }
}

// cover
.yiz-card-cover {
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  flex-shrink: 0;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}

// header
.yiz-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--yiz-space-3) var(--yiz-space-5);
  flex-shrink: 0;
}

.yiz-card-header-left {
  flex: 1;
  min-width: 0;
}

.yiz-card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--yiz-color-text-primary);
}

.yiz-card-header-extra {
  flex-shrink: 0;
  margin-left: 16px;
}

// body
.yiz-card-body {
  flex: 1;
  padding: var(--yiz-space-4) var(--yiz-space-5);
  font-size: 14px;
  color: var(--yiz-color-text-primary);
  line-height: var(--yiz-line-height-default);
}

// footer
.yiz-card-footer {
  padding: var(--yiz-space-3) var(--yiz-space-5);
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
  flex-shrink: 0;
}
</style>
