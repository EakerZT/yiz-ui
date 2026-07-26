<template>
  <y-radio v-model:checked="radio1A" value="a" :label="$t('demo.checkbox.optionA')" /><y-radio
    v-model:checked="radio1B"
    value="b"
    :label="$t('demo.checkbox.optionB')"
  /><span class="demo-hint">{{ radio1A }} / {{ radio1B }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const radio1A = ref(true)

const radio1B = ref(false)
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
