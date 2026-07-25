<template>
  <article class="docs-demo-block">
    <header class="docs-demo-header">
      <div>
        <h3>{{ $t(titleKey) }}</h3>
        <p v-if="descriptionKey">{{ $t(descriptionKey) }}</p>
      </div>
      <button
        class="docs-demo-toggle"
        type="button"
        :aria-expanded="sourceVisible"
        @click="sourceVisible = !sourceVisible"
      >
        {{ $t(sourceVisible ? 'demo.docs.hideCode' : 'demo.docs.showCode') }}
      </button>
    </header>

    <div class="docs-demo-preview">
      <component :is="component" />
    </div>

    <div v-if="sourceVisible" class="docs-demo-source">
      <div class="docs-demo-source-toolbar">
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
import { onBeforeUnmount, ref, type Component } from 'vue'
import { $t } from '../../i18n'

const props = defineProps<{
  titleKey: string
  descriptionKey?: string
  component: Component
  source: string
}>()

const sourceVisible = ref(false)
const copied = ref(false)
let copiedTimer: number | undefined

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
.docs-demo-block {
  margin-top: 16px;
  overflow: hidden;
  border: 1px solid #e6e8eb;
  border-radius: 8px;
  background: #fff;
}

.docs-demo-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 20px;
  border-bottom: 1px solid #eef0f2;
}

.docs-demo-header h3 {
  font-size: 15px;
  font-weight: 600;
}

.docs-demo-header p {
  margin-top: 6px;
  color: #888;
  font-size: 13px;
  line-height: 1.6;
}

.docs-demo-toggle,
.docs-demo-source-toolbar button {
  flex-shrink: 0;
  border: 0;
  background: transparent;
  color: var(--yiz-color-primary);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
}

.docs-demo-preview {
  padding: 24px 20px;
}

.docs-demo-source {
  border-top: 1px solid #eef0f2;
  background: #f8f9fb;
}

.docs-demo-source-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 1px solid #e8eaed;
  color: #999;
  font-size: 12px;
}

.docs-demo-source pre {
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
