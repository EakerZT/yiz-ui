<template>
  <y-input-group>
    <y-checkbox v-model:checked="includeArchived" border>{{ $t('demo.common.enabled') }}</y-checkbox>
    <y-input v-model:value="keyword" :placeholder="$t('demo.inputGroup.keyword')" style="width: 220px" />
    <y-button type="primary">{{ $t('demo.inputGroup.searchButton') }}</y-button>
    <y-button type="primary">{{ $t('demo.common.save') }}</y-button>
  </y-input-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const keyword = ref('')

const includeArchived = ref(true)
</script>
