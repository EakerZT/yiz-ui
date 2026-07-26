<template>
  <y-button-group>
    <y-popover v-for="placement in placements" :key="placement" :placement="placement" :content="placement">
      <y-button>{{ placement }}</y-button>
    </y-popover>
  </y-button-group>
</template>

<script lang="ts" setup>
type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right'

const placements: PopoverPlacement[] = ['top', 'bottom', 'left', 'right']
</script>
