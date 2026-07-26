<template>
  <y-input-group :before-addon="$t('demo.inputGroup.accountAddon')">
    <y-input v-model:value="account" :placeholder="$t('demo.inputGroup.account')" style="width: 180px" />
    <y-input-password
      v-model:value="password"
      :placeholder="$t('demo.inputGroup.passwordPlaceholder')"
      style="width: 220px"
    />
    <y-button>{{ $t('demo.inputGroup.login') }}</y-button>
  </y-input-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { $t } from 'yiz-ui'

const account = ref('')

const password = ref('')
</script>
