<template>
  <ButtonGroup>
    <Button type="primary"><Icon :icon="Flash16Regular" /> Search</Button>
    <Button type="primary" shape="circle"><Icon :icon="Flash16Regular" /></Button>
  </ButtonGroup>
</template>

<script lang="ts" setup>
import { Flash16Regular } from '@vicons/fluent'
import { Button, ButtonGroup, Icon } from 'yiz-ui'
</script>
