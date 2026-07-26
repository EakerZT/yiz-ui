<template>
  <div style="height: 250px">
    <y-table :data="data" bordered loading>
      <template #loading>
        <div class="demo-table-custom-loading">
          <span class="demo-table-loading-dot" />
          {{ $t('demo.table.customLoadingText') }}
        </div>
      </template>
      <y-table-column :label="$t('demo.common.name')" field="name" />
      <y-table-column :label="$t('demo.common.age')" field="age" align="center" />
      <y-table-column :label="$t('demo.common.city')" field="city" />
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
</script>

<style scoped>
.demo-table-custom-loading {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #722ed1;
  font-size: 14px;
}

.demo-table-loading-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: currentColor;
  animation: demo-table-loading-pulse 0.8s ease-in-out infinite alternate;
}

@keyframes demo-table-loading-pulse {
  to {
    opacity: 0.25;
    transform: scale(0.7);
  }
}
</style>
