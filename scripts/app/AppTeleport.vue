<template>
  <Teleport :to="teleportTo">
    <div class="yiz-app-teleport" :style="teleportTheme">
      <slot />
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { useAppTeleport } from './context'

const { teleportTo, teleportTheme } = useAppTeleport()
</script>

<style lang="less">
.yiz-app-teleport {
  display: contents;
}
</style>
