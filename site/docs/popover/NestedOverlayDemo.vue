<template>
  <y-popover :width="320">
    <template #title>{{ $t('demo.popover.nestedTitle') }}</template>
    <template #content>
      <div class="demo-popover-content">
        <p>{{ $t('demo.popover.nestedContent') }}</p>
        <y-select v-model:value="nestedValue" :options="nestedOptions" />
      </div>
    </template>
    <y-button>{{ $t('demo.popover.nestedButton') }}</y-button>
  </y-popover>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { $t } from 'yiz-ui'

const nestedValue = ref('member')

const nestedOptions = computed(() => [
  { label: $t('demo.popover.nestedOptionMember'), value: 'member' },
  { label: $t('demo.popover.nestedOptionRole'), value: 'role' },
  { label: $t('demo.popover.nestedOptionDepartment'), value: 'department' },
])
</script>

<style scoped>
.demo-popover-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
