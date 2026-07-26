<template>
  <y-button-group>
    <y-popover trigger="click" :content="$t('demo.popover.clickContent')">
      <y-button>{{ $t('demo.popover.click') }}</y-button>
    </y-popover>
    <y-popover trigger="hover" :content="$t('demo.popover.hoverContent')">
      <y-button>{{ $t('demo.popover.hover') }}</y-button>
    </y-popover>
    <y-popover trigger="focus" :content="$t('demo.popover.focusContent')">
      <y-button>{{ $t('demo.popover.focus') }}</y-button>
    </y-popover>
  </y-button-group>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
