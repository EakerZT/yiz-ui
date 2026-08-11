<template>
  <div class="input-number-small-alignment-demo">
    <span class="input-number-small-alignment-label">{{ t('demo.common.size') }}：</span>
    <y-input-number v-model:value="width" size="small" :prefix="t('demo.inputNumber.width')" style="width: 236px" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const width = ref<number | null>(1920)
</script>

<style scoped>
.input-number-small-alignment-demo {
  display: flex;
  align-items: center;
}

.input-number-small-alignment-label {
  width: 80px;
}
</style>
