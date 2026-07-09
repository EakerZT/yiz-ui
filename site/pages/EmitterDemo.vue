<template>
  <section class="demo-section emitter-demo">
    <h2 class="demo-section-title">{{ $t('demo.emitter.title') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.emitter.desc') }}</p>

    <article class="emitter-doc">
      <h3>{{ $t('demo.emitter.apiTitle') }}</h3>
      <p>{{ $t('demo.emitter.apiDesc') }}</p>
      <pre><code>{{ apiCode }}</code></pre>
    </article>

    <article class="emitter-doc">
      <h3>{{ $t('demo.emitter.componentTitle') }}</h3>
      <p>{{ $t('demo.emitter.componentDesc') }}</p>
      <pre><code>{{ componentCode }}</code></pre>
    </article>

    <article class="emitter-doc">
      <h3>{{ $t('demo.emitter.namedTitle') }}</h3>
      <p>{{ $t('demo.emitter.namedDesc') }}</p>
      <pre><code>{{ namedCode }}</code></pre>
    </article>

    <article class="emitter-doc">
      <h3>{{ $t('demo.emitter.tsTitle') }}</h3>
      <p>{{ $t('demo.emitter.tsDesc') }}</p>
      <pre><code>{{ tsCode }}</code></pre>
    </article>

    <article class="emitter-doc">
      <h3>{{ $t('demo.emitter.rulesTitle') }}</h3>
      <ul>
        <li>{{ $t('demo.emitter.ruleScope') }}</li>
        <li>{{ $t('demo.emitter.ruleNamed') }}</li>
        <li>{{ $t('demo.emitter.ruleDuplicate') }}</li>
        <li>{{ $t('demo.emitter.ruleEmit') }}</li>
        <li>{{ $t('demo.emitter.ruleClear') }}</li>
      </ul>
    </article>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'

const apiCode = `import { emitter, createEmitter, useEmitter } from 'yiz-ui'

emitter.emit('event')

const localEmitter = createEmitter()
const formEmitter = createEmitter<FormEvents>('form')

const { emit, emitAsync, on, off, once, clear, count } = useEmitter<FormEvents>('form')`

const componentCode = `import { useEmitter } from 'yiz-ui'

type AppEvents = {
  change: [value: string]
  ready: []
}

const { emit, emitAsync, on, off, once, clear, count } = useEmitter<AppEvents>()

const handleChange = (value: string) => {
  console.log(value)
}

on('change', handleChange)
once('ready', async () => {
  await loadData()
})

emit('change', 'draft')
await emitAsync('ready')

off('change', handleChange)
clear('change')
console.log(count('change'))`

const namedCode = `// emitters.ts
import { createEmitter } from 'yiz-ui'

export type FormEvents = {
  change: [value: string]
  submit: [data: FormData, valid: boolean]
  reset: []
}

export const formEmitter = createEmitter<FormEvents>('form')

// FormView.vue
import type { FormEvents } from './emitters'
import { useEmitter } from 'yiz-ui'

const { on, emit } = useEmitter<FormEvents>('form')

on('submit', (data, valid) => {
  console.log(data, valid)
})

emit('change', 'name')`

const tsCode = `// normal TypeScript module
import { emitter } from 'yiz-ui'
import { formEmitter } from './emitters'

const offGlobal = emitter.on('notify', (message) => {
  console.log(message)
})

formEmitter.emit('submit', new FormData(), true)

offGlobal()`
</script>

<style scoped>
.emitter-demo {
  color: #333;
}

.emitter-doc {
  max-width: 960px;
  margin-top: 18px;
}

.emitter-doc h3 {
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 600;
}

.emitter-doc p,
.emitter-doc li {
  font-size: 14px;
  line-height: 1.7;
  color: #666;
}

.emitter-doc ul {
  padding-left: 20px;
}

.emitter-doc pre {
  margin-top: 10px;
  padding: 14px 16px;
  overflow-x: auto;
  border: 1px solid #e6e8eb;
  border-radius: 6px;
  background: #f8fafc;
}

.emitter-doc code {
  font-family: Consolas, Monaco, 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #1f2937;
  white-space: pre;
}
</style>
