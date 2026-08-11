<template>
  <div style="height: 300px">
    <y-table :data="[]" bordered>
      <y-table-column :label="t('demo.common.name')" field="name" />
      <y-table-column :label="t('demo.common.age')" field="age" />
      <y-table-column :label="t('demo.common.city')" field="city" />
      <y-table-column :label="t('demo.common.status')" field="status" align="center" />
    </y-table>
  </div>
</template>

<script lang="ts" setup>
import { useLocale } from 'yiz-ui'

const t = useLocale()
</script>
