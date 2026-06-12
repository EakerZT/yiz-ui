<template>
  <div class="yiz-empty" :class="{ 'yiz-empty-small': size === 'small' }">
    <div class="yiz-empty-image">
      <slot name="image">
        <svg viewBox="0 0 64 41" width="64" height="41">
          <g transform="translate(0 1)" fill="none" fill-rule="evenodd">
            <ellipse fill="#f5f5f5" cx="32" cy="33" rx="32" ry="7" />
            <g fill-rule="nonzero" stroke="#d9d9d9">
              <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
              <path
                d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                fill="#fafafa"
              />
            </g>
          </g>
        </svg>
      </slot>
    </div>
    <div class="yiz-empty-description">
      <slot name="description">
        <span>{{ description }}</span>
      </slot>
    </div>
    <div v-if="$slots.default" class="yiz-empty-footer">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    description?: string
    size?: 'default' | 'small'
  }>(),
  {
    description: '暂无数据',
    size: 'default'
  }
)

defineSlots<{
  image?: any
  description?: any
  default?: any
}>()
</script>

<style lang="less">
.yiz-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 0;
  color: #c0c4cc;
}

.yiz-empty-small {
  padding: 16px 0;
}

.yiz-empty-image {
  margin-bottom: 8px;
  line-height: 0;
}

.yiz-empty-description {
  font-size: 14px;
  color: #999;
  line-height: 1.6;
}

.yiz-empty-small .yiz-empty-description {
  font-size: 13px;
}

.yiz-empty-footer {
  margin-top: 16px;
}
</style>
