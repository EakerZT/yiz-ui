<template>
  <section class="docs-api-component">
    <h3>{{ api.name }}</h3>

    <template v-for="section in sections" :key="section.key">
      <div v-if="section.items.length" class="docs-api-group">
        <h4>{{ $t(section.titleKey) }}</h4>
        <div class="docs-api-table-wrap">
          <table>
            <thead>
              <tr>
                <th>{{ $t('demo.docs.name') }}</th>
                <th>{{ $t('demo.docs.description') }}</th>
                <th>{{ $t('demo.docs.type') }}</th>
                <th v-if="section.showDefault">{{ $t('demo.docs.default') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in section.items" :key="item.name">
                <td>
                  <code>{{ item.name }}</code>
                  <span v-if="item.required" class="docs-api-required">{{ $t('demo.docs.required') }}</span>
                </td>
                <td>{{ getDescription(item) || '—' }}</td>
                <td>
                  <code>{{ item.type }}</code>
                </td>
                <td v-if="section.showDefault">
                  <code>{{ item.default ?? '—' }}</code>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { $t, demoLang } from '../../i18n'
import type { ApiItem, ComponentApi } from '../../docs/types'

const props = defineProps<{ api: ComponentApi }>()

const sections = computed(() => [
  { key: 'props', titleKey: 'demo.docs.props', items: props.api.props, showDefault: true },
  { key: 'models', titleKey: 'demo.docs.models', items: props.api.models, showDefault: true },
  { key: 'events', titleKey: 'demo.docs.events', items: props.api.events, showDefault: false },
  { key: 'slots', titleKey: 'demo.docs.slots', items: props.api.slots, showDefault: false },
  { key: 'methods', titleKey: 'demo.docs.methods', items: props.api.methods, showDefault: false },
])

function getDescription(item: ApiItem) {
  return demoLang.value === 'en-US' ? item.descriptionEn || item.description : item.description
}
</script>

<style scoped>
.docs-api-component {
  margin-top: 24px;
}

.docs-api-component > h3 {
  padding-bottom: 10px;
  border-bottom: 1px solid #e6e8eb;
  font-size: 18px;
}

.docs-api-group {
  margin-top: 18px;
}

.docs-api-group h4 {
  margin-bottom: 10px;
  font-size: 15px;
}

.docs-api-table-wrap {
  overflow-x: auto;
  border: 1px solid #e6e8eb;
  border-radius: 6px;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  font-size: 13px;
  line-height: 1.55;
}

th,
td {
  padding: 11px 14px;
  border-bottom: 1px solid #eef0f2;
  text-align: left;
  vertical-align: top;
}

th {
  background: #f8f9fb;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
}

tbody tr:last-child td {
  border-bottom: 0;
}

td code {
  color: #5b21b6;
  font-family: Consolas, 'SFMono-Regular', monospace;
  overflow-wrap: anywhere;
}

.docs-api-required {
  display: inline-block;
  margin-left: 6px;
  color: var(--yiz-color-error);
  font-size: 11px;
}
</style>
