import type { LoadingBarOptions, LoadingBarPositionUsing } from './types'
import { addClass, clamp, removeClass, removeElement, toBarPerc, toCss } from './utils'

const defaultSettings: Required<LoadingBarOptions> = {
  minimum: 0.08,
  maximum: 1,
  template: `<div class="bar"><div class="peg"></div></div>
             <div class="indeterminate"><div class="inc"></div><div class="dec"></div></div>`,
  easing: 'linear',
  positionUsing: '',
  speed: 200,
  trickle: true,
  trickleSpeed: 200,
  parent: 'body',
  direction: 'ltr',
  indeterminate: false,
  indeterminateSelector: '.indeterminate',
  barSelector: '.bar',
  color: 'var(--yiz-color-primary)',
  height: '2px',
  zIndex: 9999,
}

export class LoadingBar {
  static settings: Required<LoadingBarOptions> = { ...defaultSettings }
  static status: number | null = null

  private static pending: Array<(next: () => void) => void> = []
  private static isPaused = false
  private static failOverride = false

  static reset(): typeof LoadingBar {
    this.status = null
    this.isPaused = false
    this.pending = []
    this.failOverride = false
    this.settings = { ...defaultSettings }
    return this
  }

  static configure(options: Partial<LoadingBarOptions>): typeof LoadingBar {
    Object.assign(this.settings, options)
    return this
  }

  static isStarted(): boolean {
    return typeof this.status === 'number'
  }

  static set(n: number): typeof LoadingBar {
    if (this.isPaused) return this

    const started = this.isStarted()
    n = clamp(n, this.settings.minimum, this.settings.maximum)
    this.status = n === this.settings.maximum ? null : n

    const progressElements = this.render(!started)
    const speed = this.settings.speed
    const ease = this.settings.easing

    progressElements.forEach((progress) => void progress.offsetWidth)

    this.queue((next: () => void) => {
      progressElements.forEach((progress) => {
        if (!this.settings.indeterminate) {
          const bar = progress.querySelector(this.settings.barSelector) as HTMLElement
          toCss(bar, this.barPositionCSS({ n, speed, ease }))
        }
      })

      if (n === this.settings.maximum) {
        progressElements.forEach((progress) => {
          toCss(progress, { transition: 'none', opacity: '1' })
          void progress.offsetWidth
        })
        setTimeout(() => {
          progressElements.forEach((progress) => {
            toCss(progress, {
              transition: `all ${speed}ms ${ease}`,
              opacity: '0',
            })
          })
          setTimeout(() => {
            progressElements.forEach((progress) => {
              this.remove(progress)
              if (this.settings.template === null) {
                toCss(progress, { transition: 'none', opacity: '1' })
              }
            })
            next()
          }, speed)
        }, speed)
      } else {
        setTimeout(next, speed)
      }
    })

    return this
  }

  static start(): typeof LoadingBar {
    if (!this.status) this.set(0)

    const work = () => {
      if (this.isPaused) return
      setTimeout(() => {
        if (!this.status) return
        this.trickle()
        work()
      }, this.settings.trickleSpeed)
    }

    if (this.settings.trickle) work()

    return this
  }

  static done(force?: boolean): typeof LoadingBar {
    if (!force && !this.status) return this
    return this.inc(0.3 + 0.5 * Math.random()).set(1)
  }

  static fail(force?: boolean): typeof LoadingBar {
    if (!force && !this.isStarted()) return this
    this.failOverride = true
    document.querySelectorAll('.yiz-loading-bar').forEach((el) => {
      ;(el as HTMLElement).style.setProperty('--yiz-loading-bar-color', 'var(--yiz-color-error)')
    })
    return this.done(force)
  }

  static inc(amount?: number): typeof LoadingBar {
    if (this.isPaused || this.settings.indeterminate) return this

    let n = this.status

    if (!n) {
      return this.start()
    } else if (n > 1) {
      return this
    } else {
      if (typeof amount !== 'number') {
        if (n >= 0 && n < 0.2) {
          amount = 0.1
        } else if (n >= 0.2 && n < 0.5) {
          amount = 0.04
        } else if (n >= 0.5 && n < 0.8) {
          amount = 0.02
        } else if (n >= 0.8 && n < 0.99) {
          amount = 0.005
        } else {
          amount = 0
        }
      }
      n = clamp(n + amount, 0, 0.994)
      return this.set(n)
    }
  }

  static dec(amount?: number): typeof LoadingBar {
    if (this.isPaused || this.settings.indeterminate) return this

    const n = this.status

    if (typeof n !== 'number') return this
    if (typeof amount !== 'number') {
      if (n > 0.8) {
        amount = 0.1
      } else if (n > 0.5) {
        amount = 0.05
      } else if (n > 0.2) {
        amount = 0.02
      } else {
        amount = 0.01
      }
    }

    return this.set(clamp(n - amount, 0, 0.994))
  }

  static trickle(): typeof LoadingBar {
    if (this.isPaused || this.settings.indeterminate) return this
    return this.inc()
  }

  static pause(): typeof LoadingBar {
    if (!this.isStarted() || this.settings.indeterminate) return this
    this.isPaused = true
    return this
  }

  static resume(): typeof LoadingBar {
    if (!this.isStarted() || this.settings.indeterminate) return this

    this.isPaused = false

    if (this.settings.trickle) {
      const work = () => {
        if (this.isPaused) return
        setTimeout(() => {
          if (!this.status) return
          this.trickle()
          work()
        }, this.settings.trickleSpeed)
      }
      work()
    }

    return this
  }

  static isRendered(): boolean {
    return document.querySelectorAll('.yiz-loading-bar').length > 0
  }

  static render(fromStart = false): HTMLElement[] {
    const parent =
      typeof this.settings.parent === 'string' ? document.querySelector(this.settings.parent) : this.settings.parent
    const progressElements: HTMLElement[] = parent
      ? Array.from((parent as HTMLElement).querySelectorAll('.yiz-loading-bar'))
      : []

    if (this.settings.template !== null && progressElements.length === 0) {
      addClass(document.documentElement, 'yiz-loading-bar-busy')

      const progress = document.createElement('div')
      addClass(progress, 'yiz-loading-bar')
      progress.innerHTML = this.settings.template

      if (parent !== document.body) {
        addClass(parent as HTMLElement, 'yiz-loading-bar-custom-parent')
      }

      ;(parent as HTMLElement).appendChild(progress)
      progressElements.push(progress)
    }

    const color = this.failOverride ? 'var(--yiz-color-error)' : this.settings.color

    progressElements.forEach((progress) => {
      progress.style.setProperty('--yiz-loading-bar-color', color)
      progress.style.setProperty('--yiz-loading-bar-height', this.settings.height)
      progress.style.setProperty('--yiz-loading-bar-z-index', String(this.settings.zIndex))

      if (this.settings.template === null) {
        progress.style.display = ''
      }
      addClass(document.documentElement, 'yiz-loading-bar-busy')
      if (parent !== document.body) {
        addClass(parent as HTMLElement, 'yiz-loading-bar-custom-parent')
      }

      if (!this.settings.indeterminate) {
        const bar = progress.querySelector(this.settings.barSelector) as HTMLElement
        const perc = fromStart
          ? toBarPerc(0, this.settings.direction)
          : toBarPerc(this.status || 0, this.settings.direction)
        toCss(
          bar,
          this.barPositionCSS({ n: this.status || 0, speed: this.settings.speed, ease: this.settings.easing, perc }),
        )
        const indeterminateElem = progress.querySelector(this.settings.indeterminateSelector) as HTMLElement | null
        if (indeterminateElem) {
          indeterminateElem.style.display = 'none'
        }
      } else {
        const bar = progress.querySelector(this.settings.barSelector) as HTMLElement | null
        if (bar) {
          bar.style.display = 'none'
        }
        const indeterminateElem = progress.querySelector(this.settings.indeterminateSelector) as HTMLElement | null
        if (indeterminateElem) {
          indeterminateElem.style.display = ''
        }
      }
    })

    return progressElements
  }

  static remove(progressElement?: HTMLElement): void {
    if (progressElement) {
      if (this.settings.template === null) {
        progressElement.style.display = 'none'
      } else {
        removeElement(progressElement)
      }
    } else {
      removeClass(document.documentElement, 'yiz-loading-bar-busy')
      const parent =
        typeof this.settings.parent === 'string'
          ? document.querySelectorAll(this.settings.parent)
          : [this.settings.parent]
      parent.forEach((p: Element) => {
        removeClass(p as HTMLElement, 'yiz-loading-bar-custom-parent')
      })
      const progresses = document.querySelectorAll('.yiz-loading-bar')
      progresses.forEach((progress) => {
        const elem = progress as HTMLElement
        if (this.settings.template === null) {
          elem.style.display = 'none'
        } else {
          removeElement(elem)
        }
      })
    }
    this.failOverride = false
  }

  static getPositioningCSS(): LoadingBarPositionUsing {
    const bodyStyle = document.body.style
    const vendorPrefix =
      'WebkitTransform' in bodyStyle
        ? 'Webkit'
        : 'MozTransform' in bodyStyle
          ? 'Moz'
          : 'msTransform' in bodyStyle
            ? 'ms'
            : 'OTransform' in bodyStyle
              ? 'O'
              : ''

    if (`${vendorPrefix}Perspective` in bodyStyle) {
      return 'translate3d'
    } else if (`${vendorPrefix}Transform` in bodyStyle) {
      return 'translate'
    } else {
      return 'margin'
    }
  }

  private static queue(fn: (next: () => void) => void): void {
    this.pending.push(fn)
    if (this.pending.length === 1) this.next()
  }

  private static next(): void {
    const fn = this.pending.shift()
    if (fn) fn(this.next.bind(this))
  }

  private static initPositionUsing(): void {
    if (this.settings.positionUsing === '') {
      this.settings.positionUsing = this.getPositioningCSS()
    }
  }

  private static barPositionCSS({
    n,
    speed,
    ease,
    perc,
  }: {
    n: number
    speed: number
    ease: string
    perc?: number
  }): Record<string, string> {
    this.initPositionUsing()

    let barCSS: Record<string, string> = {}

    const computedPerc = perc ?? toBarPerc(n, this.settings.direction)

    if (this.settings.positionUsing === 'translate3d') {
      barCSS = {
        transform: `translate3d(${computedPerc}%,0,0)`,
      }
    } else if (this.settings.positionUsing === 'translate') {
      barCSS = {
        transform: `translate(${computedPerc}%,0)`,
      }
    } else if (this.settings.positionUsing === 'width') {
      barCSS = {
        width: `${this.settings.direction === 'rtl' ? 100 - computedPerc : computedPerc + 100}%`,
        ...(this.settings.direction === 'rtl' ? { right: '0', left: 'auto' } : {}),
      }
    } else if (this.settings.positionUsing === 'margin') {
      barCSS =
        this.settings.direction === 'rtl'
          ? { 'margin-left': `${-computedPerc}%` }
          : { 'margin-right': `${-computedPerc}%` }
    }

    barCSS.transition = `all ${speed}ms ${ease}`

    return barCSS
  }
}
