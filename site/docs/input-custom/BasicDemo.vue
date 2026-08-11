<template>
  <y-input-custom style="width: 240px" @click="toggleStatus">
    <span class="demo-input-custom-value">{{ statusLabel }}</span>
  </y-input-custom>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const statuses = ['pending', 'running', 'done'] as const

const status = ref<(typeof statuses)[number]>('pending')

const statusLabel = computed(() => t(`demo.inputCustom.status.${status.value}`))

function toggleStatus() {
  const index = statuses.indexOf(status.value)
  status.value = statuses[(index + 1) % statuses.length]
}
</script>

<style scoped>
.demo-input-custom-value {
  color: #333;
  white-space: nowrap;
}
</style>
