<template>
  <div class="popconfirm-placement-demo">
    <y-popconfirm
      v-for="item in placements"
      :key="item.value"
      :title="t('demo.popconfirm.simpleTitle')"
      :placement="item.value"
    >
      <y-button>{{ item.label }}</y-button>
    </y-popconfirm>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLocale, type PopconfirmPlacement } from 'yiz-ui'

const t = useLocale()

const placements = computed<{ label: string; value: PopconfirmPlacement }[]>(() => [
  { label: t('demo.popconfirm.top'), value: 'top' },
  { label: t('demo.popconfirm.bottom'), value: 'bottom' },
  { label: t('demo.popconfirm.left'), value: 'left' },
  { label: t('demo.popconfirm.right'), value: 'right' },
])
</script>

<style scoped>
.popconfirm-placement-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
