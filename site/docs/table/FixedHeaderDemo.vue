<template>
  <div style="height: 300px">
    <y-table :data="tallData" bordered>
      <y-table-column :label="$t('demo.common.name')" field="name" width="120px" sortable />
      <y-table-column :label="$t('demo.common.age')" field="age" width="80px" sortable align="center" />
      <y-table-column :label="$t('demo.common.city')" field="city" width="120px" sortable />
      <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
    </y-table>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { $t } from 'yiz-ui'

interface Row {
  name: string
  age: number
  city: string
  status: string
}

const tallData = computed<Row[]>(() => [
  {
    name: $t('demo.common.personZhangsan'),
    age: 28,
    city: $t('demo.common.beijing'),
    status: $t('demo.common.enabled'),
  },
  { name: $t('demo.common.personLisi'), age: 35, city: $t('demo.common.shanghai'), status: $t('demo.common.disabled') },
  {
    name: $t('demo.common.personWangwu'),
    age: 22,
    city: $t('demo.common.guangzhou'),
    status: $t('demo.common.enabled'),
  },
  {
    name: $t('demo.common.personZhaoliu'),
    age: 30,
    city: $t('demo.common.shenzhen'),
    status: $t('demo.common.enabled'),
  },
  {
    name: $t('demo.common.personSunqi'),
    age: 41,
    city: $t('demo.common.hangzhou'),
    status: $t('demo.common.disabled'),
  },
  { name: $t('demo.common.personZhouba'), age: 27, city: $t('demo.common.chengdu'), status: $t('demo.common.enabled') },
  { name: $t('demo.common.personWujiu'), age: 33, city: $t('demo.common.wuhan'), status: $t('demo.common.disabled') },
  {
    name: $t('demo.common.personZhengshi'),
    age: 29,
    city: $t('demo.common.nanjing'),
    status: $t('demo.common.enabled'),
  },
  { name: $t('demo.common.personFengyi'), age: 36, city: $t('demo.common.tianjin'), status: $t('demo.common.enabled') },
  {
    name: $t('demo.common.personChener'),
    age: 24,
    city: $t('demo.common.chongqing'),
    status: $t('demo.common.disabled'),
  },
  { name: $t('demo.common.personChusan'), age: 31, city: $t('demo.common.xian'), status: $t('demo.common.enabled') },
  { name: $t('demo.common.personWeisi'), age: 39, city: $t('demo.common.changsha'), status: $t('demo.common.enabled') },
  {
    name: $t('demo.common.personJiangwu'),
    age: 26,
    city: $t('demo.common.suzhou'),
    status: $t('demo.common.disabled'),
  },
  {
    name: $t('demo.common.personShenliu'),
    age: 42,
    city: $t('demo.common.dongguan'),
    status: $t('demo.common.enabled'),
  },
  { name: $t('demo.common.personHanqi'), age: 23, city: $t('demo.common.qingdao'), status: $t('demo.common.disabled') },
])
</script>
