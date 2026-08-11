<template>
  <div style="height: 200px">
    <y-table :data="fixedData" bordered resize no select-mode="single">
      <y-table-column :label="t('demo.common.name')" field="name" width="120px" fixed="left" />
      <y-table-column :label="t('demo.common.age')" field="age" width="80px" align="center" fixed="left" />
      <y-table-column :label="t('demo.common.department')" field="dept" width="150px" />
      <y-table-column :label="t('demo.common.position')" field="title" width="150px" />
      <y-table-column :label="t('demo.common.city')" field="city" width="120px" />
      <y-table-column :label="t('demo.common.phone')" field="phone" width="150px" />
      <y-table-column :label="t('demo.common.email')" field="email" width="200px" />
      <y-table-column :label="t('demo.common.hireDate')" field="date" width="120px" />
      <y-table-column :label="t('demo.common.action')" field="action" width="100px" align="center" fixed="right" />
    </y-table>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

interface FixedRow {
  name: string
  age: number
  dept: string
  title: string
  city: string
  phone: string
  email: string
  date: string
  action: string
}

const fixedData = computed<FixedRow[]>(() => [
  {
    name: t('demo.common.personZhangsan'),
    age: 28,
    dept: t('demo.common.deptEngineering'),
    title: t('demo.common.roleFrontend'),
    city: t('demo.common.beijing'),
    phone: '13800138001',
    email: 'zhangsan@test.com',
    date: '2022-03-15',
    action: t('demo.common.edit'),
  },
  {
    name: t('demo.common.personLisi'),
    age: 35,
    dept: t('demo.common.deptProduct'),
    title: t('demo.common.rolePm'),
    city: t('demo.common.shanghai'),
    phone: '13800138002',
    email: 'lisi@test.com',
    date: '2020-07-01',
    action: t('demo.common.edit'),
  },
  {
    name: t('demo.common.personWangwu'),
    age: 22,
    dept: t('demo.common.deptEngineering'),
    title: t('demo.common.roleBackend'),
    city: t('demo.common.guangzhou'),
    phone: '13800138003',
    email: 'wangwu@test.com',
    date: '2024-01-10',
    action: t('demo.common.edit'),
  },
  {
    name: t('demo.common.personZhaoliu'),
    age: 30,
    dept: t('demo.common.deptDesign'),
    title: t('demo.common.roleDesigner'),
    city: t('demo.common.shenzhen'),
    phone: '13800138004',
    email: 'zhaoliu@test.com',
    date: '2021-06-20',
    action: t('demo.common.edit'),
  },
  {
    name: t('demo.common.personSunqi'),
    age: 41,
    dept: t('demo.common.deptEngineering'),
    title: t('demo.common.roleArchitect'),
    city: t('demo.common.hangzhou'),
    phone: '13800138005',
    email: 'sunqi@test.com',
    date: '2019-09-01',
    action: t('demo.common.edit'),
  },
])
</script>
