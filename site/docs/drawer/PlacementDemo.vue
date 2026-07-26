<template>
  <y-button-group>
    <y-button @click="openDrawer('left')">Left</y-button>
    <y-button @click="openDrawer('right')">Right</y-button>
    <y-button @click="openDrawer('top')">{{ $t('demo.drawer.top') }}</y-button>
    <y-button @click="openDrawer('bottom')">{{ $t('demo.drawer.bottom') }}</y-button>
  </y-button-group>

  <y-drawer v-model:show="visible2" :title="$t('demo.drawer.placementLabel', { placement })" :placement="placement">
    <p>{{ $t('demo.drawer.placementHint', { placement }) }}</p>
  </y-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const visible2 = ref(false)

const placement = ref<'left' | 'right' | 'top' | 'bottom'>('right')

function openDrawer(p: 'left' | 'right' | 'top' | 'bottom') {
  placement.value = p
  visible2.value = true
}
</script>
