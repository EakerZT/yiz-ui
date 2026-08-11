<template>
  <div class="demo-table-size-panel">
    <y-radio-button-group v-model:value="tableSize" :options="sizeOptions" />
    <div class="demo-table-size-table">
      <y-table :data="data" bordered :size="tableSize">
        <y-table-column :label="t('demo.common.name')" field="name" />
        <y-table-column :label="t('demo.common.age')" field="age" align="center" />
        <y-table-column :label="t('demo.common.city')" field="city" />
        <y-table-column :label="t('demo.common.status')" field="status" align="center" />
      </y-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

type DemoSize = 'small' | 'default' | 'large'

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

const tableSize = ref<DemoSize>('default')

const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]
</script>

<style scoped>
.demo-table-size-panel {
  height: 280px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.demo-table-size-table {
  flex: 1;
  min-height: 0;
}
</style>
