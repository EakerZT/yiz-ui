<template>
  <y-button-group>
    <y-button @click="openDrawer('left')">Left</y-button>
    <y-button @click="openDrawer('right')">Right</y-button>
  </y-button-group>

  <y-drawer
    v-model:show="visible"
    :title="t('demo.drawer.outClose')"
    :placement="placement"
    close-placement="out"
  >
    <p>{{ t('demo.drawer.outCloseHint') }}</p>
  </y-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()
const visible = ref(false)
const placement = ref<'left' | 'right'>('right')

function openDrawer(value: 'left' | 'right') {
  placement.value = value
  visible.value = true
}
</script>
