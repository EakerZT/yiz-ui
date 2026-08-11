<template>
  <y-form :model="profileForm" layout="vertical">
    <y-form-item :label="t('demo.form.profileName')" prop="profileName" required>
      <y-input v-model:value="profileForm.profileName" :placeholder="t('demo.form.profileNamePlaceholder')" />
    </y-form-item>
    <y-form-item :label="t('demo.form.profileDesc')" prop="profileDesc">
      <y-input v-model:value="profileForm.profileDesc" :placeholder="t('demo.form.profileDescPlaceholder')" />
    </y-form-item>
  </y-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const profileForm = reactive({
  profileName: '',
  profileDesc: '',
})
</script>
