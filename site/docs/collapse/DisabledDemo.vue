<template>
  <y-collapse v-model:value="disabledValue">
    <y-collapse-item name="enabled" :title="t('demo.collapse.enabledPanel')">
      {{ t('demo.collapse.enabledContent') }}
    </y-collapse-item>
    <y-collapse-item name="disabled" :title="t('demo.collapse.disabledPanel')" disabled>
      {{ t('demo.collapse.disabledContent') }}
    </y-collapse-item>
  </y-collapse>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const disabledValue = ref(['enabled'])
</script>
