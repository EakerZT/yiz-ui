<template>
  <nav class="yiz-pagination" :class="vClass" :aria-label="$t('pagination.ariaLabel')">
    <span v-if="showTotal" class="yiz-pagination-total">{{ totalLabel }}</span>

    <button
      class="yiz-pagination-item yiz-pagination-nav"
      type="button"
      :disabled="disabled || currentPage <= 1"
      :aria-label="$t('pagination.previousPage')"
      @click="goToPage(currentPage - 1)"
    >
      &lt;
    </button>

    <template v-if="simple">
      <span class="yiz-pagination-simple">
        <input
          class="yiz-pagination-input"
          :value="simplePageInput"
          :disabled="disabled"
          inputmode="numeric"
          @input="simplePageInput = ($event.target as HTMLInputElement).value"
          @keydown.enter="commitSimplePage"
          @blur="commitSimplePage"
        />
        <span class="yiz-pagination-simple-split">/</span>
        <span>{{ pageCount }}</span>
      </span>
    </template>

    <template v-else>
      <button
        v-for="(item, index) in pagerItems"
        :key="`${item}-${index}`"
        class="yiz-pagination-item"
        :class="{
          'yiz-pagination-item-active': item === currentPage,
          'yiz-pagination-more': item === 'prev-more' || item === 'next-more'
        }"
        type="button"
        :disabled="disabled"
        :aria-current="item === currentPage ? 'page' : undefined"
        @click="onPagerClick(item)"
      >
        {{ typeof item === 'number' ? item : '...' }}
      </button>
    </template>

    <button
      class="yiz-pagination-item yiz-pagination-nav"
      type="button"
      :disabled="disabled || currentPage >= pageCount"
      :aria-label="$t('pagination.nextPage')"
      @click="goToPage(currentPage + 1)"
    >
      &gt;
    </button>

    <span v-if="showSizeChanger" class="yiz-pagination-size-select">
      <Select
        :model-value="pageSizeValue"
        :options="pageSizeOptions"
        :disabled="disabled"
        :size="size"
        @update:model-value="onPageSizeChange"
      />
    </span>

    <span v-if="showQuickJumper" class="yiz-pagination-jumper">
      <span>{{ $t('pagination.goTo') }}</span>
      <input
        class="yiz-pagination-input"
        :value="quickJumpInput"
        :disabled="disabled"
        inputmode="numeric"
        @input="quickJumpInput = ($event.target as HTMLInputElement).value"
        @keydown.enter="commitQuickJump"
      />
      <button class="yiz-pagination-go" type="button" :disabled="disabled" @click="commitQuickJump">{{ $t('pagination.go') }}</button>
    </span>
  </nav>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { $t } from '../locale'
import Select from '../select/Select.vue'

type PagerItem = number | 'prev-more' | 'next-more'

const page = defineModel<number>('page', { default: 1 })
const pageSize = defineModel<number>('pageSize', { default: 10 })

const props = withDefaults(
  defineProps<{
    total?: number
    pageSizes?: number[]
    pagerCount?: number
    showTotal?: boolean
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    disabled?: boolean
    simple?: boolean
    size?: 'default' | 'small'
  }>(),
  {
    total: 0,
    pageSizes: () => [10, 20, 50, 100],
    pagerCount: 7,
    showTotal: false,
    showSizeChanger: false,
    showQuickJumper: false,
    disabled: false,
    simple: false,
    size: 'default'
  }
)

const emit = defineEmits<{
  change: [page: number, pageSize: number]
  pageSizeChange: [pageSize: number]
}>()

const quickJumpInput = ref('')
const simplePageInput = ref('1')

const normalizedTotal = computed(() => Math.max(0, Number(props.total) || 0))
const pageSizeValue = computed(() => Math.max(1, Number(pageSize.value) || 10))
const pageCount = computed(() => Math.max(1, Math.ceil(normalizedTotal.value / pageSizeValue.value)))
const currentPage = computed(() => clampPage(Number(page.value) || 1))
const pageSizeOptions = computed(() => {
  return props.pageSizes.map((sizeOption) => ({
    label: $t('pagination.pageSize', { size: sizeOption }),
    value: sizeOption
  }))
})

const vClass = computed(() => ({
  'yiz-pagination-disabled': props.disabled,
  'yiz-pagination-small': props.size === 'small',
  'yiz-pagination-simple-mode': props.simple
}))

const totalLabel = computed(() => {
  if (normalizedTotal.value === 0) return $t('pagination.total', { total: 0 })
  const start = (currentPage.value - 1) * pageSizeValue.value + 1
  const end = Math.min(currentPage.value * pageSizeValue.value, normalizedTotal.value)
  return $t('pagination.totalRange', { total: normalizedTotal.value, start, end })
})

const normalizedPagerCount = computed(() => {
  const count = Math.max(5, Number(props.pagerCount) || 7)
  return count % 2 === 0 ? count + 1 : count
})

const pagerItems = computed<PagerItem[]>(() => {
  const count = pageCount.value
  const pagerCount = normalizedPagerCount.value
  const current = currentPage.value

  if (count <= pagerCount) {
    return range(1, count)
  }

  const sideCount = Math.max(1, Math.floor((pagerCount - 5) / 2))
  const leftBoundary = 3 + sideCount
  const rightBoundary = count - 2 - sideCount

  if (current <= leftBoundary) {
    return [...range(1, pagerCount - 2), 'next-more', count]
  }

  if (current >= rightBoundary) {
    return [1, 'prev-more', ...range(count - pagerCount + 3, count)]
  }

  return [1, 'prev-more', ...range(current - sideCount, current + sideCount), 'next-more', count]
})

watch(
  () => [page.value, pageCount.value] as const,
  () => {
    const nextPage = clampPage(Number(page.value) || 1)
    if (nextPage !== page.value) {
      page.value = nextPage
    }
    simplePageInput.value = String(nextPage)
  },
  { immediate: true }
)

function range(start: number, end: number): number[] {
  const result: number[] = []
  for (let i = start; i <= end; i++) {
    result.push(i)
  }
  return result
}

function clampPage(value: number): number {
  return Math.min(Math.max(1, Math.trunc(value)), pageCount.value)
}

function goToPage(value: number) {
  if (props.disabled) return

  const nextPage = clampPage(value)
  if (nextPage === page.value) return

  page.value = nextPage
  simplePageInput.value = String(nextPage)
  emit('change', nextPage, pageSizeValue.value)
}

function onPagerClick(item: PagerItem) {
  if (typeof item === 'number') {
    goToPage(item)
  } else if (item === 'prev-more') {
    goToPage(currentPage.value - normalizedPagerCount.value + 2)
  } else {
    goToPage(currentPage.value + normalizedPagerCount.value - 2)
  }
}

function onPageSizeChange(value: unknown) {
  if (props.disabled) return

  const nextPageSize = Math.max(1, Number(value) || pageSizeValue.value)
  if (nextPageSize === pageSizeValue.value) return

  pageSize.value = nextPageSize
  const nextPage = Math.min(currentPage.value, Math.max(1, Math.ceil(normalizedTotal.value / nextPageSize)))
  page.value = nextPage
  simplePageInput.value = String(nextPage)
  emit('pageSizeChange', nextPageSize)
  emit('change', nextPage, nextPageSize)
}

function commitQuickJump() {
  const value = Number(quickJumpInput.value)
  if (!Number.isFinite(value)) return
  goToPage(value)
  quickJumpInput.value = ''
}

function commitSimplePage() {
  const value = Number(simplePageInput.value)
  if (!Number.isFinite(value)) {
    simplePageInput.value = String(currentPage.value)
    return
  }
  goToPage(value)
  simplePageInput.value = String(currentPage.value)
}
</script>

<style lang="less">
.yiz-pagination {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #333;
  font-size: 14px;
  line-height: 1;
  user-select: none;
}

.yiz-pagination-total {
  color: #666;
  white-space: nowrap;
}

.yiz-pagination-item,
.yiz-pagination-go {
  min-width: 32px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 3px;
  background: #fff;
  color: #333;
  font-family: inherit;
  font-size: 14px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s,
    background-color 0.2s;
}

.yiz-pagination-item:not(:disabled):hover,
.yiz-pagination-go:not(:disabled):hover {
  color: var(--yiz-color-primary);
  border-color: var(--yiz-color-primary);
}

.yiz-pagination-item-active,
.yiz-pagination-item-active:not(:disabled):hover {
  background: var(--yiz-color-primary);
  border-color: var(--yiz-color-primary);
  color: #fff;
}

.yiz-pagination-more {
  font-weight: 600;
}

.yiz-pagination-item:disabled,
.yiz-pagination-go:disabled,
.yiz-pagination-input:disabled {
  cursor: not-allowed;
  color: #bfbfbf;
  background: #f5f5f5;
}

.yiz-pagination-simple,
.yiz-pagination-jumper {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.yiz-pagination-simple-split {
  color: #999;
}

.yiz-pagination-input {
  height: 32px;
  border: 1px solid var(--yiz-color-border, #d9d9d9);
  border-radius: 3px;
  background: #fff;
  color: #333;
  font-family: inherit;
  font-size: 14px;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.yiz-pagination-input {
  width: 52px;
  padding: 0 8px;
  text-align: center;
}

.yiz-pagination-input:focus {
  border-color: var(--yiz-color-primary);
  box-shadow: 0 0 0 2px var(--yiz-color-primary-light9);
}

.yiz-pagination-size-select {
  width: 120px;
  flex-shrink: 0;
}

.yiz-pagination-disabled {
  color: #bfbfbf;
}

.yiz-pagination-small {
  gap: 6px;
  font-size: 13px;

  .yiz-pagination-item,
  .yiz-pagination-go {
    min-width: 26px;
    height: 26px;
    padding: 0 6px;
    font-size: 13px;
    line-height: 24px;
  }

  .yiz-pagination-input {
    height: 26px;
    font-size: 13px;
  }

  .yiz-pagination-input {
    width: 46px;
  }

  .yiz-pagination-size-select {
    width: 110px;
  }
}
</style>
