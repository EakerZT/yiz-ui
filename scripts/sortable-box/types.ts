export type SortableKey = string | number

export type SortableBoxMode = 'sortable' | 'source' | 'target' | 'readonly'

export type SortableDirection = 'vertical' | 'horizontal'

export type SortableDropPosition = 'before' | 'after' | 'inside'

export type SortablePullMode = true | false | 'clone'

export type SortableGroupRule =
  | boolean
  | 'clone'
  | string
  | string[]
  | ((to: SortableListContext, from: SortableListContext, item: unknown, event: PointerEvent) => SortablePullMode)

export interface SortableGroup {
  name?: string
  pull?: SortableGroupRule
  put?: SortableGroupRule
  revertClone?: boolean
}

export interface SortableListContext<T = unknown> {
  id: string
  group?: string
  mode: SortableBoxMode
  items: T[]
}

export interface SortableGuardContext<T = unknown> {
  item: T
  key: SortableKey
  from: SortableListContext<T>
  to: SortableListContext<T>
  oldIndex: number
  newIndex: number
  originalEvent: PointerEvent
}

export type SortableGuardResult = boolean | { allowed: boolean; reason?: string }

export type SortableGuard<T = unknown> = (context: SortableGuardContext<T>) => SortableGuardResult

export interface SortableFilterContext<T = unknown> {
  item: T
  key: SortableKey
  index: number
  target: HTMLElement
  originalEvent: PointerEvent
}

export type SortableFilter<T = unknown> = string | ((context: SortableFilterContext<T>) => boolean)

export interface SortableMoveEvent<T = unknown> extends SortableGuardContext<T> {
  draggedContext: {
    item: T
    index: number
    futureIndex: number
  }
  relatedContext: {
    item?: T
    index: number
    list: T[]
  }
}

export interface SortableChangeEvent<T = unknown> {
  added?: {
    element: T
    newIndex: number
  }
  removed?: {
    element: T
    oldIndex: number
  }
  moved?: {
    element: T
    oldIndex: number
    newIndex: number
  }
}

export interface SortablePreviewChange<T = unknown> {
  dragging: T
  operation: 'move' | 'clone' | 'sort'
  source: SortableListContext<T>
  target: SortableListContext<T>
  sourcePreview: T[]
  targetPreview: T[]
  oldIndex: number
  newIndex: number
}

export interface SortableEventPayload<T = unknown> {
  item: T
  key: SortableKey
  from: SortableListContext<T>
  to: SortableListContext<T>
  oldIndex: number
  newIndex: number
  originalEvent: PointerEvent
  pullMode?: SortablePullMode
}
