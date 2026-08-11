<template>
  <y-checkbox v-model:checked="checked1">{{ t('demo.checkbox.defaultChecked') }}</y-checkbox
  ><span class="demo-hint">A: {{ checked1 }}, B: {{ checked2 }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const checked1 = ref(true)

const checked2 = ref(false)
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
