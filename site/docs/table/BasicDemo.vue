<template>
  <div style="height: 250px">
    <y-table :data="data" @row-dblclick="onRowDblclick">
      <y-table-column :label="t('demo.common.name')" field="name" width="120px" sortable />
      <y-table-column :label="t('demo.common.age')" field="age" width="80px" sortable align="center" />
      <y-table-column :label="t('demo.common.city')" field="city" width="120px" sortable />
      <y-table-column :label="t('demo.common.status')" field="status" align="center" />
    </y-table>
  </div>
  <p class="demo-table-info">{{ t('demo.table.rowDblclickTip') }}</p>
  <p v-if="doubleClickedRow && doubleClickedRowIndex !== null" class="demo-table-info">
    {{ t('demo.table.rowDblclickValue', { index: doubleClickedRowIndex + 1, name: doubleClickedRow.name }) }}
  </p>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
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

const doubleClickedRow = ref<Row | null>(null)

const doubleClickedRowIndex = ref<number | null>(null)

function onRowDblclick(row: Record<string, any>, index: number) {
  doubleClickedRow.value = row as Row
  doubleClickedRowIndex.value = index
}
</script>

<style scoped>
.demo-table-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}

.demo-table-info + .demo-table-info {
  margin-top: 4px;
}
</style>
