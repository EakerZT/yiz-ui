<template>
  <y-button @click="visible13 = true">{{ $t('demo.drawer.secondLevel') }}</y-button>

  <y-drawer v-model:show="visible13" :title="$t('demo.drawer.firstLevel')" width="500px">
    <p>{{ $t('demo.drawer.firstLevelContent') }}</p>
    <div style="margin-top: 16px">
      <y-button type="primary" @click="visible14 = true">{{ $t('demo.drawer.openSecondLevel') }}</y-button>
    </div>
    <y-drawer v-model:show="visible14" :title="$t('demo.drawer.secondLevel')" width="360px">
      <p>{{ $t('demo.drawer.secondLevelContent') }}</p>
      <p style="margin-top: 8px; color: #888">{{ $t('demo.drawer.secondLevelMaskHint') }}</p>
    </y-drawer>
  </y-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const visible13 = ref(false)

const visible14 = ref(false)
</script>
