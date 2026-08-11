<template>
  <div style="height: 250px">
    <y-table :data="data" bordered resize>
      <y-table-column :label="t('demo.common.name')" field="name" width="150px" min-width="100" max-width="300" />
      <y-table-column
        :label="t('demo.common.age')"
        field="age"
        width="80px"
        :min-width="60"
        :max-width="150"
        align="center"
      />
      <y-table-column :label="t('demo.common.city')" field="city" width="120px" :min-width="80" :max-width="250" />
      <y-table-column :label="t('demo.common.status')" field="status" align="center" />
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
