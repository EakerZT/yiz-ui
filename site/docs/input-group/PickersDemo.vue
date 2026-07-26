<template>
  <div class="demo-input-group-stack">
    <y-input-group>
      <y-date-picker v-model:value="dateValue" clearable style="width: 180px" />
      <y-button>{{ $t('demo.common.confirm') }}</y-button>
    </y-input-group>
    <y-input-group>
      <y-time-picker v-model:value="timeValue" clearable style="width: 180px" />
      <y-button>{{ $t('demo.common.confirm') }}</y-button>
    </y-input-group>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const dateValue = ref<Date | null>(null)

const timeValue = ref<string | null>(null)
</script>

<style scoped>
.demo-input-group-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}
</style>
