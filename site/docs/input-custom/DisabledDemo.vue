<template>
  <y-input-custom disabled style="width: 240px">
    <span class="demo-input-custom-placeholder">{{ $t('demo.inputCustom.disabledValue') }}</span>
  </y-input-custom>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>

<style scoped>
.demo-input-custom-placeholder {
  color: #c0c4cc;
}
</style>
