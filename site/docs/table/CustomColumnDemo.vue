<template>
  <div style="height: 250px">
    <y-table :data="data" bordered>
      <y-table-column :label="t('demo.common.name')" field="name" />
      <y-table-column :label="t('demo.common.age')" field="age" align="center">
        <template #default="{ value }">{{ t('demo.table.ageTemplate', { value }) }}</template>
      </y-table-column>
      <y-table-column :label="t('demo.common.city')" field="city" />
      <y-table-column :label="t('demo.common.status')" field="status" align="center">
        <template #default="{ value }">
          <y-link-button v-if="value === t('demo.common.disabled')">{{ t('demo.common.enabled') }}</y-link-button>
          <y-link-button v-else color="error">{{ t('demo.common.disabled') }}</y-link-button>
        </template>
      </y-table-column>
    </y-table>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

interface Row {
  name: string
  age: number
  city: string
  status: string
}

const data = computed<Row[]>(() => [
  {
    name: t('demo.common.personZhangsan'),
    age: 28,
    city: t('demo.common.beijing'),
    status: t('demo.common.enabled'),
  },
  { name: t('demo.common.personLisi'), age: 35, city: t('demo.common.shanghai'), status: t('demo.common.disabled') },
  {
    name: t('demo.common.personWangwu'),
    age: 22,
    city: t('demo.common.guangzhou'),
    status: t('demo.common.enabled'),
  },
  {
    name: t('demo.common.personZhaoliu'),
    age: 30,
    city: t('demo.common.shenzhen'),
    status: t('demo.common.enabled'),
  },
  {
    name: t('demo.common.personSunqi'),
    age: 41,
    city: t('demo.common.hangzhou'),
    status: t('demo.common.disabled'),
  },
])
</script>
