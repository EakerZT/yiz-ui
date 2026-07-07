<template>
  <div class="yiz-descriptions" :class="vClass">
    <div v-if="title || $slots.title || $slots.extra" class="yiz-descriptions-header">
      <div class="yiz-descriptions-title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="$slots.extra" class="yiz-descriptions-extra">
        <slot name="extra" />
      </div>
    </div>

    <div class="yiz-descriptions-view">
      <table class="yiz-descriptions-table">
        <tbody v-if="bordered && layout === 'vertical'">
          <template v-for="(row, rowIndex) in rows" :key="rowIndex">
            <tr>
              <th v-for="item in row" :key="`${item.key}-label`" class="yiz-descriptions-label" :colspan="item.span">
                <DescriptionSlotRenderer v-if="item.labelSlot" :render="item.labelSlot" />
                <template v-else>{{ item.label }}</template>
              </th>
            </tr>
            <tr>
              <td v-for="item in row" :key="`${item.key}-content`" class="yiz-descriptions-content" :colspan="item.span">
                <DescriptionSlotRenderer v-if="item.defaultSlot" :render="item.defaultSlot" />
              </td>
            </tr>
          </template>
        </tbody>
        <tbody v-else>
          <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
            <template v-for="item in row" :key="item.key">
              <template v-if="bordered">
                <th class="yiz-descriptions-label">
                  <DescriptionSlotRenderer v-if="item.labelSlot" :render="item.labelSlot" />
                  <template v-else>{{ item.label }}</template>
                </th>
                <td class="yiz-descriptions-content" :colspan="contentColspan(item)">
                  <DescriptionSlotRenderer v-if="item.defaultSlot" :render="item.defaultSlot" />
                </td>
              </template>
              <td v-else class="yiz-descriptions-cell" :colspan="item.span">
                <span class="yiz-descriptions-label">
                  <DescriptionSlotRenderer v-if="item.labelSlot" :render="item.labelSlot" />
                  <template v-else>{{ item.label }}</template>
                </span>
                <span class="yiz-descriptions-content">
                  <DescriptionSlotRenderer v-if="item.defaultSlot" :render="item.defaultSlot" />
                </span>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, Fragment, useSlots } from 'vue'
import DescriptionItemComp from './DescriptionItem.vue'

export interface DescriptionItemData {
  key?: string | number
  label?: string
  span?: number
}

interface ResolvedDescriptionItem extends DescriptionItemData {
  key: string | number
  defaultSlot?: () => any
  labelSlot?: () => any
}

const props = withDefaults(
  defineProps<{
    title?: string
    column?: number | string
    bordered?: boolean
    size?: 'small' | 'default' | 'large'
    layout?: 'horizontal' | 'vertical'
  }>(),
  {
    title: '',
    column: 3,
    bordered: false,
    size: 'default',
    layout: 'horizontal',
  },
)

const slots = useSlots()

defineSlots<{
  default?: any
  title?: any
  extra?: any
}>()

const DescriptionSlotRenderer = defineComponent({
  props: {
    render: {
      type: Function,
      required: true,
    },
  },
  setup(renderProps) {
    return () => renderProps.render()
  },
})

const columnCount = computed(() => {
  const value = Number(props.column)
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 3
})

const vClass = computed(() => ({
  'yiz-descriptions-bordered': props.bordered,
  [`yiz-descriptions-size-${props.size}`]: props.size !== 'default',
  [`yiz-descriptions-layout-${props.layout}`]: true,
}))

function parseSpan(value: unknown) {
  const span = Number(value)
  if (!Number.isFinite(span) || span <= 0) return 1
  return Math.min(Math.floor(span), columnCount.value)
}

// 递归展平 Fragment，确保包裹组件或 v-for 生成的 DescriptionItem 能被正确提取
function collectItemVNodes(nodes: any[]): any[] {
  const result: any[] = []
  for (const vnode of nodes) {
    if (vnode && vnode.type === Fragment) {
      const children = vnode.children as any[]
      if (children) {
        result.push(...collectItemVNodes(children))
      }
    } else if (vnode && vnode.type === DescriptionItemComp) {
      result.push(vnode)
    }
  }
  return result
}

const items = computed<ResolvedDescriptionItem[]>(() => {
  const nodes = collectItemVNodes(slots.default?.() ?? [])
  return nodes.map((vnode, index) => {
    const p = (vnode.props ?? {}) as Record<string, any>
    const vnodeSlots = vnode.children
    return {
      key: vnode.key ?? p.key ?? index,
      label: p.label ?? '',
      span: parseSpan(p.span),
      defaultSlot:
        vnodeSlots && typeof vnodeSlots === 'object' && typeof vnodeSlots.default === 'function'
          ? vnodeSlots.default
          : undefined,
      labelSlot:
        vnodeSlots && typeof vnodeSlots === 'object' && typeof vnodeSlots.label === 'function' ? vnodeSlots.label : undefined,
    }
  })
})

const rows = computed(() => {
  const result: ResolvedDescriptionItem[][] = []
  let current: ResolvedDescriptionItem[] = []
  let used = 0
  const pushCurrent = () => {
    if (current.length === 0) return
    if (used < columnCount.value) {
      const lastIndex = current.length - 1
      current[lastIndex] = {
        ...current[lastIndex],
        span: current[lastIndex].span! + columnCount.value - used,
      }
    }
    result.push(current)
    current = []
    used = 0
  }

  for (const item of items.value) {
    if (used > 0 && used + item.span! > columnCount.value) {
      pushCurrent()
    }

    current.push(item)
    used += item.span!

    if (used >= columnCount.value) {
      pushCurrent()
    }
  }

  pushCurrent()

  return result
})

function contentColspan(item: ResolvedDescriptionItem) {
  return item.span! * 2 - 1
}
</script>

<style lang="less">
.yiz-descriptions {
  color: #333;
  font-size: 14px;
}

.yiz-descriptions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.yiz-descriptions-title {
  color: #333;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.yiz-descriptions-extra {
  flex-shrink: 0;
}

.yiz-descriptions-view {
  width: 100%;
  overflow-x: auto;
}

.yiz-descriptions-table {
  width: 100%;
  table-layout: fixed;
  border-spacing: 0;
  border-collapse: collapse;
}

.yiz-descriptions-cell {
  padding: 8px 0;
  line-height: 22px;
  vertical-align: top;
}

.yiz-descriptions-label {
  color: #666;
  font-weight: 500;
  vertical-align: top;
}

.yiz-descriptions-content {
  color: #333;
  vertical-align: top;
}

.yiz-descriptions:not(.yiz-descriptions-bordered) {
  .yiz-descriptions-label::after {
    content: ':';
    margin-inline-end: 8px;
  }
}

.yiz-descriptions-bordered {
  .yiz-descriptions-view {
    border: 1px solid var(--yiz-color-border, #d9d9d9);
    border-radius: var(--yiz-base-border-radius-default);
    overflow: auto;
  }

  .yiz-descriptions-table {
    border-collapse: separate;
    border-spacing: 0;
  }

  .yiz-descriptions-label,
  .yiz-descriptions-content {
    padding: 12px 16px;
    border-right: 1px solid var(--yiz-color-border, #d9d9d9);
    border-bottom: 1px solid var(--yiz-color-border, #d9d9d9);
    line-height: 22px;
  }

  tr:last-child > .yiz-descriptions-label,
  tr:last-child > .yiz-descriptions-content {
    border-bottom: none;
  }

  tr > .yiz-descriptions-label:last-child,
  tr > .yiz-descriptions-content:last-child {
    border-right: none;
  }

  .yiz-descriptions-label {
    background: #fafafa;
  }
}

.yiz-descriptions-layout-vertical:not(.yiz-descriptions-bordered) {
  .yiz-descriptions-cell {
    display: table-cell;
  }

  .yiz-descriptions-label,
  .yiz-descriptions-content {
    display: block;
  }

  .yiz-descriptions-label::after {
    content: '';
    margin: 0;
  }

  .yiz-descriptions-content {
    margin-top: 4px;
  }
}

.yiz-descriptions-size-small {
  font-size: 13px;

  .yiz-descriptions-cell {
    padding: 4px 0;
  }

  &.yiz-descriptions-bordered {
    .yiz-descriptions-label,
    .yiz-descriptions-content {
      padding: 8px 12px;
    }
  }
}

.yiz-descriptions-size-large {
  .yiz-descriptions-cell {
    padding: 12px 0;
  }

  &.yiz-descriptions-bordered {
    .yiz-descriptions-label,
    .yiz-descriptions-content {
      padding: 16px 20px;
    }
  }
}
</style>
