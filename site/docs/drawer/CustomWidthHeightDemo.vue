<template>
  <y-button-group>
    <y-button @click="visible6 = true">width="500px"</y-button>
    <y-button @click="visible7 = true">height="300px"</y-button>
  </y-button-group>

  <y-drawer v-model:show="visible6" :title="t('demo.common.customWidth')" width="500px" placement="right">
    <p>{{ t('demo.drawer.customWidthHint') }}</p>
  </y-drawer>

  <y-drawer v-model:show="visible7" :title="t('demo.drawer.customHeight')" height="300px" placement="bottom">
    <p>{{ t('demo.drawer.customHeightHint') }}</p>
  </y-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const visible6 = ref(false)

const visible7 = ref(false)
</script>
