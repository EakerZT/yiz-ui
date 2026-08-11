<template>
  <y-radio-button v-model:checked="buttonRadioLeft" value="left">{{ t('demo.radio.left') }}</y-radio-button
  ><y-radio-button v-model:checked="buttonRadioRight" value="right">{{ t('demo.radio.right') }}</y-radio-button
  ><span class="demo-hint">{{ buttonRadioLeft }} / {{ buttonRadioRight }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const buttonRadioLeft = ref(true)

const buttonRadioRight = ref(false)
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
