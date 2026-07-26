<template>
  <y-menu v-model:select="v5" :items="iconItems" @select="onSelect5" /><span class="demo-hint">{{
    $t('demo.menu.selected', { value: v5 })
  }}</span>
</template>

<script lang="ts" setup>
import { Home20Regular, Info20Regular, Settings20Regular } from '@vicons/fluent'
import { computed, h, ref } from 'vue'
import { $t, Icon } from 'yiz-ui'

const v5 = ref()

const iconItems = computed(() => [
  { label: $t('demo.common.home'), key: 'home', icon: () => h(Icon, { icon: Home20Regular }) },
  { label: $t('demo.common.settings'), key: 'settings', icon: () => h(Icon, { icon: Settings20Regular }) },
  { label: $t('demo.common.about'), key: 'info', icon: () => h(Icon, { icon: Info20Regular }) },
])

function onSelect5(_item: any) {}
</script>

<style scoped>
.demo-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
