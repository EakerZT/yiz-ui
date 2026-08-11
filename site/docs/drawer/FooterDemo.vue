<template>
  <y-button-group>
    <y-button type="primary" @click="visible8 = true">{{ t('demo.drawer.customFooter') }}</y-button>
    <y-button @click="visible15 = true">{{ t('demo.drawer.disabledFooter') }}</y-button>
  </y-button-group>

  <y-drawer v-model:show="visible8" :title="t('demo.common.withFooter')">
    <p>{{ t('demo.drawer.bodyContent') }}</p>
    <p style="margin-top: 12px; color: #888">{{ t('demo.drawer.bodyContentHint') }}</p>
    <template #footer>
      <div style="display: flex; gap: 12px; justify-content: flex-end">
        <y-button @click="visible8 = false">{{ t('demo.common.cancel') }}</y-button>
        <y-button type="primary" @click="visible8 = false">{{ t('demo.common.confirm') }}</y-button>
      </div>
    </template>
  </y-drawer>

  <y-drawer v-model:show="visible15" :title="t('demo.drawer.disabledFooter')" disabled-footer>
    <p>{{ t('demo.drawer.disabledFooterHint') }}</p>
  </y-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const visible8 = ref(false)

const visible15 = ref(false)
</script>
