<template>
  <y-menu v-model:select="v6" :items="fnIconItems" @select="onSelect6" /><span class="demo-hint">{{
    $t('demo.menu.selected', { value: v6 })
  }}</span>
</template>

<script lang="ts" setup>
import { Home20Regular, Info20Regular, Settings20Regular } from '@vicons/fluent'
import { computed, h, ref } from 'vue'
import { $t, Icon } from 'yiz-ui'

const v6 = ref()

const fnIconItems = computed(() => [
  { label: $t('demo.common.home'), key: 'home', icon: () => h(Icon, { icon: Home20Regular }) },
  { label: $t('demo.common.settings'), key: 'settings', icon: () => h(Icon, { icon: Settings20Regular }) },
  { label: $t('demo.common.about'), key: 'info', icon: () => h(Icon, { icon: Info20Regular }) },
])

function onSelect6(_item: any) {}
</script>

<style scoped>
.demo-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
