<template>
  <y-checkbox-group v-model:value="slotGroup" direction="horizontal">
    <y-checkbox value="a">{{ t('demo.checkbox.customA') }}</y-checkbox>
    <y-checkbox value="b">{{ t('demo.checkbox.customB') }}</y-checkbox>
    <y-checkbox value="c">{{ t('demo.checkbox.customC') }}</y-checkbox> </y-checkbox-group
  ><span class="demo-hint">{{ slotGroup }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const slotGroup = ref(['a', 'c'])
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
