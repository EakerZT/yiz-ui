<template>
  <div class="demo-table-fixed-height">
    <y-table
      :data="data"
      bordered
      select-mode="multi"
      v-model:selected="disabledSelected"
      :select-disabled="isSelectDisabled"
    >
      <y-table-column :label="$t('demo.common.name')" field="name" />
      <y-table-column :label="$t('demo.common.age')" field="age" align="center" />
      <y-table-column :label="$t('demo.common.city')" field="city" />
      <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
    </y-table>
  </div>
  <p class="demo-table-info">{{ $t('demo.table.selectedValue', { value: disabledSelected.join(', ') }) }}</p>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

interface Row {
  name: string
  age: number
  city: string
  status: string
}

const data = computed<Row[]>(() => [
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
])

const disabledSelected = ref([])

function isSelectDisabled(row: Row, _index: number) {
  return row.status === $t('demo.common.disabled')
}
</script>

<style scoped>
.demo-table-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}

.demo-table-fixed-height {
  height: 250px;
}

.demo-table-info + .demo-table-info {
  margin-top: 4px;
}
</style>
