<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.pagination') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.pagination.desc') }}</p>

    <y-card :title="$t('demo.common.basic')">
      <y-pagination v-model:page="page" :total="128" />
      <p class="demo-pagination-info">{{ $t('demo.pagination.currentPage', { page }) }}</p>
    </y-card>

    <y-card :title="$t('demo.pagination.totalAndSize')" style="margin-top: 8px">
      <y-pagination
        v-model:page="sizePage"
        v-model:page-size="pageSize"
        :total="256"
        show-total
        show-size-changer
        @change="onChange"
      />
      <p class="demo-pagination-info">{{ $t('demo.pagination.pageAndSize', { page: sizePage, pageSize }) }}</p>
      <p class="demo-pagination-info">{{ $t('demo.pagination.lastChange', { value: lastChange }) }}</p>
    </y-card>

    <y-card :title="$t('demo.pagination.quickJumper')" style="margin-top: 8px">
      <y-pagination v-model:page="jumpPage" :total="500" show-total show-quick-jumper />
    </y-card>

    <y-card :title="$t('demo.common.size')" style="margin-top: 8px">
      <div class="demo-pagination-size-list">
        <y-radio-button-group v-model:value="paginationSize" :options="sizeOptions" />
        <y-pagination
          v-model:page="sizeDemoPage"
          :total="180"
          :size="paginationSize"
          show-total
          show-size-changer
          show-quick-jumper
        />
      </div>
    </y-card>

    <y-card :title="$t('demo.pagination.simple')" style="margin-top: 8px">
      <y-pagination v-model:page="simplePage" :total="320" simple />
    </y-card>

    <y-card :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-pagination :page="3" :total="100" disabled show-total show-size-changer show-quick-jumper />
    </y-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

type DemoSize = 'small' | 'default' | 'large'

const page = ref(1)
const sizePage = ref(2)
const pageSize = ref(20)
const jumpPage = ref(5)
const sizeDemoPage = ref(3)
const simplePage = ref(8)
const lastChange = ref($t('demo.common.none'))
const paginationSize = ref<DemoSize>('default')
const sizeOptions = [
  { label: 'small', value: 'small' },
  { label: 'default', value: 'default' },
  { label: 'large', value: 'large' },
]

function onChange(pageValue: number, pageSizeValue: number) {
  lastChange.value = $t('demo.pagination.changeLabel', { page: pageValue, pageSize: pageSizeValue })
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

.demo-pagination-size-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
