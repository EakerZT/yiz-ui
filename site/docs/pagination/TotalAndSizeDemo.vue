<template>
  <y-pagination
    v-model:page="sizePage"
    v-model:page-size="pageSize"
    :total="256"
    show-total
    show-size-changer
    @change="onChange"
  />
  <p class="demo-pagination-info">{{ t('demo.pagination.pageAndSize', { page: sizePage, pageSize }) }}</p>
  <p class="demo-pagination-info">{{ t('demo.pagination.lastChange', { value: lastChangeText }) }}</p>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const sizePage = ref(2)

const pageSize = ref(20)

const lastChange = ref<{ page: number; pageSize: number } | null>(null)

const lastChangeText = computed(() =>
  lastChange.value ? t('demo.pagination.changeLabel', lastChange.value) : t('demo.common.none'),
)

function onChange(pageValue: number, pageSizeValue: number) {
  lastChange.value = { page: pageValue, pageSize: pageSizeValue }
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
