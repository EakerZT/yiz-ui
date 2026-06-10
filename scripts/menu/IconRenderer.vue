<script lang="ts">
import { defineComponent, h } from 'vue'

export default defineComponent({
  props: {
    content: { default: null }
  },
  setup(props) {
    return () => {
      if (props.content == null) return null
      if (typeof props.content === 'function') {
        return props.content()
      }
      return props.content
    }
  }
})
</script>
