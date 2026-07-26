<template>
  <div class="demo-progress-list">
    <y-progress :percentage="65" color="#722ed1" :stroke-width="12" />
    <y-progress :percentage="35" color="#13c2c2">
      <template #default="{ percentage: value }">{{ value }} / 100</template>
    </y-progress>
    <y-progress :percentage="90" :show-text="false" />
  </div>
</template>

<style scoped>
.demo-progress-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
