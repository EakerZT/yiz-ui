<template>
  <div class="demo-tag-checkable-panel">
    <y-button-group>
      <y-tag v-model:checked="checkableTag1" checkable>{{ t('demo.tag.checkableDefault') }}</y-tag>
      <y-tag v-model:checked="checkableTag2" color="success" checkable closable>
        {{ t('demo.tag.checkableClosable') }}
      </y-tag>
      <y-tag v-model:checked="disabledCheckableTag" checkable disabled>
        {{ t('demo.tag.checkableDisabled') }}
      </y-tag>
      <y-tag v-model:checked="disabledCheckedTag" color="warning" checkable disabled>
        {{ t('demo.tag.checkableDisabledChecked') }}
      </y-tag>
    </y-button-group>
    <span class="demo-tag-state">
      {{
        t('demo.tag.checkedState', {
          first: checkableTag1 ? 'true' : 'false',
          second: checkableTag2 ? 'true' : 'false',
        })
      }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from 'yiz-ui'

const t = useLocale()

const checkableTag1 = ref(false)

const checkableTag2 = ref(true)

const disabledCheckableTag = ref(false)

const disabledCheckedTag = ref(true)
</script>

<style scoped>
.demo-tag-checkable-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.demo-tag-state {
  color: #666;
  font-size: 13px;
}
</style>
