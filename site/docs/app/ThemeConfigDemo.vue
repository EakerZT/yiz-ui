<template>
  <div class="theme-config-demo">
    <p class="theme-config-hint">{{ t('demo.app.theme.hint') }}</p>

    <section v-for="section in sections" :key="section.key" class="theme-config-section">
      <h4>{{ t(`demo.app.theme.section.${section.key}`) }}</h4>
      <p>{{ t(`demo.app.theme.section.${section.key}.desc`) }}</p>
      <div class="theme-config-table-wrap">
        <table>
          <thead>
            <tr>
              <th>{{ t('demo.app.theme.path') }}</th>
              <th>{{ t('demo.app.theme.type') }}</th>
              <th>{{ t('demo.app.theme.lightDefault') }}</th>
              <th>{{ t('demo.app.theme.darkDefault') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in section.rows" :key="row.path">
              <td>
                <code>{{ row.path }}</code>
              </td>
              <td>
                <code>{{ row.type }}</code>
              </td>
              <td>
                <code>{{ row.light }}</code>
              </td>
              <td>
                <code>{{ row.dark }}</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { darkTheme, lightTheme, useLocale, type Theme } from 'yiz-ui'

const t = useLocale()

type ThemeSectionKey = 'behavior' | 'colors' | 'typography' | 'sizing' | 'radius' | 'motion'

interface ThemeRow {
  path: string
  type: string
  light: string
  dark: string
}

const sectionPaths: Array<{ key: ThemeSectionKey; paths: string[] }> = [
  {
    key: 'behavior',
    paths: ['darkMode', 'size', 'styleMode', 'inputNumber.controls'],
  },
  {
    key: 'colors',
    paths: Object.keys(lightTheme.colors).map((name) => `colors.${name}`),
  },
  {
    key: 'typography',
    paths: Object.keys(lightTheme.typography).map((name) => `typography.${name}`),
  },
  {
    key: 'sizing',
    paths: Object.keys(lightTheme.sizing).map((name) => `sizing.${name}`),
  },
  {
    key: 'radius',
    paths: Object.keys(lightTheme.radius).map((name) => `radius.${name}`),
  },
  {
    key: 'motion',
    paths: Object.keys(lightTheme.motion).map((name) => `motion.${name}`),
  },
]

const sections = computed(() =>
  sectionPaths.map((section) => ({
    key: section.key,
    rows: section.paths.map<ThemeRow>((path) => ({
      path,
      type: getFieldType(path),
      light: formatValue(getThemeValue(lightTheme, path)),
      dark: formatValue(getThemeValue(darkTheme, path)),
    })),
  })),
)

function getThemeValue(theme: Readonly<Theme>, path: string): unknown {
  return path.split('.').reduce<unknown>((value, key) => {
    if (value == null || typeof value !== 'object') return undefined
    return (value as Record<string, unknown>)[key]
  }, theme)
}

function getFieldType(path: string): string {
  if (path === 'darkMode') return 'boolean'
  if (path === 'size') return "'small' | 'default' | 'large'"
  if (path === 'styleMode') return "'outlined' | 'filled'"
  if (path === 'inputNumber.controls') return "'left' | 'right' | 'separate' | 'none'"
  const value = getThemeValue(lightTheme, path)
  return typeof value
}

function formatValue(value: unknown): string {
  return typeof value === 'string' ? value : JSON.stringify(value)
}
</script>

<style scoped>
.theme-config-demo {
  display: grid;
  gap: 24px;
}

.theme-config-hint,
.theme-config-section > p {
  color: var(--yiz-color-text-secondary);
  line-height: var(--yiz-line-height-default);
}

.theme-config-section {
  display: grid;
  gap: 8px;
}

.theme-config-section h4 {
  font-size: var(--yiz-font-size-large);
}

.theme-config-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--yiz-color-border-light);
  border-radius: var(--yiz-radius-default);
}

.theme-config-table-wrap table {
  width: 100%;
  border-collapse: collapse;
  background: var(--yiz-color-bg-container);
}

.theme-config-table-wrap th,
.theme-config-table-wrap td {
  min-width: 150px;
  padding: 9px 12px;
  border-bottom: 1px solid var(--yiz-color-border-subtle);
  text-align: left;
  white-space: nowrap;
}

.theme-config-table-wrap th {
  color: var(--yiz-color-text-secondary);
  background: var(--yiz-color-bg-subtle);
  font-weight: var(--yiz-font-weight-medium);
}

.theme-config-table-wrap tr:last-child td {
  border-bottom: 0;
}

.theme-config-table-wrap code {
  color: var(--yiz-color-primary-text);
}
</style>
