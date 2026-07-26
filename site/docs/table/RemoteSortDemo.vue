<template>
  <p class="demo-section-desc" style="margin-bottom: 12px">{{ $t('demo.table.remoteSortDesc') }}</p>
  <div style="height: 250px">
    <y-table
      :data="remoteData"
      bordered
      sort-mode="remote"
      :loading="remoteSortLoading"
      @sort-change="onRemoteSortChange"
    >
      <y-table-column :label="$t('demo.common.name')" field="name" width="160px" sortable />
      <y-table-column :label="$t('demo.common.age')" field="age" width="120px" sortable align="center" />
      <y-table-column :label="$t('demo.common.city')" field="city" width="180px" />
      <y-table-column :label="$t('demo.common.status')" field="status" align="center" />
    </y-table>
  </div>
  <p class="demo-table-info">{{ remoteSortSignalText }}</p>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { $t, type TableSortState } from 'yiz-ui'

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

const remoteData = ref<Row[]>([])

const remoteSortLoading = ref(false)

const remoteSortSignal = ref<TableSortState | null>(null)

let remoteSortTimer: ReturnType<typeof setTimeout> | null = null

function sortRemoteRows(rows: readonly Row[], sortState: TableSortState | null) {
  if (!sortState) return [...rows]
  const result = [...rows]
  const { field, order } = sortState
  result.sort((a, b) => {
    const left = a[field as keyof Row]
    const right = b[field as keyof Row]
    const compared =
      typeof left === 'number' && typeof right === 'number' ? left - right : String(left).localeCompare(String(right))
    return order === 'asc' ? compared : -compared
  })
  return result
}

watch(
  data,
  (rows) => {
    remoteData.value = sortRemoteRows(rows, remoteSortSignal.value)
  },
  { immediate: true },
)

function onRemoteSortChange(sortState: TableSortState | null) {
  remoteSortSignal.value = sortState
  remoteSortLoading.value = true
  if (remoteSortTimer !== null) clearTimeout(remoteSortTimer)
  remoteSortTimer = setTimeout(() => {
    remoteData.value = sortRemoteRows(data.value, sortState)
    remoteSortLoading.value = false
    remoteSortTimer = null
  }, 5000)
}

const remoteSortSignalText = computed(() => {
  const sortState = remoteSortSignal.value
  return sortState
    ? $t('demo.table.remoteSortSignal', { field: sortState.field, order: sortState.order })
    : $t('demo.table.remoteSortCleared')
})

onBeforeUnmount(() => {
  if (remoteSortTimer !== null) clearTimeout(remoteSortTimer)
})
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
