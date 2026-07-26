<template>
  <y-dropmenu
    :options="nestedOptions"
    :label="$t('demo.dropmenu.openNested')"
    placement="bottom-end"
    @select="onSelect3"
  /><span class="demo-hint">{{ $t('demo.dropmenu.selected', { value: v3 ?? $t('demo.common.empty') }) }}</span>
</template>

<script lang="ts" setup>
import { Folder20Regular, Settings20Regular } from '@vicons/fluent'
import { computed, h, ref } from 'vue'
import { $t, Icon } from 'yiz-ui'

const v3 = ref()

const nestedOptions = computed(() => [
  { label: $t('demo.common.products'), key: 'products', icon: () => h(Icon, { icon: Folder20Regular }) },
  {
    label: $t('demo.common.settings'),
    key: 'settings',
    icon: () => h(Icon, { icon: Settings20Regular }),
    children: [
      { label: $t('demo.common.profile'), key: 'profile' },
      { label: $t('demo.common.systemSettings'), key: 'system' },
    ],
  },
  { label: $t('demo.common.about'), key: 'about' },
])

function onSelect3(item: any) {
  v3.value = item.key
}
</script>

<style scoped>
.demo-hint {
  display: inline-block;
  margin-left: 8px;
  font-size: 12px;
  color: #999;
}
</style>
