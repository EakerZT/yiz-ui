<template>
  <section class="demo-section">
    <h2 class="demo-section-title">Pagination 分页</h2>
    <p class="demo-section-desc">用于长列表的分页导航，支持每页条数、快速跳转、简洁模式和禁用状态。</p>

    <y-card title="基础用法">
      <y-pagination v-model:page="page" :total="128" />
      <p class="demo-pagination-info">当前页：{{ page }}</p>
    </y-card>

    <y-card title="总数和每页条数" style="margin-top: 8px">
      <y-pagination
        v-model:page="sizePage"
        v-model:page-size="pageSize"
        :total="256"
        show-total
        show-size-changer
        @change="onChange"
      />
      <p class="demo-pagination-info">页码：{{ sizePage }}，每页条数：{{ pageSize }}</p>
      <p class="demo-pagination-info">上次变更：{{ lastChange }}</p>
    </y-card>

    <y-card title="快速跳转" style="margin-top: 8px">
      <y-pagination v-model:page="jumpPage" :total="500" show-total show-quick-jumper />
    </y-card>

    <y-card title="小尺寸" style="margin-top: 8px">
      <y-pagination v-model:page="smallPage" :total="180" size="small" show-total />
    </y-card>

    <y-card title="简洁模式" style="margin-top: 8px">
      <y-pagination v-model:page="simplePage" :total="320" simple />
    </y-card>

    <y-card title="禁用" style="margin-top: 8px">
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
const lastChange = ref('无')

function onChange(pageValue: number, pageSizeValue: number) {
  lastChange.value = `页码 ${pageValue}，每页条数 ${pageSizeValue}`
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
