<template>
  <y-collapse v-model:value="basicValue">
    <y-collapse-item name="profile" :title="$t('demo.collapse.profileTitle')">
      {{ $t('demo.collapse.profileContent') }}
    </y-collapse-item>
    <y-collapse-item name="permission" :title="$t('demo.collapse.permissionTitle')">
      {{ $t('demo.collapse.permissionContent') }}
    </y-collapse-item>
  </y-collapse>
  <p class="demo-collapse-info">{{ $t('demo.collapse.activeValue', { value: basicValue.join(', ') }) }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const basicValue = ref(['profile'])
</script>

<style scoped>
.demo-collapse-info {
  margin-top: 8px;
  color: #666;
  font-size: 13px;
}
</style>
