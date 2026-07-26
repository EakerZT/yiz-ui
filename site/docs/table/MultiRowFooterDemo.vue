<template>
  <p class="demo-section-desc" style="margin-bottom: 12px">{{ $t('demo.table.multiRowFooterDesc') }}</p>
  <div style="height: 300px">
    <y-table :data="footerData" bordered stripe no show-footer :footer-method="getFooter">
      <y-table-column :label="$t('demo.table.product')" field="product" width="240px" fixed="left" />
      <y-table-column :label="$t('demo.table.category')" field="category" width="280px" />
      <y-table-column :label="$t('demo.table.quantity')" field="quantity" width="180px" align="right" />
      <y-table-column
        :label="$t('demo.table.unitPrice')"
        field="unitPrice"
        width="220px"
        align="right"
        :formatter="formatMoney"
      />
      <y-table-column
        :label="$t('demo.table.amount')"
        field="amount"
        width="240px"
        align="right"
        fixed="right"
        :formatter="formatMoney"
      />
      <template #footer-cell="{ footerRow, column, value }">
        <span :class="{ 'demo-table-footer-total': footerRow.key === 'total' }">
          {{ column.field === 'amount' && typeof value === 'number' ? formatMoney(value) : value }}
        </span>
      </template>
    </y-table>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { $t, type TableFooterMethod } from 'yiz-ui'

interface FooterDemoRow {
  product: string
  category: string
  quantity: number
  unitPrice: number
  amount: number
}

const footerData = computed<FooterDemoRow[]>(() => [
  { product: 'YIZ-001', category: $t('demo.common.electronics'), quantity: 3, unitPrice: 2999, amount: 8997 },
  { product: 'YIZ-002', category: $t('demo.common.clothing'), quantity: 8, unitPrice: 399, amount: 3192 },
  { product: 'YIZ-003', category: $t('demo.common.food'), quantity: 12, unitPrice: 89, amount: 1068 },
])

const getFooter: TableFooterMethod = ({ data }) => {
  const quantity = data.reduce((sum, row) => sum + Number(row.quantity), 0)
  const amount = data.reduce((sum, row) => sum + Number(row.amount), 0)
  const count = data.length

  return [
    {
      key: 'total',
      cells: {
        product: $t('demo.table.total'),
        quantity,
        amount,
      },
    },
    {
      key: 'average',
      cells: {
        product: $t('demo.table.average'),
        quantity: count ? Number((quantity / count).toFixed(2)) : '-',
        amount: count ? Number((amount / count).toFixed(2)) : '-',
      },
    },
  ]
}

function formatMoney(value: number) {
  return `¥${value.toFixed(2)}`
}
</script>

<style scoped>
.demo-table-footer-total {
  color: var(--yiz-color-primary);
}
</style>
