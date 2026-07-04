<script lang="ts">
import {
  cloneVNode,
  computed,
  defineComponent,
  h,
  isVNode,
  nextTick,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  ref,
  type ComponentPublicInstance,
  type PropType,
  type VNode,
} from 'vue'
import type {
  SortableBoxMode,
  SortableChangeEvent,
  SortableDirection,
  SortableEventPayload,
  SortableFilter,
  SortableFilterContext,
  SortableGroup,
  SortableGroupRule,
  SortableGuard,
  SortableGuardContext,
  SortableGuardResult,
  SortableKey,
  SortableListContext,
  SortableMoveEvent,
  SortablePreviewChange,
  SortablePullMode,
} from './types'

interface SortableRuntime {
  id: string
  getRoot: () => HTMLElement | null
  getItems: () => unknown[]
  getItemKey: (item: unknown) => SortableKey
  getItemEntries: () => SortableItemEntry[]
  getListContext: () => SortableListContext
  getOptions: () => RuntimeOptions
  setPreview: (items: unknown[] | null) => void
  applyList: (items: unknown[]) => void
  emitEvent: (name: SortableEmitName, payload: SortableEventPayload) => void
  emitChange: (payload: SortableChangeEvent) => void
  emitPreview: (name: SortablePreviewEmitName, payload: SortablePreviewChange) => void
}

interface RuntimeOptions {
  mode: SortableBoxMode
  group?: SortableGroup | string | null
  sort: boolean
  disabled: boolean
  direction: SortableDirection
  handleClass?: string
  filter?: SortableFilter
  preventOnFilter: boolean
  minItems?: number
  maxItems?: number
  lockedKeys: SortableKey[]
  animation: number
  easing: string
  swapThreshold: number
  invertSwap: boolean
  invertedSwapThreshold?: number
  emptyInsertThreshold: number
  ghostClass: string
  chosenClass: string
  dragClass: string
  canDrag?: SortableGuard
  canLeave?: SortableGuard
  canEnter?: SortableGuard
  canDrop?: SortableGuard
  canSort?: SortableGuard
  move?: (event: SortableMoveEvent, originalEvent: PointerEvent) => boolean | void
  clone: (item: unknown) => unknown
  createItem?: (item: unknown) => unknown
  preview: boolean
  scroll: boolean
  scrollSensitivity: number
  scrollSpeed: number
  bubbleScroll: boolean
}

interface SortableItemEntry {
  key: SortableKey
  item: unknown
  element: HTMLElement
  index: number
}

interface SortableBoxOptionOverrides extends Partial<RuntimeOptions> {}

interface PendingDrag {
  item: unknown
  key: SortableKey
  index: number
  itemElement: HTMLElement
  startX: number
  startY: number
  originalEvent: PointerEvent
}

interface ActiveDrag {
  source: SortableRuntime
  item: unknown
  payloadItem: unknown
  key: SortableKey
  sourceIndex: number
  pointerOffsetX: number
  pointerOffsetY: number
  ghost: HTMLElement
  current?: ActiveDropTarget
  originalEvent: PointerEvent
}

interface ActiveDropTarget {
  target: SortableRuntime
  newIndex: number
  pullMode: SortablePullMode
  sourcePreview: unknown[]
  targetPreview: unknown[]
  operation: 'move' | 'clone' | 'sort'
}

type SortableEmitName = 'choose' | 'unchoose' | 'start' | 'end' | 'add' | 'remove' | 'update' | 'sort' | 'filter'
type SortablePreviewEmitName = 'preview-start' | 'preview-change' | 'preview-cancel' | 'preview-commit'

const registry = new Set<SortableRuntime>()
let seed = 0
let activeDrag: ActiveDrag | null = null
let lastPointerEvent: PointerEvent | null = null
let autoScrollFrame: number | null = null

export default defineComponent({
  name: 'SortableBox',
  inheritAttrs: false,
  props: {
    list: { type: Array as PropType<unknown[] | null>, default: null },
    itemKey: { type: [String, Function] as PropType<string | ((item: unknown) => SortableKey)>, required: true },
    tag: { type: String, default: 'div' },
    componentData: { type: Object as PropType<Record<string, unknown> | null>, default: null },
    mode: { type: String as PropType<SortableBoxMode>, default: 'sortable' },
    group: { type: [String, Object] as PropType<SortableGroup | string | null>, default: null },
    sort: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    direction: { type: String as PropType<SortableDirection>, default: 'vertical' },
    handleClass: { type: String, default: undefined },
    filter: { type: [String, Function] as PropType<SortableFilter>, default: undefined },
    preventOnFilter: { type: Boolean, default: true },
    minItems: { type: Number, default: undefined },
    maxItems: { type: Number, default: undefined },
    lockedKeys: { type: Array as PropType<SortableKey[]>, default: () => [] },
    animation: { type: Number, default: 150 },
    easing: { type: String, default: 'cubic-bezier(0.2, 0, 0, 1)' },
    swapThreshold: { type: Number, default: 1 },
    invertSwap: { type: Boolean, default: false },
    invertedSwapThreshold: { type: Number, default: undefined },
    emptyInsertThreshold: { type: Number, default: 5 },
    ghostClass: { type: String, default: 'yiz-sortable-box-ghost' },
    chosenClass: { type: String, default: 'yiz-sortable-box-chosen' },
    dragClass: { type: String, default: 'yiz-sortable-box-drag' },
    clone: { type: Function as PropType<(item: unknown) => unknown>, default: (item: unknown) => item },
    createItem: { type: Function as PropType<(item: unknown) => unknown>, default: undefined },
    move: {
      type: Function as PropType<(event: SortableMoveEvent, originalEvent: PointerEvent) => boolean | void>,
      default: undefined,
    },
    canDrag: { type: Function as PropType<SortableGuard>, default: undefined },
    canLeave: { type: Function as PropType<SortableGuard>, default: undefined },
    canEnter: { type: Function as PropType<SortableGuard>, default: undefined },
    canDrop: { type: Function as PropType<SortableGuard>, default: undefined },
    canSort: { type: Function as PropType<SortableGuard>, default: undefined },
    preview: { type: Boolean, default: true },
    scroll: { type: Boolean, default: true },
    scrollSensitivity: { type: Number, default: 30 },
    scrollSpeed: { type: Number, default: 10 },
    bubbleScroll: { type: Boolean, default: true },
  },
  emits: [
    'update:list',
    'change',
    'choose',
    'unchoose',
    'start',
    'end',
    'add',
    'remove',
    'update',
    'sort',
    'filter',
    'preview-start',
    'preview-change',
    'preview-cancel',
    'preview-commit',
  ],
  setup(props, { attrs, slots, emit, expose }) {
    const rootRef = ref<HTMLElement | ComponentPublicInstance | null>(null)
    const itemElements = new Map<SortableKey, HTMLElement>()
    const previewItems = ref<unknown[] | null>(null)
    const pendingDrag = ref<PendingDrag | null>(null)
    const draggingKey = ref<SortableKey | null>(null)
    const optionOverrides = ref<SortableBoxOptionOverrides>({})
    const id = `yiz-sortable-box-${++seed}`

    const realList = computed(() => props.list ?? [])
    const renderedItems = computed(() => previewItems.value ?? realList.value)

    const runtime: SortableRuntime = {
      id,
      getRoot: () => getRootElement(),
      getItems: () => realList.value,
      getItemKey,
      getItemEntries,
      getListContext,
      getOptions,
      setPreview(items) {
        previewItems.value = items ? [...items] : null
      },
      applyList(items) {
        emit('update:list', [...items])
      },
      emitEvent(name, payload) {
        emit(name, payload)
      },
      emitChange(payload) {
        emit('change', payload)
      },
      emitPreview(name, payload) {
        emit(name, payload)
      },
    }

    function getRootElement() {
      return toElement(rootRef.value)
    }

    function toElement(value: Element | ComponentPublicInstance | null): HTMLElement | null {
      if (!value) return null
      if (typeof Element !== 'undefined' && value instanceof Element) {
        return value instanceof HTMLElement ? value : null
      }
      const componentRoot = (value as ComponentPublicInstance).$el
      return componentRoot instanceof HTMLElement ? componentRoot : null
    }

    function setItemRef(value: Element | ComponentPublicInstance | null, key: SortableKey) {
      const element = toElement(value)
      if (element) itemElements.set(key, element)
    }

    function getItemKey(item: unknown): SortableKey {
      if (typeof props.itemKey === 'function') return props.itemKey(item)
      if (item && typeof item === 'object' && props.itemKey in item) {
        const value = (item as Record<string, unknown>)[props.itemKey]
        if (typeof value === 'string' || typeof value === 'number') return value
      }
      return String(item)
    }

    function getFallbackLabel(item: unknown) {
      if (item === null || item === undefined) return ''
      if (typeof item === 'string' || typeof item === 'number') return String(item)
      return JSON.stringify(item)
    }

    function getItemClass(item: unknown) {
      const key = getItemKey(item)
      const isChosen = draggingKey.value === key
      const isHidden = isHiddenDraggingItem(key)
      return {
        'yiz-sortable-box-drag-source': isHidden,
        [props.chosenClass]: isChosen,
        [props.dragClass]: isHidden,
      }
    }

    function isHiddenDraggingItem(key: SortableKey) {
      if (!activeDrag || activeDrag.source !== runtime) return false
      if (runtime.getOptions().mode === 'source') return false
      return activeDrag.key === key
    }

    function getItemEntries(): SortableItemEntry[] {
      return renderedItems.value
        .map((item, index) => {
          const key = getItemKey(item)
          const element = itemElements.get(key)
          return element ? { key, item, element, index } : null
        })
        .filter((entry): entry is SortableItemEntry => !!entry)
    }

    function getListContext(): SortableListContext {
      return {
        id,
        group: normalizeGroup(props.group).name,
        mode: props.mode,
        items: realList.value,
      }
    }

    function getOptions(): RuntimeOptions {
      const baseOptions: RuntimeOptions = {
        mode: props.mode,
        group: props.group,
        sort: props.sort,
        disabled: props.disabled,
        direction: props.direction,
        handleClass: props.handleClass,
        filter: props.filter,
        preventOnFilter: props.preventOnFilter,
        minItems: props.minItems,
        maxItems: props.maxItems,
        lockedKeys: props.lockedKeys,
        animation: props.animation,
        easing: props.easing,
        swapThreshold: props.swapThreshold,
        invertSwap: props.invertSwap,
        invertedSwapThreshold: props.invertedSwapThreshold,
        emptyInsertThreshold: props.emptyInsertThreshold,
        ghostClass: props.ghostClass,
        chosenClass: props.chosenClass,
        dragClass: props.dragClass,
        canDrag: props.canDrag,
        canLeave: props.canLeave,
        canEnter: props.canEnter,
        canDrop: props.canDrop,
        canSort: props.canSort,
        move: props.move,
        clone: props.clone,
        createItem: props.createItem,
        preview: props.preview,
        scroll: props.scroll,
        scrollSensitivity: props.scrollSensitivity,
        scrollSpeed: props.scrollSpeed,
        bubbleScroll: props.bubbleScroll,
      }
      return { ...baseOptions, ...optionOverrides.value }
    }

    function onPointerDown(event: PointerEvent) {
      if (event.button !== 0 || event.pointerType === 'touch') return
      const options = getOptions()
      if (options.disabled || options.mode === 'readonly') return

      const root = getRootElement()
      const target = event.target as HTMLElement | null
      const itemElement = target?.closest<HTMLElement>('[data-yiz-sortable-key]')
      if (!root || !target || !itemElement || !root.contains(itemElement)) return

      const entry = getItemEntries().find((item) => item.element === itemElement)
      if (!entry) return

      if (options.handleClass && !target.closest(`.${options.handleClass}`)) return
      if (isFiltered(options.filter, entry, target, event)) {
        if (options.preventOnFilter) event.preventDefault()
        emitSortableEvent('filter', runtime, runtime, entry.item, entry.key, entry.index, entry.index, event)
        return
      }

      if (options.lockedKeys.includes(entry.key)) return
      if (
        !isGuardAllowed(
          options.canDrag,
          buildGuardContext(runtime, runtime, entry.item, entry.key, entry.index, entry.index, event),
        )
      ) {
        return
      }

      pendingDrag.value = {
        item: entry.item,
        key: entry.key,
        index: entry.index,
        itemElement,
        startX: event.clientX,
        startY: event.clientY,
        originalEvent: event,
      }

      window.addEventListener('pointermove', onPendingPointerMove)
      window.addEventListener('pointerup', cancelPendingDrag, { once: true })
    }

    function isFiltered(
      filter: SortableFilter | undefined,
      entry: SortableItemEntry,
      target: HTMLElement,
      event: PointerEvent,
    ) {
      if (!filter) return false
      if (typeof filter === 'string') return !!target.closest(filter)
      const context: SortableFilterContext = {
        item: entry.item,
        key: entry.key,
        index: entry.index,
        target,
        originalEvent: event,
      }
      return filter(context)
    }

    function onPendingPointerMove(event: PointerEvent) {
      const pending = pendingDrag.value
      if (!pending) return
      const distance = Math.max(Math.abs(event.clientX - pending.startX), Math.abs(event.clientY - pending.startY))
      if (distance < 3) return
      window.removeEventListener('pointermove', onPendingPointerMove)
      startDrag(pending, event)
    }

    function cancelPendingDrag() {
      window.removeEventListener('pointermove', onPendingPointerMove)
      pendingDrag.value = null
    }

    function startDrag(pending: PendingDrag, event: PointerEvent) {
      if (activeDrag) return
      pendingDrag.value = null
      const rect = pending.itemElement.getBoundingClientRect()
      const ghost = pending.itemElement.cloneNode(true) as HTMLElement
      const options = getOptions()
      ghost.classList.add(options.ghostClass)
      ghost.style.position = 'fixed'
      ghost.style.top = `${rect.top}px`
      ghost.style.left = `${rect.left}px`
      ghost.style.width = `${rect.width}px`
      ghost.style.height = `${rect.height}px`
      ghost.style.pointerEvents = 'none'
      ghost.style.zIndex = '100000'
      ghost.style.margin = '0'
      document.body.appendChild(ghost)

      draggingKey.value = pending.key
      activeDrag = {
        source: runtime,
        item: pending.item,
        payloadItem: createPayloadItem(runtime, pending.item),
        key: pending.key,
        sourceIndex: pending.index,
        pointerOffsetX: event.clientX - rect.left,
        pointerOffsetY: event.clientY - rect.top,
        ghost,
        originalEvent: pending.originalEvent,
      }

      document.body.classList.add('yiz-sortable-box-body-dragging')
      emitSortableEvent('choose', runtime, runtime, pending.item, pending.key, pending.index, pending.index, event)
      emitSortableEvent('start', runtime, runtime, pending.item, pending.key, pending.index, pending.index, event)
      emitPreview('preview-start')

      window.addEventListener('pointermove', onGlobalPointerMove)
      window.addEventListener('pointerup', onGlobalPointerUp, { once: true })
      updateDrag(event)
    }

    function onGlobalPointerMove(event: PointerEvent) {
      updateDrag(event)
    }

    function onGlobalPointerUp(event: PointerEvent) {
      window.removeEventListener('pointermove', onGlobalPointerMove)
      commitDrag(event)
    }

    function updateDrag(event: PointerEvent) {
      if (!activeDrag) return
      lastPointerEvent = event
      activeDrag.ghost.style.left = `${event.clientX - activeDrag.pointerOffsetX}px`
      activeDrag.ghost.style.top = `${event.clientY - activeDrag.pointerOffsetY}px`

      activeDrag.ghost.style.display = 'none'
      const targetElement = document.elementFromPoint(event.clientX, event.clientY)
      activeDrag.ghost.style.display = ''

      const target = findRuntime(targetElement) ?? findNearestEmptyRuntime(event)
      if (!target) {
        clearCurrentPreview()
        return
      }

      const index = getInsertIndex(target, event)
      if (index === null) return
      const proposal = buildPreview(target, index, event)
      if (!proposal) {
        clearCurrentPreview()
        return
      }

      setCurrentPreview(proposal, event)
      scheduleAutoScroll()
    }

    function scheduleAutoScroll() {
      if (autoScrollFrame !== null) return
      autoScrollFrame = requestAnimationFrame(runAutoScroll)
    }

    function runAutoScroll() {
      autoScrollFrame = null
      if (!activeDrag || !lastPointerEvent) return
      const options = activeDrag.current?.target.getOptions() ?? activeDrag.source.getOptions()
      if (!options.scroll) return

      activeDrag.ghost.style.display = 'none'
      const element = document.elementFromPoint(lastPointerEvent.clientX, lastPointerEvent.clientY)
      activeDrag.ghost.style.display = ''

      const scrollers = getScrollParents(element, options.bubbleScroll)
      const didScroll = scrollers.some((scroller) =>
        scrollByPointer(scroller, lastPointerEvent as PointerEvent, options.scrollSensitivity, options.scrollSpeed),
      )

      if (didScroll) {
        updateDrag(lastPointerEvent)
        scheduleAutoScroll()
      }
    }

    function getScrollParents(element: Element | null, bubble: boolean) {
      const result: HTMLElement[] = []
      let current = element?.parentElement ?? null
      while (current) {
        if (isScrollable(current)) {
          result.push(current)
          if (!bubble) return result
        }
        current = current.parentElement
      }
      const scrollingElement = document.scrollingElement
      if (scrollingElement instanceof HTMLElement && !result.includes(scrollingElement)) result.push(scrollingElement)
      return result
    }

    function isScrollable(element: HTMLElement) {
      const style = getComputedStyle(element)
      const canScrollY = element.scrollHeight > element.clientHeight && ['auto', 'scroll'].includes(style.overflowY)
      const canScrollX = element.scrollWidth > element.clientWidth && ['auto', 'scroll'].includes(style.overflowX)
      return canScrollX || canScrollY
    }

    function scrollByPointer(element: HTMLElement, event: PointerEvent, sensitivity: number, speed: number) {
      const rect = element === document.scrollingElement ? getViewportRect() : element.getBoundingClientRect()
      let dx = 0
      let dy = 0
      if (event.clientX - rect.left <= sensitivity && element.scrollLeft > 0) dx = -speed
      else if (
        rect.right - event.clientX <= sensitivity &&
        element.scrollLeft + element.clientWidth < element.scrollWidth
      )
        dx = speed
      if (event.clientY - rect.top <= sensitivity && element.scrollTop > 0) dy = -speed
      else if (
        rect.bottom - event.clientY <= sensitivity &&
        element.scrollTop + element.clientHeight < element.scrollHeight
      )
        dy = speed
      if (!dx && !dy) return false
      element.scrollLeft += dx
      element.scrollTop += dy
      return true
    }

    function getViewportRect() {
      return {
        left: 0,
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
      }
    }

    function findRuntime(target: Element | null) {
      if (!target) return null
      let result: SortableRuntime | null = null
      registry.forEach((item) => {
        const root = item.getRoot()
        if (!root || !root.contains(target)) return
        if (!result) {
          result = item
          return
        }
        const resultRoot = result.getRoot()
        if (resultRoot && resultRoot.contains(root)) result = item
      })
      return result
    }

    function findNearestEmptyRuntime(event: PointerEvent) {
      let result: SortableRuntime | null = null
      let resultDistance = Infinity
      registry.forEach((item) => {
        if (item.getItemEntries().length) return
        const root = item.getRoot()
        if (!root) return
        const threshold = item.getOptions().emptyInsertThreshold
        if (threshold <= 0) return
        const rect = root.getBoundingClientRect()
        const distance = getDistanceToRect(event.clientX, event.clientY, rect)
        if (distance > threshold || distance >= resultDistance) return
        result = item
        resultDistance = distance
      })
      return result
    }

    function getDistanceToRect(x: number, y: number, rect: DOMRect) {
      const dx = Math.max(rect.left - x, 0, x - rect.right)
      const dy = Math.max(rect.top - y, 0, y - rect.bottom)
      return Math.hypot(dx, dy)
    }

    function getInsertIndex(target: SortableRuntime, event: PointerEvent): number | null {
      const options = target.getOptions()
      const entries = target.getItemEntries()
      if (!entries.length) return 0
      const pointer = options.direction === 'horizontal' ? event.clientX : event.clientY
      for (const entry of entries) {
        const rect = entry.element.getBoundingClientRect()
        const start = options.direction === 'horizontal' ? rect.left : rect.top
        const end = options.direction === 'horizontal' ? rect.right : rect.bottom
        const length = Math.max(end - start, 1)
        const threshold = clampThreshold(
          options.invertSwap ? (options.invertedSwapThreshold ?? options.swapThreshold) : options.swapThreshold,
        )
        const beforeEnd = start + (length * threshold) / 2
        const afterStart = end - (length * threshold) / 2
        if (pointer < start) return entry.index
        if (pointer <= beforeEnd) return entry.index
        if (pointer < afterStart) return activeDrag?.current?.target === target ? activeDrag.current.newIndex : null
        if (pointer <= end) return entry.index + 1
      }
      return entries.length
    }

    function clampThreshold(value: number | undefined) {
      if (value === undefined || Number.isNaN(value)) return 1
      return Math.max(0, Math.min(value, 1))
    }

    function buildPreview(target: SortableRuntime, index: number, event: PointerEvent): ActiveDropTarget | null {
      if (!activeDrag) return null
      const source = activeDrag.source
      const sourceItems = source.getItems()
      const targetItems = target.getItems()
      const sameList = source === target
      const pullMode = getPullMode(source, target, event)
      if (pullMode === false) return null

      const targetIndex = Math.max(0, Math.min(index, targetItems.length))
      if (!canDropToTarget(target, targetIndex, pullMode, event)) return null

      if (sameList) {
        const options = source.getOptions()
        if (!options.sort || options.mode === 'source') return null
        const currentItems = activeDrag.current?.target === source ? activeDrag.current.sourcePreview : sourceItems
        const currentIndex = currentItems.indexOf(activeDrag.item)
        if (currentIndex < 0) return activeDrag.current ?? null
        if (
          !isGuardAllowed(
            options.canSort,
            buildGuardContext(
              source,
              target,
              activeDrag.item,
              activeDrag.key,
              activeDrag.sourceIndex,
              targetIndex,
              event,
            ),
          )
        ) {
          return null
        }
        const next = moveItem(currentItems, currentIndex, targetIndex)
        if (arraysHaveSameOrder(currentItems, next)) return activeDrag.current ?? null
        const nextIndex = next.indexOf(activeDrag.item)
        if (options.move && options.move(buildMoveEvent(source, target, nextIndex, event), event) === false) return null
        return {
          target,
          newIndex: nextIndex,
          pullMode,
          sourcePreview: next,
          targetPreview: next,
          operation: 'sort',
        }
      }

      if (!canLeaveSource(source, target, pullMode, event)) return null
      const sourcePreview = pullMode === 'clone' ? [...sourceItems] : removeAt(sourceItems, activeDrag.sourceIndex)
      const payload = pullMode === 'clone' ? activeDrag.payloadItem : activeDrag.item
      const targetPreview = insertAt(targetItems, targetIndex, payload)
      const targetMove = target.getOptions().move
      if (targetMove && targetMove(buildMoveEvent(source, target, targetIndex, event), event) === false) return null
      return {
        target,
        newIndex: targetIndex,
        pullMode,
        sourcePreview,
        targetPreview,
        operation: pullMode === 'clone' ? 'clone' : 'move',
      }
    }

    function getPullMode(source: SortableRuntime, target: SortableRuntime, event: PointerEvent): SortablePullMode {
      if (!activeDrag) return false
      if (source === target) return true
      const sourceOptions = source.getOptions()
      const targetOptions = target.getOptions()
      if (sourceOptions.mode === 'readonly' || targetOptions.mode === 'readonly' || targetOptions.mode === 'source')
        return false
      if (sourceOptions.mode === 'target') return false
      const sourceGroup = normalizeGroup(sourceOptions.group)
      const targetGroup = normalizeGroup(targetOptions.group)
      if (!sourceGroup.name || !targetGroup.name || sourceGroup.name !== targetGroup.name) return false
      const pull =
        sourceOptions.mode === 'source'
          ? 'clone'
          : evaluateGroupRule(sourceGroup.pull, target, source, activeDrag.item, event, true)
      if (pull === false) return false
      const put = evaluateGroupRule(targetGroup.put, target, source, activeDrag.item, event, false)
      return put ? pull : false
    }

    function evaluateGroupRule(
      rule: SortableGroupRule | undefined,
      to: SortableRuntime,
      from: SortableRuntime,
      item: unknown,
      event: PointerEvent,
      isPull: boolean,
    ): SortablePullMode {
      const toContext = to.getListContext()
      const fromContext = from.getListContext()
      if (rule === undefined || rule === null) return true
      if (typeof rule === 'function') return rule(toContext, fromContext, item, event)
      if (rule === 'clone' && isPull) return 'clone'
      if (typeof rule === 'boolean') return rule
      const otherGroup = isPull ? toContext.group : fromContext.group
      if (typeof rule === 'string') return rule === otherGroup
      return !!otherGroup && rule.includes(otherGroup)
    }

    function canLeaveSource(
      source: SortableRuntime,
      target: SortableRuntime,
      pullMode: SortablePullMode,
      event: PointerEvent,
    ) {
      if (!activeDrag || pullMode === 'clone') return true
      const options = source.getOptions()
      if (options.mode === 'source' || options.mode === 'readonly') return false
      if (options.minItems !== undefined && source.getItems().length <= options.minItems) return false
      return isGuardAllowed(
        options.canLeave,
        buildGuardContext(
          source,
          target,
          activeDrag.item,
          activeDrag.key,
          activeDrag.sourceIndex,
          activeDrag.sourceIndex,
          event,
        ),
      )
    }

    function canDropToTarget(target: SortableRuntime, index: number, pullMode: SortablePullMode, event: PointerEvent) {
      if (!activeDrag) return false
      const options = target.getOptions()
      const targetItems = target.getItems()
      const isSame = target === activeDrag.source
      if (options.disabled || options.mode === 'readonly' || options.mode === 'source') return false
      if (!isSame && options.maxItems !== undefined && targetItems.length >= options.maxItems) return false
      const context = buildGuardContext(
        activeDrag.source,
        target,
        activeDrag.item,
        activeDrag.key,
        activeDrag.sourceIndex,
        index,
        event,
      )
      if (!isGuardAllowed(options.canEnter, context)) return false
      if (!isGuardAllowed(options.canDrop, context)) return false
      if (pullMode !== 'clone' && activeDrag.source.getOptions().lockedKeys.includes(activeDrag.key)) return false
      return true
    }

    function setCurrentPreview(proposal: ActiveDropTarget, event: PointerEvent) {
      if (!activeDrag) return
      const previous = activeDrag.current
      if (
        previous &&
        previous.target === proposal.target &&
        previous.newIndex === proposal.newIndex &&
        previous.pullMode === proposal.pullMode
      ) {
        return
      }
      const animatedTargets = getUniqueRuntimes(activeDrag.source, proposal.target)
      const firstRects = captureRuntimeRects(animatedTargets)
      clearPreviewOnly()
      activeDrag.current = proposal
      activeDrag.source.setPreview(proposal.sourcePreview)
      if (proposal.target !== activeDrag.source) proposal.target.setPreview(proposal.targetPreview)
      animateRuntimeChanges(firstRects)
      emitPreview('preview-change', event)
    }

    function clearCurrentPreview() {
      if (!activeDrag?.current) return
      emitPreview('preview-cancel')
      clearPreviewOnly()
      activeDrag.current = undefined
    }

    function clearPreviewOnly() {
      if (!activeDrag?.current) return
      activeDrag.source.setPreview(null)
      activeDrag.current.target.setPreview(null)
    }

    function commitDrag(event: PointerEvent) {
      if (!activeDrag) return
      const drag = activeDrag
      const current = drag.current
      if (current) {
        applyCommittedPreview(current, event)
        emitPreview('preview-commit', event)
      } else {
        emitPreview('preview-cancel', event)
      }
      emitSortableEvent(
        'unchoose',
        drag.source,
        current?.target ?? drag.source,
        drag.item,
        drag.key,
        drag.sourceIndex,
        current?.newIndex ?? drag.sourceIndex,
        event,
        current?.pullMode,
      )
      emitSortableEvent(
        'end',
        drag.source,
        current?.target ?? drag.source,
        drag.item,
        drag.key,
        drag.sourceIndex,
        current?.newIndex ?? drag.sourceIndex,
        event,
        current?.pullMode,
      )
      cleanupDrag()
    }

    function applyCommittedPreview(current: ActiveDropTarget, event: PointerEvent) {
      if (!activeDrag) return
      const source = activeDrag.source
      const target = current.target
      const sameList = source === target
      if (sameList) {
        source.applyList(current.sourcePreview)
        const payload = buildEventPayload(
          source,
          target,
          activeDrag.item,
          activeDrag.key,
          activeDrag.sourceIndex,
          current.newIndex,
          event,
          current.pullMode,
        )
        source.emitEvent('update', payload)
        source.emitEvent('sort', payload)
        source.emitChange({
          moved: { element: activeDrag.item, oldIndex: activeDrag.sourceIndex, newIndex: current.newIndex },
        })
        return
      }

      if (current.pullMode !== 'clone') {
        source.applyList(current.sourcePreview)
        const removePayload = buildEventPayload(
          source,
          target,
          activeDrag.item,
          activeDrag.key,
          activeDrag.sourceIndex,
          current.newIndex,
          event,
          current.pullMode,
        )
        source.emitEvent('remove', removePayload)
        source.emitEvent('sort', removePayload)
        source.emitChange({ removed: { element: activeDrag.item, oldIndex: activeDrag.sourceIndex } })
      }

      target.applyList(current.targetPreview)
      const addedItem = current.pullMode === 'clone' ? activeDrag.payloadItem : activeDrag.item
      const addPayload = buildEventPayload(
        source,
        target,
        addedItem,
        target.getItemKey(addedItem),
        activeDrag.sourceIndex,
        current.newIndex,
        event,
        current.pullMode,
      )
      target.emitEvent('add', addPayload)
      target.emitEvent('sort', addPayload)
      target.emitChange({ added: { element: addedItem, newIndex: current.newIndex } })
    }

    function cleanupDrag() {
      if (!activeDrag) return
      clearPreviewOnly()
      activeDrag.ghost.remove()
      activeDrag = null
      lastPointerEvent = null
      if (autoScrollFrame !== null) {
        cancelAnimationFrame(autoScrollFrame)
        autoScrollFrame = null
      }
      draggingKey.value = null
      document.body.classList.remove('yiz-sortable-box-body-dragging')
    }

    function emitPreview(name: SortablePreviewEmitName, event?: PointerEvent) {
      if (!activeDrag) return
      const current = activeDrag.current
      const target = current?.target ?? activeDrag.source
      const payload: SortablePreviewChange = {
        dragging: current?.pullMode === 'clone' ? activeDrag.payloadItem : activeDrag.item,
        operation: current?.operation ?? 'sort',
        source: activeDrag.source.getListContext(),
        target: target.getListContext(),
        sourcePreview: current?.sourcePreview ?? activeDrag.source.getItems(),
        targetPreview: current?.targetPreview ?? target.getItems(),
        oldIndex: activeDrag.sourceIndex,
        newIndex: current?.newIndex ?? activeDrag.sourceIndex,
      }
      if (activeDrag.source.getOptions().preview) activeDrag.source.emitPreview(name, payload)
      if (target !== activeDrag.source && target.getOptions().preview) target.emitPreview(name, payload)
      if (event) event.preventDefault()
    }

    function emitSortableEvent(
      name: SortableEmitName,
      source: SortableRuntime,
      target: SortableRuntime,
      item: unknown,
      key: SortableKey,
      oldIndex: number,
      newIndex: number,
      event: PointerEvent,
      pullMode?: SortablePullMode,
    ) {
      source.emitEvent(name, buildEventPayload(source, target, item, key, oldIndex, newIndex, event, pullMode))
    }

    function buildEventPayload(
      source: SortableRuntime,
      target: SortableRuntime,
      item: unknown,
      key: SortableKey,
      oldIndex: number,
      newIndex: number,
      event: PointerEvent,
      pullMode?: SortablePullMode,
    ): SortableEventPayload {
      return {
        item,
        key,
        from: source.getListContext(),
        to: target.getListContext(),
        oldIndex,
        newIndex,
        originalEvent: event,
        pullMode,
      }
    }

    function buildMoveEvent(
      source: SortableRuntime,
      target: SortableRuntime,
      index: number,
      event: PointerEvent,
    ): SortableMoveEvent {
      if (!activeDrag) throw new Error('No active drag')
      const targetItems = target.getItems()
      const relatedIndex = Math.min(index, Math.max(targetItems.length - 1, 0))
      return {
        ...buildGuardContext(source, target, activeDrag.item, activeDrag.key, activeDrag.sourceIndex, index, event),
        draggedContext: {
          item: activeDrag.item,
          index: activeDrag.sourceIndex,
          futureIndex: index,
        },
        relatedContext: {
          item: targetItems[relatedIndex],
          index,
          list: targetItems,
        },
      }
    }

    function buildGuardContext(
      source: SortableRuntime,
      target: SortableRuntime,
      item: unknown,
      key: SortableKey,
      oldIndex: number,
      newIndex: number,
      event: PointerEvent,
    ): SortableGuardContext {
      return {
        item,
        key,
        from: source.getListContext(),
        to: target.getListContext(),
        oldIndex,
        newIndex,
        originalEvent: event,
      }
    }

    function isGuardAllowed(guard: SortableGuard | undefined, context: SortableGuardContext) {
      if (!guard) return true
      const result: SortableGuardResult = guard(context)
      if (typeof result === 'boolean') return result
      return result.allowed
    }

    function normalizeGroup(group: SortableGroup | string | null | undefined): SortableGroup {
      if (!group) return {}
      if (typeof group === 'string') return { name: group }
      return group
    }

    function createPayloadItem(source: SortableRuntime, item: unknown) {
      const options = source.getOptions()
      if (options.createItem) return options.createItem(item)
      return options.clone(item)
    }

    function moveItem(items: unknown[], oldIndex: number, targetIndex: number) {
      const next = [...items]
      const [item] = next.splice(oldIndex, 1)
      next.splice(normalizeMoveIndex(oldIndex, targetIndex), 0, item)
      return next
    }

    function normalizeMoveIndex(oldIndex: number, targetIndex: number) {
      return oldIndex < targetIndex ? targetIndex - 1 : targetIndex
    }

    function removeAt(items: unknown[], index: number) {
      const next = [...items]
      next.splice(index, 1)
      return next
    }

    function insertAt(items: unknown[], index: number, item: unknown) {
      const next = [...items]
      next.splice(index, 0, item)
      return next
    }

    function getUniqueRuntimes(...items: SortableRuntime[]) {
      return Array.from(new Set(items))
    }

    function captureRuntimeRects(items: SortableRuntime[]) {
      return new Map(
        items.map((item) => [
          item,
          new Map(item.getItemEntries().map((entry) => [entry.key, entry.element.getBoundingClientRect()])),
        ]),
      )
    }

    function animateRuntimeChanges(firstRects: Map<SortableRuntime, Map<SortableKey, DOMRect>>) {
      nextTick(() => {
        firstRects.forEach((rects, item) => animateRuntimeItems(item, rects))
      })
    }

    function animateRuntimeItems(item: SortableRuntime, firstRects: Map<SortableKey, DOMRect>) {
      const options = item.getOptions()
      if (options.animation <= 0) return
      item.getItemEntries().forEach((entry) => {
        const first = firstRects.get(entry.key)
        if (!first) return
        const last = entry.element.getBoundingClientRect()
        const dx = first.left - last.left
        const dy = first.top - last.top
        if (!dx && !dy) return
        entry.element.style.transition = 'none'
        entry.element.style.transform = `translate3d(${dx}px, ${dy}px, 0)`
        entry.element.getBoundingClientRect()
        entry.element.style.transition = `transform ${options.animation}ms ${options.easing}`
        entry.element.style.transform = ''
        window.setTimeout(() => {
          entry.element.style.transition = ''
          entry.element.style.transform = ''
        }, options.animation)
      })
    }

    function arraysHaveSameOrder(left: unknown[], right: unknown[]) {
      return left.length === right.length && left.every((item, index) => item === right[index])
    }

    function toArray() {
      return realList.value.map((item) => String(getItemKey(item)))
    }

    function sort(order: SortableKey[]) {
      const firstRects = captureRuntimeRects([runtime])
      const map = new Map(realList.value.map((item) => [getItemKey(item), item]))
      const sorted = order.map((key) => map.get(key)).filter((item) => item !== undefined)
      const rest = realList.value.filter((item) => !order.includes(getItemKey(item)))
      runtime.applyList([...sorted, ...rest])
      animateRuntimeChanges(firstRects)
    }

    function option<T extends keyof RuntimeOptions>(name: T): RuntimeOptions[T]
    function option<T extends keyof RuntimeOptions>(name: T, value: RuntimeOptions[T]): void
    function option<T extends keyof RuntimeOptions>(name: T, value?: RuntimeOptions[T]) {
      if (arguments.length === 1) return getOptions()[name]
      optionOverrides.value = {
        ...optionOverrides.value,
        [name]: value,
      }
    }

    function renderItem(item: unknown, index: number): VNode {
      const key = getItemKey(item)
      const nodes = slots.item?.({ element: item, index }).filter(isVNode) ?? []
      const node = nodes[0] ?? h('div', getFallbackLabel(item))
      return cloneVNode(
        node,
        {
          key,
          ref: (value: Element | ComponentPublicInstance | null) => setItemRef(value, key),
          'data-yiz-sortable-key': String(key),
          class: getItemClass(item),
        },
        true,
      )
    }

    onMounted(() => {
      registry.add(runtime)
    })

    onBeforeUpdate(() => {
      itemElements.clear()
    })

    onBeforeUnmount(() => {
      registry.delete(runtime)
      if (activeDrag?.source === runtime || activeDrag?.current?.target === runtime) cleanupDrag()
      cancelPendingDrag()
    })

    expose({
      option,
      toArray,
      sort,
    })

    return () => {
      const children = [
        ...(slots.header?.() ?? []),
        ...renderedItems.value.map((item, index) => renderItem(item, index)),
        ...(slots.footer?.() ?? []),
      ]
      return h(
        props.tag,
        {
          ...attrs,
          ...(props.componentData ?? {}),
          ref: rootRef,
          class: [
            attrs.class,
            props.componentData?.class,
            'yiz-sortable-box',
            {
              [`yiz-sortable-box-mode-${props.mode}`]: true,
              'yiz-sortable-box-disabled': props.disabled,
              'yiz-sortable-box-previewing': !!previewItems.value,
            },
          ],
          onPointerdown: onPointerDown,
        },
        children,
      )
    }
  },
})
</script>

<style lang="less">
.yiz-sortable-box-ghost {
  pointer-events: none;
}

.yiz-sortable-box-drag-source {
  visibility: hidden;
}

.yiz-sortable-box-body-dragging {
  user-select: none;
}
</style>
