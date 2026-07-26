<template>
  <div class="demo-progress-list">
    <y-progress :percentage="25" />
    <y-progress :percentage="50" />
    <y-progress :percentage="75" />
  </div>
</template>

<style scoped>
.demo-progress-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
