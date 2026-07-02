<script lang="ts">
import { h, defineComponent } from 'vue'

export default defineComponent({
  name: 'CellRenderer',
  props: {
    renderFn: Function,
    formatter: Function,
    value: {},
    row: { type: Object, default: () => ({}) },
    index: { type: Number, default: 0 }
  },
  setup(props) {
    return () => {
      const fn = props.renderFn as Function | undefined
      if (typeof fn === 'function') {
        const result = fn({ value: props.value, row: props.row, index: props.index })
        if (Array.isArray(result)) return result
        if (result != null) return result
        return null
      }
      const formatter = props.formatter as Function | undefined
      if (typeof formatter === 'function') {
        const result = formatter(props.value, props.row, props.index)
        if (Array.isArray(result)) return result
        if (result != null) return result
        return null
      }
      return h('span', String(props.value ?? ''))
    }
  }
})
</script>

<template></template>
