<template>
  <div class="demo-popover-row">
    <y-switch v-model:checked="controlledOpen" />
    <y-popover v-model:open="controlledOpen" :content="t('demo.popover.controlledContent')">
      <y-button>{{ t('demo.popover.controlledButton') }}</y-button>
    </y-popover>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const controlledOpen = ref(false)
</script>

<style scoped>
.demo-popover-row {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
</style>
