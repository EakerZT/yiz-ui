import { computed, nextTick, onBeforeUnmount, onMounted, shallowRef, watch, type Ref } from 'vue'

const modalFocusStack = shallowRef<symbol[]>([])

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter((element) => {
    return element.getAttribute('aria-hidden') !== 'true' && element.offsetParent !== null
  })
}

export function useModalFocus(visible: Ref<boolean>, containerRef: Ref<HTMLElement | undefined>) {
  const layerId = Symbol('yizModalFocus')
  const isTopLayer = computed(() => modalFocusStack.value[modalFocusStack.value.length - 1] === layerId)
  let previousFocus: HTMLElement | null = null

  function setLayerActive(active: boolean) {
    const stack = modalFocusStack.value.filter((id) => id !== layerId)
    modalFocusStack.value = active ? [...stack, layerId] : stack
  }

  function focusInitialElement() {
    const container = containerRef.value
    if (!container || !isTopLayer.value) return
    const autofocusElement = container.querySelector<HTMLElement>('[autofocus]')
    const focusTarget = autofocusElement ?? getFocusableElements(container)[0] ?? container
    focusTarget.focus({ preventScroll: true })
  }

  function restoreFocus() {
    if (previousFocus?.isConnected) {
      previousFocus.focus({ preventScroll: true })
    }
    previousFocus = null
  }

  function trapFocus(event: KeyboardEvent) {
    if (event.key !== 'Tab' || !visible.value || !isTopLayer.value) return
    const container = containerRef.value
    if (!container) return

    const focusableElements = getFocusableElements(container)
    if (focusableElements.length === 0) {
      event.preventDefault()
      container.focus({ preventScroll: true })
      return
    }

    const first = focusableElements[0]
    const last = focusableElements[focusableElements.length - 1]
    const activeElement = document.activeElement

    if (event.shiftKey && (activeElement === first || !container.contains(activeElement))) {
      event.preventDefault()
      last.focus({ preventScroll: true })
    } else if (!event.shiftKey && (activeElement === last || !container.contains(activeElement))) {
      event.preventDefault()
      first.focus({ preventScroll: true })
    }
  }

  const stopVisibleWatch = watch(
    visible,
    async (value) => {
      if (value) {
        setLayerActive(true)
        previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
        await nextTick()
        focusInitialElement()
      } else {
        setLayerActive(false)
        await nextTick()
        restoreFocus()
      }
    },
    { flush: 'post' },
  )

  const stopTopLayerWatch = watch(isTopLayer, async (value) => {
    if (!value || !visible.value) return
    await nextTick()
    if (!containerRef.value?.contains(document.activeElement)) focusInitialElement()
  })

  onMounted(async () => {
    document.addEventListener('keydown', trapFocus)
    if (!visible.value) return
    setLayerActive(true)
    previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    await nextTick()
    focusInitialElement()
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', trapFocus)
    setLayerActive(false)
    stopVisibleWatch()
    stopTopLayerWatch()
    if (visible.value) restoreFocus()
  })

  return { isTopLayer }
}
