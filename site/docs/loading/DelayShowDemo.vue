<template>
  <y-loading :loading="delayLoading" :delay="500" :tip="$t('demo.loading.delayHint')" />
  <div style="margin-top: 8px">
    <y-button size="small" @click="delayLoading = !delayLoading">
      {{ delayLoading ? $t('demo.loading.stopLoading') : $t('demo.loading.startLoading') }}
    </y-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const delayLoading = ref(false)
</script>
