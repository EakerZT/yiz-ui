export type LoadingBarDirection = 'ltr' | 'rtl'
export type LoadingBarPositionUsing = 'translate3d' | 'translate' | 'margin' | 'width' | ''

export interface LoadingBarOptions {
  minimum?: number
  maximum?: number
  template?: string | null
  easing?: string
  speed?: number
  trickle?: boolean
  trickleSpeed?: number
  parent?: HTMLElement | string
  positionUsing?: LoadingBarPositionUsing
  barSelector?: string
  indeterminateSelector?: string
  direction?: LoadingBarDirection
  indeterminate?: boolean
  color?: string
  height?: string
  zIndex?: number
}
