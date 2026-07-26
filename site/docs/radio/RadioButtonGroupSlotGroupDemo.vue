<template>
  <y-radio-button-group v-model:value="buttonGroup2">
    <y-radio-button value="day">{{ $t('demo.radio.day') }}</y-radio-button>
    <y-radio-button value="week">{{ $t('demo.radio.week') }}</y-radio-button>
    <y-radio-button value="month">{{ $t('demo.radio.month') }}</y-radio-button> </y-radio-button-group
  ><span class="demo-hint">{{ buttonGroup2 }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const buttonGroup2 = ref('week')
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
