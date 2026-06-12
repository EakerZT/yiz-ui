<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    content: { default: null }
  },
  setup(props: { content: unknown }) {
    return () => {
      if (props.content == null) return null
      if (typeof props.content === 'function') {
        return (props.content as () => unknown)()
      }
      return props.content
    }
  }
})
</script>
