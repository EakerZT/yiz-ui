<template>
  <y-button-group>
    <y-tooltip :content="$t('demo.tooltip.tipText')" placement="top">
      <y-button>{{ $t('demo.tooltip.top') }}</y-button>
    </y-tooltip>
    <y-tooltip :content="$t('demo.tooltip.tipText')" placement="bottom">
      <y-button>{{ $t('demo.tooltip.bottom') }}</y-button>
    </y-tooltip>
    <y-tooltip :content="$t('demo.tooltip.tipText')" placement="left">
      <y-button>{{ $t('demo.tooltip.left') }}</y-button>
    </y-tooltip>
    <y-tooltip :content="$t('demo.tooltip.tipText')" placement="right">
      <y-button>{{ $t('demo.tooltip.right') }}</y-button>
    </y-tooltip>
  </y-button-group>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>
