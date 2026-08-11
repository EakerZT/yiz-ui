<template>
  <y-button-group>
    <y-button @click="visible11 = true">{{ t('demo.drawer.horizontalResize') }}</y-button>
    <y-button @click="visible12 = true">{{ t('demo.drawer.verticalResize') }}</y-button>
  </y-button-group>

  <y-drawer
    v-model:show="visible11"
    :title="t('demo.drawer.horizontalResizeHint')"
    :resize="true"
    resize-min="200px"
    resize-max="80%"
  >
    <p>{{ t('demo.drawer.horizontalResizeConstraint') }}</p>
  </y-drawer>

  <y-drawer
    v-model:show="visible12"
    :title="t('demo.drawer.verticalResizeHint')"
    placement="bottom"
    :resize="true"
    resize-min="150px"
    resize-max="60%"
  >
    <p>{{ t('demo.drawer.verticalResizeConstraint') }}</p>
  </y-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const visible11 = ref(false)

const visible12 = ref(false)
</script>
