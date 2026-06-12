<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Pagination</h2>
    <p class="demo-section-desc">Page navigation for long lists. Supports page size, quick jump, simple mode and disabled state.</p>

    <y-card title="Basic">
      <y-pagination v-model:page="page" :total="128" />
      <p class="demo-pagination-info">Current page: {{ page }}</p>
    </y-card>

    <y-card title="Total and page size" style="margin-top: 8px">
      <y-pagination
        v-model:page="sizePage"
        v-model:page-size="pageSize"
        :total="256"
        show-total
        show-size-changer
        @change="onChange"
      />
      <p class="demo-pagination-info">Page: {{ sizePage }}, page size: {{ pageSize }}</p>
      <p class="demo-pagination-info">Last change: {{ lastChange }}</p>
    </y-card>

    <y-card title="Quick jumper" style="margin-top: 8px">
      <y-pagination v-model:page="jumpPage" :total="500" show-total show-quick-jumper />
    </y-card>

    <y-card title="Small" style="margin-top: 8px">
      <y-pagination v-model:page="smallPage" :total="180" size="small" show-total />
    </y-card>

    <y-card title="Simple" style="margin-top: 8px">
      <y-pagination v-model:page="simplePage" :total="320" simple />
    </y-card>

    <y-card title="Disabled" style="margin-top: 8px">
      <y-pagination :page="3" :total="100" disabled show-total show-size-changer show-quick-jumper />
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const page = ref(1)
const sizePage = ref(2)
const pageSize = ref(20)
const jumpPage = ref(5)
const smallPage = ref(3)
const simplePage = ref(8)
const lastChange = ref('none')

function onChange(pageValue: number, pageSizeValue: number) {
  lastChange.value = `page ${pageValue}, page size ${pageSizeValue}`
}
</script>

<style scoped>
.demo-pagination-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}

.demo-pagination-info + .demo-pagination-info {
  margin-top: 4px;
}
</style>
