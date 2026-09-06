<script lang="ts" setup>
defineSlots<{
  /** InputGroup 内的附加内容，可放在开头、中间或结尾。
   * @en Addon content placed at the start, between controls, or at the end of an InputGroup.
   */
  default?: () => unknown
}>()
</script>

<template>
  <div class="yiz-input-addon yiz-input-group-addon"><slot /></div>
</template>
