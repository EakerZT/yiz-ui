<template>
  <y-button-group>
    <span class="demo-loading-item">
      <y-loading />
      <em>ring</em>
    </span>
    <span class="demo-loading-item">
      <y-loading indicator="spin" />
      <em>spin</em>
    </span>
    <span class="demo-loading-item">
      <y-loading indicator="think" />
      <em>think</em>
    </span>
  </y-button-group>
</template>

<style scoped>
.demo-loading-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}
.demo-loading-item em {
  font-style: normal;
  color: #bbb;
}
</style>
