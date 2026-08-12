<template>
  <Teleport :to="teleportTo">
    <slot />
  </Teleport>
</template>

<script lang="ts" setup>
import { useAppTeleport } from './context'

const { teleportTo } = useAppTeleport()
</script>
