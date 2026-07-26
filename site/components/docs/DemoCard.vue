<template>
  <article class="docs-demo-card" v-bind="$attrs">
    <Card :title="title" :bordered="bordered" :shadow="shadow" :size="size">
      <template v-if="$slots.cover" #cover><slot name="cover" /></template>
      <template v-if="$slots.title" #title><slot name="title" /></template>
      <template #extra>
        <slot name="extra" />
        <button class="docs-demo-card-action" type="button" :aria-expanded="sourceVisible" @click="toggleSource">
          {{ $t(sourceVisible ? 'demo.docs.hideCode' : 'demo.docs.showCode') }}
        </button>
      </template>

      <slot />

      <template v-if="$slots.footer" #footer><slot name="footer" /></template>
    </Card>

    <div v-if="sourceVisible" class="docs-demo-card-source">
      <div class="docs-demo-card-toolbar">
        <span>Vue</span>
        <button type="button" @click="copySource">
          {{ $t(copied ? 'demo.docs.copied' : 'demo.docs.copyCode') }}
        </button>
      </div>
      <pre><code>{{ source }}</code></pre>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, ref } from 'vue'
import { Card } from 'yiz-ui'
import { $t } from '../../i18n'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    source: string
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
  default?: () => any
  title?: () => any
  extra?: () => any
  cover?: () => any
  footer?: () => any
}>()

const sourceVisible = ref(false)
const copied = ref(false)
let copiedTimer: number | undefined

function toggleSource() {
  sourceVisible.value = !sourceVisible.value
}

async function copySource() {
  await navigator.clipboard.writeText(props.source)
  copied.value = true
  if (copiedTimer) window.clearTimeout(copiedTimer)
  copiedTimer = window.setTimeout(() => {
    copied.value = false
  }, 1600)
}

onBeforeUnmount(() => {
  if (copiedTimer) window.clearTimeout(copiedTimer)
})
</script>

<style scoped>
.docs-demo-card-source {
  overflow: hidden;
  border: 1px solid #e6e8eb;
  border-top: 0;
  border-radius: 0 0 8px 8px;
  background: #f8f9fb;
}

.docs-demo-card-action,
.docs-demo-card-toolbar button {
  border: 0;
  background: transparent;
  color: var(--yiz-color-primary);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
}

.docs-demo-card-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 1px solid #e8eaed;
  color: #999;
  font-size: 12px;
}

.docs-demo-card-source pre {
  max-height: 520px;
  margin: 0;
  overflow: auto;
  padding: 18px 20px;
  color: #303846;
  font:
    13px/1.7 Consolas,
    'SFMono-Regular',
    monospace;
  tab-size: 2;
  white-space: pre;
}
</style>
