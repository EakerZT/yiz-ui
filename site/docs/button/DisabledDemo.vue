<template>
  <ButtonGroup wrap gap="8">
    <Button disabled>outlined</Button>
    <Button type="primary" disabled>primary</Button>
    <Button type="dash" disabled>dash</Button>
    <Button type="filled" disabled>filled</Button>
    <Button type="text" disabled>text</Button>
    <Button type="plain" disabled>plain</Button>
  </ButtonGroup>
</template>

<script lang="ts" setup>
import { Button, ButtonGroup } from 'yiz-ui'
</script>
