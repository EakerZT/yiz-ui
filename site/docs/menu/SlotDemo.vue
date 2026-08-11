<template>
  <y-menu v-model:select="v3" @select="onSelect3">
    <y-menu-item :label="t('demo.common.home')" key="home" />
    <y-menu-divider :name="t('demo.menu.navigationGroup')" />
    <y-menu-item :label="t('demo.common.products')" key="products">
      <y-menu-item :label="t('demo.common.allProducts')" key="all-products" />
      <y-menu-divider />
      <y-menu-item :label="t('demo.common.categories')" key="categories">
        <y-menu-item :label="t('demo.common.tags')" key="tags" />
      </y-menu-item>
    </y-menu-item>
    <y-menu-item :label="t('demo.common.settings')" key="settings">
      <y-menu-item :label="t('demo.common.profile')" key="profile" />
      <y-menu-item :label="t('demo.common.systemSettings')" key="system" />
    </y-menu-item> </y-menu
  ><span class="demo-hint">{{ t('demo.menu.selected', { value: v3 }) }}</span>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const v3 = ref()

function onSelect3(_item: any) {}
</script>

<style scoped>
.demo-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #999;
}
</style>
