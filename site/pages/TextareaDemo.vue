<template>
  <section class="demo-section">
    <h2 class="demo-section-title">{{ $t('demo.nav.textarea') }}</h2>
    <p class="demo-section-desc">{{ $t('demo.textarea.desc') }}</p>

    <!-- Basic -->
    <demo-card :source-index="0" :title="$t('demo.common.basic')" style="margin-top: 8px">
      <y-textarea v-model:value="text1" :placeholder="$t('demo.textarea.placeholder')" />
      <p style="margin-top: 8px; font-size: 13px; color: #999">{{ $t('demo.textarea.value') }}: {{ text1 }}</p>
    </demo-card>

    <!-- Rows -->
    <demo-card :source-index="1" :title="$t('demo.textarea.rows')" style="margin-top: 8px">
      <y-textarea v-model:value="text2" :rows="6" :placeholder="$t('demo.textarea.rowsPlaceholder')" />
    </demo-card>

    <!-- Maxlength + showCount -->
    <demo-card :source-index="2" :title="$t('demo.textarea.maxlength')" style="margin-top: 8px">
      <y-textarea
        v-model:value="text3"
        :maxlength="100"
        show-count
        :placeholder="$t('demo.textarea.maxlengthPlaceholder')"
      />
    </demo-card>

    <!-- Clearable -->
    <demo-card :source-index="3" :title="$t('demo.textarea.clearable')" style="margin-top: 8px">
      <y-textarea v-model:value="text4" clearable :placeholder="$t('demo.textarea.clearablePlaceholder')" />
    </demo-card>

    <!-- Resize -->
    <demo-card :source-index="4" :title="$t('demo.textarea.resize')" style="margin-top: 8px">
      <p style="font-size: 13px; color: #999; margin-bottom: 8px">{{ $t('demo.textarea.resizeNone') }}</p>
      <y-textarea
        v-model:value="text5"
        resize="none"
        :placeholder="$t('demo.textarea.resizeNonePlaceholder')"
        style="margin-bottom: 12px"
      />
      <p style="font-size: 13px; color: #999; margin-bottom: 8px">{{ $t('demo.textarea.resizeBoth') }}</p>
      <y-textarea v-model:value="text6" resize="both" :placeholder="$t('demo.textarea.resizeBothPlaceholder')" />
    </demo-card>

    <!-- Disabled -->
    <demo-card :source-index="5" :title="$t('demo.common.disabled')" style="margin-top: 8px">
      <y-textarea v-model:value="text7" :placeholder="$t('demo.textarea.disabledPlaceholder')" disabled />
    </demo-card>
  </section>
</template>

<script lang="ts" setup>
import { $t } from 'yiz-ui'
import { ref } from 'vue'

const text1 = ref('')
const text2 = ref('')
const text3 = ref('')
const text4 = ref('')
const text5 = ref('')
const text6 = ref('')
const text7 = ref('This textarea is disabled and cannot be edited.')
</script>
