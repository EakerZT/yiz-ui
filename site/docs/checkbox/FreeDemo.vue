<template>
  <y-checkbox-group v-model:value="group3" direction="free">
    <div>
      <div style="font-size: 13px; color: #999; margin-bottom: 4px">{{ t('demo.checkbox.group1') }}</div>
      <y-checkbox value="apple">Apple</y-checkbox>
      <y-checkbox value="banana">Banana</y-checkbox>
    </div>
    <div>
      <div style="font-size: 13px; color: #999; margin-bottom: 4px">{{ t('demo.checkbox.group2') }}</div>
      <y-checkbox value="orange">Orange</y-checkbox>
      <y-checkbox value="mango">{{ t('demo.checkbox.optionC') }}</y-checkbox>
    </div> </y-checkbox-group
  ><span class="demo-hint">{{ group3 }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const group3 = ref<string[]>([])
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
