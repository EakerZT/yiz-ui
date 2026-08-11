<template>
  <p class="demo-section-desc" style="margin-bottom: 12px">{{ t('demo.table.overflowTooltipDesc') }}</p>
  <y-table resize :data="overflowData" bordered show-overflow>
    <y-table-column :label="t('demo.common.name')" field="name" width="100px" sortable />
    <y-table-column :label="t('demo.common.role')" field="role" width="160px" sortable />
    <y-table-column :label="t('demo.common.city')" field="city" width="160px" sortable />
  </y-table>
  <h3 class="demo-section-title" style="margin-top: 16px; font-size: 14px">
    {{ t('demo.table.overflowColumnOnly') }}
  </h3>
  <y-table resize :data="overflowData" bordered>
    <y-table-column :label="t('demo.common.name')" field="name" width="100px" />
    <y-table-column :label="t('demo.common.role')" field="role" width="220px" />
    <y-table-column :label="t('demo.common.city')" field="city" width="160px" show-overflow />
  </y-table>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

interface OverflowRow {
  name: string
  role: string
  city: string
}

const overflowData = computed<OverflowRow[]>(() => [
  { name: t('demo.common.personZhangsan'), role: t('demo.table.roleDeveloper'), city: t('demo.table.longAddress') },
  { name: t('demo.common.personLisi'), role: t('demo.table.rolePM'), city: t('demo.table.shortAddress') },
  {
    name: t('demo.common.personWangwu'),
    role: t('demo.table.roleTester'),
    city: t('demo.common.shanghai'),
  },
])
</script>
