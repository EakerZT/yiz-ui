<template>
  <div class="demo-progress-list">
    <y-progress :percentage="80" status="success" />
    <y-progress :percentage="60" status="warning" />
    <y-progress :percentage="40" status="error" />
  </div>
</template>

<style scoped>
.demo-progress-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
