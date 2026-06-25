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
    size: 'default'
  }
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
  background: #fff;
  border-radius: 8px;
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

// bordered
.yiz-card-bordered {
  border: 1px solid var(--yiz-color-border, #d9d9d9);
}

// shadow
.yiz-card-shadow-hover:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.yiz-card-shadow-always {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

// size
.yiz-card-size-small {
  border-radius: 4px;

  .yiz-card-header {
    padding: 8px 16px;
  }
  .yiz-card-title {
    font-size: 14px;
  }
  .yiz-card-body {
    padding: 12px 16px;
  }
  .yiz-card-footer {
    padding: 8px 16px;
  }
}

.yiz-card-size-large {
  .yiz-card-header {
    padding: 16px 24px;
  }
  .yiz-card-title {
    font-size: 18px;
  }
  .yiz-card-body {
    padding: 20px 24px;
  }
  .yiz-card-footer {
    padding: 16px 24px;
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
  padding: 12px 20px;
  flex-shrink: 0;
}

.yiz-card-header-left {
  flex: 1;
  min-width: 0;
}

.yiz-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.yiz-card-header-extra {
  flex-shrink: 0;
  margin-left: 16px;
}

// body
.yiz-card-body {
  flex: 1;
  padding: 16px 20px;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

// footer
.yiz-card-footer {
  padding: 12px 20px;
  border-top: 1px solid var(--yiz-color-border, #d9d9d9);
  flex-shrink: 0;
}
</style>
