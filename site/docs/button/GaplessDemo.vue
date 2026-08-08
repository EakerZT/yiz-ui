<template>
  <div class="demo-button-gapless">
    <div class="demo-button-gapless-item">
      <span>{{ $t('demo.common.horizontal') }}</span>
      <y-button-group :gap="0">
        <y-button>left</y-button>
        <y-button>center</y-button>
        <y-button>right</y-button>
      </y-button-group>
    </div>
    <div class="demo-button-gapless-item">
      <span>{{ $t('demo.common.vertical') }}</span>
      <y-button-group direction="vertical" :gap="0">
        <y-button>top</y-button>
        <y-button>center</y-button>
        <y-button>bottom</y-button>
      </y-button-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
</script>

<style lang="less" scoped>
.demo-button-gapless {
  display: flex;
  align-items: flex-start;
  gap: 32px;
}

.demo-button-gapless-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}
</style>
